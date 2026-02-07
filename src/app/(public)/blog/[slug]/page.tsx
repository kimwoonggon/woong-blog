
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BlockRenderer, Block } from '@/components/content/BlockRenderer'

export const revalidate = 60

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function BlogDetailPage({ params }: PageProps) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: blog } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

    if (!blog) {
        notFound()
    }

    return (
        <article className="container mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
            <header className="mb-8">
                <h1 className="mb-4 text-3xl font-bold md:text-4xl text-gray-900 dark:text-gray-50">{blog.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={blog.published_at}>{blog.published_at}</time>
                    <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                    <div className="flex gap-2">
                        {blog.tags?.map((tag: string) => (
                            <span key={tag}>#{tag}</span>
                        ))}
                    </div>
                </div>
            </header>

            <div className="prose prose-lg max-w-none dark:prose-invert">
                {blog.content && typeof blog.content === 'object' && 'blocks' in blog.content ? (
                    <BlockRenderer blocks={(blog.content as { blocks: Block[] }).blocks} />
                ) : null}
            </div>
        </article>
    )
}
