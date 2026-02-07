
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createBlog(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean)
    const published = formData.get('published') === 'on'
    const content = formData.get('content') ? JSON.parse(formData.get('content') as string) : {}

    // Auto-generate excerpt from content
    const excerpt = generateExcerpt(content.html)

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const { error } = await supabase
        .from('blogs')
        .insert({
            title,
            slug,
            excerpt,
            tags,
            published,
            content,
            published_at: published ? new Date().toISOString() : null,
        })

    if (error) {
        console.error('Error creating blog:', error)
        return { error: error.message }
    }

    revalidatePath('/blog')
    revalidatePath('/admin/blog')
    redirect('/admin/blog')
}

export async function updateBlog(id: string, formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean)
    const published = formData.get('published') === 'on'
    const content = formData.get('content') ? JSON.parse(formData.get('content') as string) : {}

    // Auto-generate excerpt from content
    const excerpt = generateExcerpt(content.html)

    // Find existing blog to check for metadata
    const { data: existingBlog } = await supabase
        .from('blogs')
        .select('published_at')
        .eq('id', id)
        .single()

    let publishedAt = existingBlog?.published_at
    if (published && !publishedAt) {
        publishedAt = new Date().toISOString()
    }

    const { error } = await supabase
        .from('blogs')
        .update({
            title,
            excerpt,
            tags,
            published,
            content,
            published_at: publishedAt,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating blog:', error)
        return { error: error.message }
    }

    revalidatePath(`/blog`)
    revalidatePath('/admin/blog')
    redirect('/admin/blog')
}

function generateExcerpt(html: string) {
    if (!html) return ''
    const text = html
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    return text.slice(0, 160) + (text.length > 160 ? '...' : '')
}
