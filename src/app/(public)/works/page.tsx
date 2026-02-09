
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

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
            <h1 className="mb-8 text-3xl font-heading font-bold md:text-4xl text-gray-900 dark:text-gray-50 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>Works</h1>
            <div className="columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3 group/list">
                {works && works.length > 0 ? (
                    works.map((work, index) => {
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
                            })
                            : 'Unknown Date'

                        return (
                            <div
                                key={work.id}
                                className="break-inside-avoid mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 hover:shadow-md group-hover/list:opacity-40 hover:!opacity-100 opacity-0 animate-fade-in-up"
                                style={{ animationDelay: `${(index * 100) + 200}ms` }}
                            >
                                <Link
                                    href={`/works/${work.slug}`}
                                    className="block mb-4 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 relative group/card"
                                >
                                    {thumbnailUrl ? (
                                        <Image
                                            src={thumbnailUrl}
                                            alt={work.title}
                                            width={0}
                                            height={0}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="h-auto w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-48 w-full items-center justify-center text-gray-400 font-medium">
                                            No Image
                                        </div>
                                    )}
                                </Link>
                                <div className="flex flex-col justify-start">
                                    <div className="mb-3 flex flex-wrap items-center gap-2">
                                        <Badge variant="secondary" className="bg-[#142850] text-white hover:bg-[#142850]/90 rounded-full px-2.5 py-0.5 text-xs">
                                            {publishDate}
                                        </Badge>
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{work.category}</span>
                                    </div>
                                    <Link href={`/works/${work.slug}`} className="mb-2 block">
                                        <h2 className="text-xl font-heading font-bold leading-tight text-gray-900 group-hover/card:text-[#F3434F] dark:text-gray-50 transition-colors">
                                            {work.title}
                                        </h2>
                                    </Link>

                                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                                        {work.excerpt || (work.content?.html ?
                                            work.content.html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120) + '...'
                                            : '')}
                                    </p>

                                    <div className="flex flex-wrap gap-1.5">
                                        {work.tags?.slice(0, 3).map((tag: string) => (
                                            <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] uppercase font-medium tracking-wider dark:bg-gray-800 dark:text-gray-400">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="py-20 text-center text-gray-500 col-span-full">
                        No works found.
                    </div>
                )}
            </div>
        </div>
    )
}
