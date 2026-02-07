
import { createClient } from '@/lib/supabase/server'
import { BlockRenderer, Block } from '@/components/content/BlockRenderer'

export const revalidate = 60

export default async function IntroductionPage() {
    const supabase = await createClient()

    const { data: page } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'introduction')
        .single()

    const title = page?.title || 'Introduction'

    return (
        <div className="container mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
            <header className="mb-8">
                <h1 className="text-3xl font-bold md:text-4xl text-gray-900 dark:text-gray-50">{title}</h1>
            </header>

            <div className="prose prose-lg max-w-none dark:prose-invert">
                {page?.content && typeof page.content === 'object' && 'blocks' in page.content ? (
                    <BlockRenderer blocks={(page.content as { blocks: Block[] }).blocks} />
                ) : (
                    <div className="space-y-4">
                        <p>
                            Hello! I&apos;m John Doe, a creative technologist passionate about building
                            innovative digital experiences.
                        </p>
                        <p>
                            With over 10 years of experience in web development, I specialize in
                            creating modern, performant, and user-friendly applications.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
