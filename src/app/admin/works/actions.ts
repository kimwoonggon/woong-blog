
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createWork(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const period = formData.get('period') as string
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim())
    const published = formData.get('published') === 'on'
    const content = formData.get('content') ? JSON.parse(formData.get('content') as string) : {}
    const thumbnailFile = formData.get('thumbnailFile') as File | null
    const iconFile = formData.get('iconFile') as File | null
    const all_properties = formData.get('all_properties') ? JSON.parse(formData.get('all_properties') as string) : {}

    // Generate slug supporting Unicode (e.g. Korean)
    let slug = title.trim().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\p{L}\p{N}-]+/gu, '') // Keep Unicode letters and numbers
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

    // Fallback if slug is empty (e.g. only emojis)
    if (!slug) {
        slug = `work-${Date.now()}`
    }


    // Auto-generate excerpt from content
    const excerpt = generateExcerpt(content.html)

    let thumbnailAssetId = null

    // 1. Handle explicit thumbnail upload
    if (thumbnailFile && thumbnailFile.size > 0) {
        thumbnailAssetId = await uploadThumbnail(supabase, user.id, thumbnailFile)
    }

    let iconAssetId = null
    // 2. Handle explicit icon upload
    if (iconFile && iconFile.size > 0) {
        iconAssetId = await uploadThumbnail(supabase, user.id, iconFile)
    }

    // 2. Fallback to first image in content if no thumbnail
    if (!thumbnailAssetId) {
        thumbnailAssetId = extractFirstImageAsset(content.html)
    }

    const { error } = await supabase
        .from('works')
        .insert({
            title,
            slug,
            excerpt,
            category,
            period,
            tags,
            published,
            content,
            all_properties,
            published_at: published ? new Date().toISOString() : null,
            thumbnail_asset_id: thumbnailAssetId,
            icon_asset_id: iconAssetId,
        })

    if (error) {
        console.error('Error creating work:', error)
        return { error: error.message }
    }

    revalidatePath('/', 'page')
    revalidatePath('/works', 'page')
    revalidatePath('/admin/works', 'page')
    redirect('/admin/works')
}

export async function updateWork(id: string, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const period = formData.get('period') as string
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim())
    const published = formData.get('published') === 'on'
    const content = formData.get('content') ? JSON.parse(formData.get('content') as string) : {}
    const thumbnailFile = formData.get('thumbnailFile') as File | null
    const iconFile = formData.get('iconFile') as File | null
    const all_properties = formData.get('all_properties') ? JSON.parse(formData.get('all_properties') as string) : {}

    // Generate slug supporting Unicode (e.g. Korean)
    let slug = title.trim().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\p{L}\p{N}-]+/gu, '') // Keep Unicode letters and numbers
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

    // Fallback if slug is empty (e.g. only emojis)
    if (!slug) {
        slug = `work-${Date.now()}`
    }

    // Auto-generate excerpt from content
    const excerpt = generateExcerpt(content.html)


    // Find existing work to check for metadata
    const { data: existingWork } = await supabase
        .from('works')
        .select('thumbnail_asset_id, icon_asset_id, published_at')
        .eq('id', id)
        .single()

    let thumbnailAssetId = null
    let iconAssetId = null
    let publishedAt = existingWork?.published_at

    // Check for existing thumbnail if no new file is uploaded
    if (thumbnailFile && thumbnailFile.size > 0) {
        thumbnailAssetId = await uploadThumbnail(supabase, user.id, thumbnailFile)
    } else {
        thumbnailAssetId = existingWork?.thumbnail_asset_id
    }

    // Check for existing icon if no new file is uploaded
    if (iconFile && iconFile.size > 0) {
        iconAssetId = await uploadThumbnail(supabase, user.id, iconFile)
    } else {
        iconAssetId = existingWork?.icon_asset_id
    }

    // Fallback to first image in content if still no thumbnail
    if (!thumbnailAssetId) {
        thumbnailAssetId = extractFirstImageAsset(content.html)
    }

    // Set published_at if transitioning to published
    if (published && !publishedAt) {
        publishedAt = new Date().toISOString()
    } else if (!published) {
        // Option: we could nullify publishedAt if unpublished, 
        // but often it's better to keep the original published date.
        // For now, let's keep it if it exists.
    }

    const { error } = await supabase
        .from('works')
        .update({
            title,
            slug,
            excerpt,
            category,
            period,
            tags,
            published,
            content,
            all_properties,
            published_at: publishedAt,
            thumbnail_asset_id: thumbnailAssetId,
            icon_asset_id: iconAssetId,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating work:', error)
        return { error: error.message }
    }

    revalidatePath('/', 'page')
    revalidatePath(`/works/${encodeURIComponent(slug)}`, 'page') // Work detail
    revalidatePath('/works', 'page')
    revalidatePath('/admin/works', 'page')
    redirect('/admin/works')
}

function generateExcerpt(html: string) {
    if (!html) return ''
    // Strip tags and decode some common entities
    const text = html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim()

    if (text.length <= 160) return text
    return text.slice(0, 160).trim() + '...'
}

async function uploadThumbnail(supabase: any, userId: string, file: File) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${require('uuid').v4()}.${fileExt}`
    const bucket = 'public-assets'

    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data: asset, error: assetError } = await supabase
        .from('assets')
        .insert({
            bucket,
            path: fileName,
            mime_type: file.type,
            size: file.size,
            kind: 'image',
            created_by: userId
        })
        .select()
        .single()

    if (assetError) throw assetError
    return asset.id
}

function extractFirstImageAsset(html: string) {
    if (!html) return null
    // Very simple regex to find the first img src and potentially its asset ID if stored as data-asset-id
    // However, Tiptap's Image extension stores just <img> tags. 
    // We could try to extract the URL and look it up, but a better way is if the editor 
    // included the asset ID in the HTML as an attribute.

    // For now, let's try to extract the first image src.
    const imgRegex = /<img[^>]+src="([^">]+)"/
    const match = html.match(imgRegex)
    if (match && match[1]) {
        // If we want to be fancy, we could look up this URL in the assets table.
        // But for MVP, let's just return null if no explicit thumbnail, 
        // and handle the fallback in the FRONTEND display logic instead,
        // which is safer and more dynamic.
    }
    return null
}

export async function deleteWork(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Note: We might want to delete the thumbnail asset too if it's not used elsewhere,
    // but that requires more complex logic. For now, we leave the asset.

    const { error } = await supabase
        .from('works')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting work:', error)
        return { error: error.message }
    }

    revalidatePath('/', 'page') // Home page (Featured Works)
    revalidatePath('/works', 'page') // Works list
    revalidatePath('/admin/works', 'page') // Admin list
}

