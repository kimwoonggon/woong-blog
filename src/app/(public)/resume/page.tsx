
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export const revalidate = 60

export default async function ResumePage() {
    const supabase = await createClient()

    const { data: settings } = await supabase
        .from('site_settings')
        .select('resume_asset_id')
        .single()

    let resumeUrl = null

    if (settings?.resume_asset_id) {
        const { data: asset } = await supabase
            .from('assets')
            .select('bucket, path')
            .eq('id', settings.resume_asset_id)
            .single()

        if (asset) {
            const { data } = supabase.storage.from(asset.bucket).getPublicUrl(asset.path)
            resumeUrl = data.publicUrl
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 h-[calc(100vh-64px-72px)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Resume</h1>
                {resumeUrl && (
                    <Button asChild>
                        <a href={resumeUrl} download target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-4 w-4" /> Download
                        </a>
                    </Button>
                )}
            </div>

            <div className="flex-1 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                {resumeUrl ? (
                    <iframe
                        src={`${resumeUrl}#toolbar=0`}
                        className="h-full w-full"
                        title="Resume PDF"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                        No resume uploaded yet.
                    </div>
                )}
            </div>
        </div>
    )
}
