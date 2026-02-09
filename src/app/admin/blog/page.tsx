
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { deleteBlog } from './actions'


export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
    const supabase = await createClient()

    const { data: blogs } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Blog Posts</h1>
                <Link href="/admin/blog/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Post
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Published Date</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {blogs && blogs.length > 0 ? (
                            blogs.map((blog) => (
                                <TableRow key={blog.id}>
                                    <TableCell className="font-medium">{blog.title}</TableCell>
                                    <TableCell>
                                        {blog.published ? (
                                            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/40 dark:text-green-300">
                                                Published
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900/40 dark:text-yellow-300">
                                                Draft
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                        {blog.published_at
                                            ? new Date(blog.published_at).toLocaleDateString()
                                            : '—'
                                        }
                                    </TableCell>
                                    <TableCell>{blog.tags?.join(', ')}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/blog/${blog.slug}`} target="_blank">
                                                <Button variant="ghost" size="icon" title="View Public">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/blog/${blog.id}`}>
                                                <Button variant="ghost" size="icon" title="Edit">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/blog/${blog.slug}`} target="_blank">
                                                <Button variant="ghost" size="icon" title="View Public">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <DeleteButton id={blog.id} action={deleteBlog} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No blog posts found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
