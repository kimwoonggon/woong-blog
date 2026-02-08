
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
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

    const { data: work } = await supabase
        .from('works')
        .select('title, excerpt')
        .eq('slug', decodedSlug)
        .eq('published', true)
        .single()

    if (!work) return {}

    return {
        title: work.title,
        description: work.excerpt,
    }
}

export default async function WorkDetailPage({ params }: PageProps) {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)
    const supabase = await createClient()

    const { data: work } = await supabase
        .from('works')
        .select('*')
        .eq('slug', decodedSlug)
        .eq('published', true)
        .single()

    if (!work) {
        notFound()
    }

    // Format date
    const publishDate = work.published_at
        ? new Date(work.published_at).toLocaleDateString('en-US', {
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
                <h1 className="mb-4 text-3xl font-bold md:text-4xl text-gray-900 dark:text-gray-50 leading-tight">
                    {work.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <Badge variant="secondary" className="bg-[#FF7B54] text-white hover:bg-[#FF7B54]/90 rounded-full px-3">
                        {publishDate}
                    </Badge>
                    <span className="text-gray-500 dark:text-gray-400 font-medium">{work.category}</span>
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed border-l-4 border-[#FF7B54] pl-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-r-lg">
                    {work.excerpt}
                </p>
                <div className="mt-8 flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {work.tags?.map((tag: string) => (
                        <span key={tag} className="hover:text-[#FF7B54] transition-colors cursor-default">#{tag}</span>
                    ))}
                </div>
            </header>

            <div className="mt-8">
                {work.content?.html && (
                    <InteractiveRenderer html={work.content.html} />
                )}
            </div>
        </article>
    )
}
