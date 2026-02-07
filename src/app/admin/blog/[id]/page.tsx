
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BlogEditor } from '@/components/admin/BlogEditor'

export const revalidate = 0

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditBlogPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: blog } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single()

    if (!blog) {
        notFound()
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Edit Post</h1>
            <BlogEditor initialBlog={blog} />
        </div>
    )
}
