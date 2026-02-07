
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createWork(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const excerpt = formData.get('excerpt') as string
    const year = parseInt(formData.get('year') as string)
    const category = formData.get('category') as string
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim())
    const published = formData.get('published') === 'on'
    const content = formData.get('content') ? JSON.parse(formData.get('content') as string) : {}

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const { error } = await supabase
        .from('works')
        .insert({
            title,
            slug,
            excerpt,
            year,
            category,
            tags,
            published,
            content,
            published_at: published ? new Date().toISOString() : null,
        })

    if (error) {
        console.error('Error creating work:', error)
        return { error: error.message }
    }

    revalidatePath('/works')
    revalidatePath('/admin/works')
    redirect('/admin/works')
}

export async function updateWork(id: string, formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const excerpt = formData.get('excerpt') as string
    const year = parseInt(formData.get('year') as string)
    const category = formData.get('category') as string
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim())
    const published = formData.get('published') === 'on'
    const content = formData.get('content') ? JSON.parse(formData.get('content') as string) : {}

    const { error } = await supabase
        .from('works')
        .update({
            title,
            excerpt,
            year,
            category,
            tags,
            published,
            content,
            published_at: published ? new Date().toISOString() : null,
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating work:', error)
        return { error: error.message }
    }

    revalidatePath(`/works`)
    revalidatePath('/admin/works')
    redirect('/admin/works')
}
