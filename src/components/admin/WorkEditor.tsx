
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
import { createWork, updateWork } from '@/app/admin/works/actions'

interface Work {
    id?: string
    title?: string
    excerpt?: string
    year?: number
    category?: string
    tags?: string[]
    published?: boolean
    content?: { blocks: Block[] }
}

interface WorkEditorProps {
    initialWork?: Work
}

export function WorkEditor({ initialWork }: WorkEditorProps) {
    const [blocks, setBlocks] = useState<Block[]>(initialWork?.content?.blocks || [])
    const router = useRouter()
    const isEditing = !!initialWork?.id

    async function onSubmit(formData: FormData) {
        formData.append('content', JSON.stringify({ blocks }))

        if (isEditing && initialWork?.id) {
            await updateWork(initialWork.id, formData)
        } else {
            await createWork(formData)
        }
    }

    return (
        <form action={onSubmit} className="space-y-8 max-w-4xl">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" required defaultValue={initialWork?.title} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" name="year" type="number" required defaultValue={initialWork?.year} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" required defaultValue={initialWork?.category} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input id="tags" name="tags" defaultValue={initialWork?.tags?.join(', ')} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea id="excerpt" name="excerpt" required defaultValue={initialWork?.excerpt} />
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox id="published" name="published" defaultChecked={initialWork?.published} />
                <Label htmlFor="published">Published</Label>
            </div>

            <div className="space-y-4 rounded-md border p-6 dark:border-gray-800">
                <h3 className="text-lg font-medium">Content</h3>
                <BlockEditor blocks={blocks} onChange={setBlocks} />
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit">{isEditing ? 'Update Work' : 'Create Work'}</Button>
            </div>
        </form>
    )
}
