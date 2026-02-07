
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BlockEditor } from '@/components/admin/BlockEditor'
import { Block } from '@/components/content/BlockRenderer'
import { updatePage } from '@/app/admin/pages/actions'
// unused toast removed

interface Page {
    id: string
    title: string
    slug: string
    content: { blocks: Block[] }
}

interface PageEditorProps {
    page: Page
}

export function PageEditor({ page }: PageEditorProps) {
    const [blocks, setBlocks] = useState<Block[]>(page.content?.blocks || [])
    const [isSaving, setIsSaving] = useState(false)
    const router = useRouter()

    async function onSubmit(formData: FormData) {
        setIsSaving(true)
        formData.append('content', JSON.stringify({ blocks }))

        const result = await updatePage(page.id, formData)

        setIsSaving(false)
        if (result?.error) {
            alert('Error saving page') // Fallback if toast not setup
        } else {
            // toast.success('Page saved')
            router.refresh()
        }
    }

    return (
        <form action={onSubmit} className="space-y-8 max-w-4xl border p-6 rounded-md bg-white dark:bg-gray-950 dark:border-gray-800">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold capitalize">{page.slug} Page</h2>
                <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <div className="space-y-2">
                <Label htmlFor={`title-${page.id}`}>Title</Label>
                <Input id={`title-${page.id}`} name="title" required defaultValue={page.title} />
            </div>

            <div className="space-y-4 rounded-md border p-6 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <h3 className="text-lg font-medium">Content</h3>
                <BlockEditor blocks={blocks} onChange={setBlocks} />
            </div>
        </form>
    )
}
