
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
    const supabase = await createClient()

    const { data: blogs } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <h1 className="mb-8 text-3xl font-heading font-bold md:text-4xl text-gray-900 dark:text-gray-50">Blog</h1>
            <div className="flex flex-col gap-6">
                {blogs && blogs.length > 0 ? (
                    blogs.map((blog) => (
                        <Card key={blog.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <Link href={`/blog/${blog.slug}`} className="hover:text-[#F3434F] transition-colors">
                                    <CardTitle className="text-xl font-heading font-bold md:text-2xl">{blog.title}</CardTitle>
                                </Link>
                                <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    <span>
                                        {blog.published_at
                                            ? new Date(blog.published_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                            : 'Unknown Date'
                                        }
                                    </span>
                                    {blog.tags?.[0] && (
                                        <span className="border-l border-gray-400 pl-4">{blog.tags.join(', ')}</span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                                    {blog.excerpt}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="py-20 text-center text-gray-500">
                        No blog posts found.
                    </div>
                )}
            </div>
        </div>
    )
}
