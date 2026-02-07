
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function AdminWorksPage() {
    const supabase = await createClient()

    const { data: works } = await supabase
        .from('works')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Works</h1>
                <Link href="/admin/works/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Work
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {works && works.length > 0 ? (
                            works.map((work) => (
                                <TableRow key={work.id}>
                                    <TableCell className="font-medium">{work.title}</TableCell>
                                    <TableCell>
                                        {work.published ? (
                                            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/40 dark:text-green-300">
                                                Published
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900/40 dark:text-yellow-300">
                                                Draft
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{work.year}</TableCell>
                                    <TableCell>{work.category}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/works/${work.slug}`} target="_blank">
                                                <Button variant="ghost" size="icon" title="View Public">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/works/${work.id}`}>
                                                <Button variant="ghost" size="icon" title="Edit">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" title="Delete">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No works found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
