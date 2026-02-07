
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import { createBlog, updateBlog } from '@/app/admin/blog/actions'

interface Blog {
    id?: string
    title?: string
    excerpt?: string
    tags?: string[]
    published?: boolean
    content?: { html: string }
    published_at?: string
    updated_at?: string
}

interface BlogEditorProps {
    initialBlog?: Blog
}

export function BlogEditor({ initialBlog }: BlogEditorProps) {
    const [html, setHtml] = useState<string>(initialBlog?.content?.html || '')
    const router = useRouter()
    const isEditing = !!initialBlog?.id

    // Format dates for display
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not yet'
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    async function onSubmit(formData: FormData) {
        formData.append('content', JSON.stringify({ html }))

        if (isEditing && initialBlog?.id) {
            await updateBlog(initialBlog.id, formData)
        } else {
            await createBlog(formData)
        }
    }

    return (
        <form action={onSubmit} className="space-y-8 max-w-4xl">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" required defaultValue={initialBlog?.title} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input id="tags" name="tags" defaultValue={initialBlog?.tags?.join(', ')} />
                </div>

                <div className="flex gap-8 pt-4">
                    <div className="space-y-1">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Published</span>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                            {formatDate(initialBlog?.published_at)}
                        </p>
                    </div>
                    {initialBlog?.updated_at && (
                        <div className="space-y-1">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                                {formatDate(initialBlog?.updated_at)}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4 rounded-md border p-6 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Content</h3>
                    <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-full border">
                        <Checkbox id="published" name="published" defaultChecked={initialBlog?.published} />
                        <Label htmlFor="published" className="text-sm cursor-pointer">Published</Label>
                    </div>
                </div>
                <TiptapEditor content={html} onChange={setHtml} />
            </div>

            <div className="flex justify-end gap-4 border-t pt-8">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" className="bg-[#142850] hover:bg-[#142850]/90 text-white font-medium px-8 transition-all hover:scale-[1.02]">
                    {isEditing ? 'Update Post' : 'Create Post'}
                </Button>
            </div>
        </form>
    )
}
