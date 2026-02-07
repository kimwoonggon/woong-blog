"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import { createWork, updateWork } from '@/app/admin/works/actions'
import { ImageIcon, X } from 'lucide-react'
import Image from 'next/image'

interface Work {
    id?: string
    title?: string
    excerpt?: string
    category?: string
    tags?: string[]
    published?: boolean
    published_at?: string
    updated_at?: string
    content?: { html?: string }
    thumbnail_url?: string
}

interface WorkEditorProps {
    initialWork?: Work
}

export function WorkEditor({ initialWork }: WorkEditorProps) {
    const [html, setHtml] = useState<string>(initialWork?.content?.html || '')
    const [thumbnail, setThumbnail] = useState<string | null>(initialWork?.thumbnail_url || null)
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const router = useRouter()
    const isEditing = !!initialWork?.id

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

        if (thumbnailFile) {
            formData.append('thumbnailFile', thumbnailFile)
        }

        if (isEditing && initialWork?.id) {
            await updateWork(initialWork.id, formData)
        } else {
            await createWork(formData)
        }
    }

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setThumbnailFile(file)
            setThumbnail(URL.createObjectURL(file))
        }
    }

    const removeThumbnail = () => {
        setThumbnail(null)
        setThumbnailFile(null)
    }

    return (
        <form action={onSubmit} className="space-y-8 max-w-4xl">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" required defaultValue={initialWork?.title} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" required defaultValue={initialWork?.category} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input id="tags" name="tags" defaultValue={initialWork?.tags?.join(', ')} />
                </div>
                <div className="flex gap-8 pt-4">
                    <div className="space-y-1">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Published</span>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                            {formatDate(initialWork?.published_at)}
                        </p>
                    </div>
                    {initialWork?.updated_at && (
                        <div className="space-y-1">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                                {formatDate(initialWork?.updated_at)}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Thumbnail Image</Label>
                <div className="flex flex-col gap-4">
                    {thumbnail ? (
                        <div className="relative w-full aspect-[16/5] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border">
                            <Image
                                src={thumbnail}
                                alt="Thumbnail preview"
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={removeThumbnail}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full aspect-[16/4] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer">
                            <div className="flex flex-row items-center gap-3 text-gray-500 dark:text-gray-400">
                                <ImageIcon size={20} />
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium">Click to upload thumbnail</p>
                                    <p className="text-xs">Optional: Falls back to first image in content</p>
                                </div>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                            />
                        </label>
                    )}
                </div>
            </div>

            <div className="space-y-4 rounded-md border p-6 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Content</h3>
                    <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-full border">
                        <Checkbox id="published" name="published" defaultChecked={initialWork?.published} />
                        <Label htmlFor="published" className="text-sm cursor-pointer">Published</Label>
                    </div>
                </div>
                <TiptapEditor content={html} onChange={setHtml} />
            </div>

            <div className="flex justify-end gap-4 border-t pt-8">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" className="bg-[#142850] hover:bg-[#142850]/90 text-white font-medium px-8 transition-all hover:scale-[1.02]">
                    {isEditing ? 'Update Work' : 'Create Work'}
                </Button>
            </div>
        </form>
    )
}
