
import { createClient } from '@/lib/supabase/server'
import { HomePageEditor } from '@/components/admin/HomePageEditor'
import { PageEditor } from '@/components/admin/PageEditor'
import { SiteSettingsEditor } from '@/components/admin/SiteSettingsEditor'
import { Block } from '@/components/content/BlockRenderer'

export const revalidate = 0

interface PageData {
    id: string
    title: string
    slug: string
    content: any
}

interface HomeContent {
    headline?: string
    introText?: string
    profileImageUrl?: string
}

export default async function AdminPagesPage() {
    const supabase = await createClient()

    // Fetch site settings
    const { data: siteSettings } = await supabase
        .from('site_settings')
        .select('owner_name, tagline, facebook_url, instagram_url, twitter_url, linkedin_url, github_url')
        .eq('singleton', true)
        .single()

    const { data: pages } = await supabase
        .from('pages')
        .select('*')
        .in('slug', ['home', 'introduction', 'contact'])
        .order('slug')

    const homePage = pages?.find((p: PageData) => p.slug === 'home')
    const introPage = pages?.find((p: PageData) => p.slug === 'introduction')
    const contactPage = pages?.find((p: PageData) => p.slug === 'contact')

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Pages &amp; Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">
                Edit your site&apos;s settings and page content here.
            </p>

            <div className="space-y-12">
                {/* Site Settings - Owner Name & Tagline & Social Links */}
                <SiteSettingsEditor
                    initialSettings={{
                        owner_name: siteSettings?.owner_name || 'John Doe',
                        tagline: siteSettings?.tagline || 'Creative Technologist',
                        facebook_url: siteSettings?.facebook_url || '',
                        instagram_url: siteSettings?.instagram_url || '',
                        twitter_url: siteSettings?.twitter_url || '',
                        linkedin_url: siteSettings?.linkedin_url || '',
                        github_url: siteSettings?.github_url || ''
                    }}
                />

                {/* Home Page - Special Editor for Hero Section */}
                {homePage && (
                    <HomePageEditor
                        pageId={homePage.id}
                        initialContent={homePage.content as HomeContent || {}}
                    />
                )}

                {/* Introduction Page */}
                {introPage && (
                    <PageEditor
                        page={{
                            id: introPage.id,
                            title: introPage.title,
                            slug: introPage.slug,
                            content: introPage.content as { blocks: Block[] }
                        }}
                    />
                )}

                {/* Contact Page */}
                {contactPage && (
                    <PageEditor
                        page={{
                            id: contactPage.id,
                            title: contactPage.title,
                            slug: contactPage.slug,
                            content: contactPage.content as { blocks: Block[] }
                        }}
                    />
                )}
            </div>
        </div>
    )
}
