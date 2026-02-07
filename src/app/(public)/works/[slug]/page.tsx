
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { BlockRenderer, Block } from '@/components/content/BlockRenderer'

export const revalidate = 60

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function WorkDetailPage({ params }: PageProps) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: work } = await supabase
        .from('works')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

    if (!work) {
        notFound()
    }

    return (
        <article className="container mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
            <header className="mb-8">
                <h1 className="mb-4 text-3xl font-bold md:text-4xl text-gray-900 dark:text-gray-50">{work.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <Badge variant="secondary" className="bg-[#FF7B54] text-white hover:bg-[#FF7B54]/90 rounded-full px-3">
                        {work.year}
                    </Badge>
                    <span className="text-gray-500 dark:text-gray-400 font-medium">{work.category}</span>
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    {work.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                    {work.tags?.map((tag: string) => (
                        <span key={tag} className="text-sm text-gray-500 dark:text-gray-400">#{tag}</span>
                    ))}
                </div>
            </header>

            <div className="prose prose-lg max-w-none dark:prose-invert">
                {work.content && typeof work.content === 'object' && 'blocks' in work.content ? (
                    <BlockRenderer blocks={(work.content as { blocks: Block[] }).blocks} />
                ) : null}
            </div>
        </article>
    )
}
