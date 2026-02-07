
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
    const supabase = await createClient()

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string || 'public-assets'

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${fileName}`

    // Upload to Storage
    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

    if (uploadError) {
        console.error('Storage upload error:', uploadError)
        return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Create Asset record in DB
    const { data: asset, error: assetError } = await supabase
        .from('assets')
        .insert({
            bucket,
            path: filePath,
            mime_type: file.type,
            size: file.size,
            kind: getKind(file.type),
            created_by: user.id
        })
        .select()
        .single()

    if (assetError) {
        console.error('DB Asset creation error:', assetError)
        // Note: Storage file exists but DB record failed. 
        // We could delete from storage here, but for now we'll just return error.
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath)

    return NextResponse.json({
        id: asset?.id,
        url: publicUrl,
        path: filePath
    })
}

export async function DELETE(request: Request) {
    const supabase = await createClient()

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const assetId = searchParams.get('id')

    if (!assetId) {
        return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 })
    }

    // Get asset details
    const { data: asset, error: fetchError } = await supabase
        .from('assets')
        .select('*')
        .eq('id', assetId)
        .single()

    if (fetchError || !asset) {
        return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    // 1. Delete from Storage
    const { error: storageError } = await supabase.storage
        .from(asset.bucket)
        .remove([asset.path])

    if (storageError) {
        console.error('Storage deletion error:', storageError)
        // Continue to delete DB record even if storage delete fails (it might already be gone)
    }

    // 2. Delete from DB
    const { error: dbError } = await supabase
        .from('assets')
        .delete()
        .eq('id', assetId)

    if (dbError) {
        console.error('DB deletion error:', dbError)
        return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

function getKind(mimeType: string) {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType === 'application/pdf') return 'pdf'
    if (mimeType.startsWith('audio/')) return 'audio'
    return 'other'
}
