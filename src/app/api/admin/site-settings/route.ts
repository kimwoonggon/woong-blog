
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(request: Request) {
    const supabase = await createClient()

    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
        owner_name,
        tagline,
        facebook_url,
        instagram_url,
        twitter_url,
        linkedin_url,
        github_url
    } = body

    const { error } = await supabase
        .from('site_settings')
        .update({
            owner_name,
            tagline,
            facebook_url,
            instagram_url,
            twitter_url,
            linkedin_url,
            github_url,
            updated_at: new Date().toISOString()
        })
        .eq('singleton', true)

    if (error) {
        console.error('Error updating site settings:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

export async function GET() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('site_settings')
        .select('owner_name, tagline, facebook_url, instagram_url, twitter_url, linkedin_url, github_url')
        .eq('singleton', true)
        .single()

    if (error) {
        return NextResponse.json({
            owner_name: 'John Doe',
            tagline: 'Creative Technologist',
            facebook_url: '',
            instagram_url: '',
            twitter_url: '',
            linkedin_url: '',
            github_url: ''
        })
    }

    return NextResponse.json(data)
}
