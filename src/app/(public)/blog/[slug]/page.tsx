
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { InteractiveRenderer } from '@/components/content/InteractiveRenderer'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)
    const supabase = await createClient()

    const { data: blog } = await supabase
        .from('blogs')
        .select('title, excerpt')
        .eq('slug', decodedSlug)
        .eq('published', true)
        .single()

    if (!blog) return {}

    return {
        title: blog.title,
        description: blog.excerpt,
    }
}

export default async function BlogDetailPage({ params }: PageProps) {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)
    const supabase = await createClient()

    const { data: blog } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', decodedSlug)
        .eq('published', true)
        .single()

    if (!blog) {
        notFound()
    }

    // Format date
    const publishDate = blog.published_at
        ? new Date(blog.published_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : 'Unknown Date'

    return (
        <article className="container mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
            <header className="mb-8">
                <h1 className="mb-4 text-3xl font-heading font-bold md:text-4xl text-gray-900 dark:text-gray-50 leading-tight">
                    {blog.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-500 dark:text-gray-400 font-medium">
                    <time dateTime={blog.published_at}>{publishDate}</time>
                    <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                    <div className="flex gap-2 font-mono text-sm">
                        {blog.tags?.map((tag: string) => (
                            <span key={tag} className="hover:text-[#F3434F] transition-colors cursor-default">#{tag}</span>
                        ))}
                    </div>
                </div>
            </header>

            <div className="mt-8">
                {blog.content?.html && (
                    <InteractiveRenderer html={blog.content.html} />
                )}
            </div>
        </article>
    )
}
