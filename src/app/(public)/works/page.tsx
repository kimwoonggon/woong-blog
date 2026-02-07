
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'

export const revalidate = 60

export default async function WorksPage() {
    const supabase = await createClient()

    const { data: works } = await supabase
        .from('works')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <h1 className="mb-8 text-3xl font-bold md:text-4xl text-gray-900 dark:text-gray-50">Works</h1>
            <div className="flex flex-col gap-12">
                {works && works.length > 0 ? (
                    works.map((work) => (
                        <div key={work.id} className="flex flex-col gap-6 md:flex-row border-b border-gray-200 pb-12 last:border-0 dark:border-gray-800">
                            <div className="h-48 w-full flex-shrink-0 overflow-hidden rounded-md bg-gray-200 md:h-[180px] md:w-[240px] dark:bg-gray-800">
                                {/* Thumbnail Placeholder */}
                                <div className="flex h-full w-full items-center justify-center text-gray-400">
                                    Thumbnail
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col justify-start">
                                <Link href={`/works/${work.slug}`} className="mb-2 text-2xl font-bold text-gray-900 hover:text-[#F3434F] dark:text-gray-50 dark:hover:text-[#F3434F]">
                                    {work.title}
                                </Link>
                                <div className="mb-4 flex items-center gap-3">
                                    <Badge variant="secondary" className="bg-[#142850] text-white hover:bg-[#142850]/90 rounded-full px-3">
                                        {work.year}
                                    </Badge>
                                    <span className="text-gray-500 dark:text-gray-400">{work.category}</span>
                                </div>
                                <p className="mb-4 text-gray-600 dark:text-gray-300 line-clamp-3">
                                    {work.excerpt}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {work.tags?.map((tag: string) => (
                                        <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs dark:bg-gray-800 dark:text-gray-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center text-gray-500">
                        No works found.
                    </div>
                )}
            </div>
        </div>
    )
}
