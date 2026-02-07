
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'

export const revalidate = 60

export default async function WorksPage() {
    const supabase = await createClient()

    const { data: works } = await supabase
        .from('works')
        .select(`
            *,
            thumbnail:thumbnail_asset_id (
                bucket,
                path
            )
        `)
        .eq('published', true)
        .order('published_at', { ascending: false })

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <h1 className="mb-8 text-3xl font-bold md:text-4xl text-gray-900 dark:text-gray-50">Works</h1>
            <div className="flex flex-col gap-12">
                {works && works.length > 0 ? (
                    works.map((work) => {
                        // Resolve thumbnail URL or fallback
                        let thumbnailUrl = null
                        if (work.thumbnail) {
                            thumbnailUrl = supabase.storage.from(work.thumbnail.bucket).getPublicUrl(work.thumbnail.path).data.publicUrl
                        } else if (work.content?.html) {
                            const match = work.content.html.match(/<img[^>]+src="([^">]+)"/)
                            if (match && match[1]) {
                                thumbnailUrl = match[1]
                            }
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
                            <div key={work.id} className="flex flex-col gap-6 md:flex-row border-b border-gray-200 pb-12 last:border-0 dark:border-gray-800">
                                <Link
                                    href={`/works/${work.slug}`}
                                    className="h-48 w-full flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 md:h-[180px] md:w-[240px] dark:bg-gray-800 border group"
                                >
                                    {thumbnailUrl ? (
                                        <Image
                                            src={thumbnailUrl}
                                            alt={work.title}
                                            width={240}
                                            height={180}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-gray-400 font-medium">
                                            No Image
                                        </div>
                                    )}
                                </Link>
                                <div className="flex flex-1 flex-col justify-start">
                                    <Link href={`/works/${work.slug}`} className="mb-2 text-2xl font-bold text-gray-900 hover:text-[#F3434F] dark:text-gray-50 dark:hover:text-[#F3434F] transition-colors">
                                        {work.title}
                                    </Link>
                                    <div className="mb-4 flex flex-wrap items-center gap-3">
                                        <Badge variant="secondary" className="bg-[#142850] text-white hover:bg-[#142850]/90 rounded-full px-3">
                                            {publishDate}
                                        </Badge>
                                        <span className="text-gray-500 dark:text-gray-400 font-medium">{work.category}</span>
                                    </div>
                                    <p className="mb-4 text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                                        {work.excerpt}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {work.tags?.map((tag: string) => (
                                            <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs dark:bg-gray-800 dark:text-gray-400 border dark:border-gray-700">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="py-20 text-center text-gray-500">
                        No works found.
                    </div>
                )}
            </div>
        </div>
    )
}
