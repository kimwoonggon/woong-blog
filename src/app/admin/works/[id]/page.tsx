
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WorkEditor } from '@/components/admin/WorkEditor'

export const revalidate = 0

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditWorkPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: work } = await supabase
        .from('works')
        .select(`
            *,
            thumbnail:thumbnail_asset_id (
                bucket,
                path
            )
        `)
        .eq('id', id)
        .single()

    if (!work) {
        notFound()
    }

    // Resolve thumbnail URL
    let thumbnailUrl = null
    if (work.thumbnail) {
        const { data: { publicUrl } } = supabase.storage.from(work.thumbnail.bucket).getPublicUrl(work.thumbnail.path)
        thumbnailUrl = publicUrl
    }

    const initialWork = {
        ...work,
        thumbnail_url: thumbnailUrl
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Edit Work</h1>
            <WorkEditor initialWork={initialWork} />
        </div>
    )
}
