
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
        .select('*')
        .eq('id', id)
        .single()

    if (!work) {
        notFound()
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Edit Work</h1>
            <WorkEditor initialWork={work} />
        </div>
    )
}
