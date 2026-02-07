"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import { updatePage } from '@/app/admin/pages/actions'
import { toast } from 'sonner'

interface Page {
    id: string
    title: string
    slug: string
    content: any
}

interface PageEditorProps {
    page: Page
}

export function PageEditor({ page }: PageEditorProps) {
    // Determine initial HTML content. Handle old blocks format for migration.
    const getInitialHtml = () => {
        if (!page.content) return ''
        if (typeof page.content === 'object' && 'html' in page.content) {
            return page.content.html as string
        }
        // If it's the old format, we just start fresh or could try to convert, 
        // but for this task we'll just handle the new 'html' field.
        return ''
    }

    const [html, setHtml] = useState(getInitialHtml())
    const [isSaving, setIsSaving] = useState(false)
    const router = useRouter()

    async function onSubmit(formData: FormData) {
        setIsSaving(true)
        const toastId = toast.loading('Saving changes...')

        try {
            // Store as { html: "..." } to maintain JSONB structure
            formData.append('content', JSON.stringify({ html }))

            const result = await updatePage(page.id, formData)

            if (result?.error) {
                console.error('Save error from result:', result.error)
                toast.error(`Error saving page: ${result.error}`, { id: toastId })
            } else {
                toast.success('Page updated successfully!', { id: toastId })
                router.refresh()
            }
        } catch (err) {
            console.error('Fatal save error:', err)
            toast.error('A fatal error occurred while saving.', { id: toastId })
        } finally {
            setIsSaving(false)
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

            <div className="space-y-4">
                <Label>Content (Notion-style Editor)</Label>
                <TiptapEditor content={html} onChange={setHtml} />
                <p className="text-sm text-gray-500">
                    Supports Markdown shortcuts: # for H1, ## for H2, - for lists. Drag and drop images to upload.
                </p>
            </div>
        </form>
    )
}
