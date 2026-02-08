
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

    // Generate slug supporting Unicode (e.g. Korean)
    let slug = title.trim().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\p{L}\p{N}-]+/gu, '') // Keep Unicode letters and numbers
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

    // Fallback if slug is empty (e.g. only emojis)
    if (!slug) {
        slug = `post-${Date.now()}`
    }


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

    revalidatePath('/', 'page')
    revalidatePath('/blog', 'page')
    revalidatePath('/admin/blog', 'page')
    redirect('/admin/blog')
}

export async function updateBlog(id: string, formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean)
    const published = formData.get('published') === 'on'
    const content = formData.get('content') ? JSON.parse(formData.get('content') as string) : {}

    // Generate slug supporting Unicode (e.g. Korean)
    let slug = title.trim().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\p{L}\p{N}-]+/gu, '') // Keep Unicode letters and numbers
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

    // Fallback if slug is empty (e.g. only emojis)
    if (!slug) {
        slug = `post-${Date.now()}`
    }

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
            slug,
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

    revalidatePath('/', 'page')
    revalidatePath(`/blog/${encodeURIComponent(slug)}`, 'page') // Blog detail
    revalidatePath(`/blog`, 'page')
    revalidatePath('/admin/blog', 'page')
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

export async function deleteBlog(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting blog:', error)
        return { error: error.message }
    }

    revalidatePath('/', 'page') // Home page (Recent Posts)
    revalidatePath('/blog', 'page') // Blog list
    revalidatePath('/admin/blog', 'page') // Admin list
}

