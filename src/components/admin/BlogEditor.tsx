
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { BlockEditor } from '@/components/admin/BlockEditor'
import { Block } from '@/components/content/BlockRenderer'
import { createBlog, updateBlog } from '@/app/admin/blog/actions'

interface Blog {
    id?: string
    title?: string
    excerpt?: string
    tags?: string[]
    published?: boolean
    content?: { blocks: Block[] }
}

interface BlogEditorProps {
    initialBlog?: Blog
}

export function BlogEditor({ initialBlog }: BlogEditorProps) {
    const [blocks, setBlocks] = useState<Block[]>(initialBlog?.content?.blocks || [])
    const router = useRouter()
    const isEditing = !!initialBlog?.id

    async function onSubmit(formData: FormData) {
        formData.append('content', JSON.stringify({ blocks }))

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
            </div>

            <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea id="excerpt" name="excerpt" required defaultValue={initialBlog?.excerpt} />
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox id="published" name="published" defaultChecked={initialBlog?.published} />
                <Label htmlFor="published">Published</Label>
            </div>

            <div className="space-y-4 rounded-md border p-6 dark:border-gray-800">
                <h3 className="text-lg font-medium">Content</h3>
                <BlockEditor blocks={blocks} onChange={setBlocks} />
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit">{isEditing ? 'Update Post' : 'Create Post'}</Button>
            </div>
        </form>
    )
}
