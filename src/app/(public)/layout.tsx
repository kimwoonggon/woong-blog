
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { createClient } from "@/lib/supabase/server"

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const { data: siteSettings } = await supabase
        .from('site_settings')
        .select('owner_name, tagline, facebook_url, instagram_url, twitter_url, linkedin_url, github_url')
        .eq('singleton', true)
        .single()

    const ownerName = siteSettings?.owner_name || 'John Doe'

    return (
        <div className="flex min-h-screen flex-col font-sans">
            <Navbar ownerName={ownerName} />
            <main className="flex-1">{children}</main>
            <Footer
                ownerName={ownerName}
                facebookUrl={siteSettings?.facebook_url || ''}
                instagramUrl={siteSettings?.instagram_url || ''}
                twitterUrl={siteSettings?.twitter_url || ''}
                linkedinUrl={siteSettings?.linkedin_url || ''}
                githubUrl={siteSettings?.github_url || ''}
            />
        </div>
    )
}
