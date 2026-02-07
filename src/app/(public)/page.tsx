
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

interface HomeContent {
  headline?: string
  introText?: string
  profileImageUrl?: string
}

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch Home Page content
  const { data: homePage } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'home')
    .single()

  const homeContent: HomeContent = homePage?.content || {}
  const headline = homeContent.headline || 'Hi, I am John, Creative Technologist'
  const introText = homeContent.introText || 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.'
  const profileImageUrl = homeContent.profileImageUrl

  // Fetch Recent Posts (published)
  const { data: recentPosts } = await supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(2)

  // Fetch Featured Works (published)
  const { data: featuredWorks } = await supabase
    .from('works')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(3)

  return (
    <div className="container mx-auto flex flex-col gap-16 px-4 py-8 md:px-6 md:py-12">
      {/* Hero Section */}
      <section className="flex flex-col-reverse items-center justify-between gap-8 md:flex-row md:items-start md:gap-12">
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-gray-50">
            {headline}
          </h1>
          <p className="mb-8 max-w-[600px] text-lg text-gray-600 dark:text-gray-400">
            {introText}
          </p>
        </div>
        <div className="flex-shrink-0">
          <div className="h-60 w-60 overflow-hidden rounded-full bg-gray-200 shadow-xl dark:bg-gray-800">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                Avatar
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="bg-[#EDF7FA] -mx-4 px-4 py-8 md:-mx-6 md:px-6 dark:bg-gray-900/50">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-medium text-gray-900 md:text-2xl dark:text-gray-50">
            Recent posts
          </h2>
          <Link
            href="/blog"
            className="text-sm font-medium text-[#00A8CC] hover:underline dark:text-[#00A8CC]"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {recentPosts && recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <Card key={post.id} className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{post.title}</CardTitle>
                  <div className="flex gap-4 text-base text-gray-600 dark:text-gray-400">
                    <span>{post.published_at}</span>
                    <span className="border-l border-gray-400 pl-4">{post.tags?.[0]}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-gray-600 dark:text-gray-300">
                    {post.excerpt}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 py-8 text-center text-gray-500">
              No recent posts found.
            </div>
          )}
        </div>
      </section>

      {/* Featured Works Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-gray-50">
            Featured works
          </h2>
        </div>
        <div className="flex flex-col gap-6">
          {featuredWorks && featuredWorks.length > 0 ? (
            featuredWorks.map((work) => (
              <div key={work.id} className="flex flex-col gap-6 border-b border-gray-200 pb-6 md:flex-row dark:border-gray-800">
                <div className="h-48 w-full flex-shrink-0 overflow-hidden rounded-md bg-gray-200 md:w-64 dark:bg-gray-800">
                  {work.thumbnail_asset_id && (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      {/* Thumbnail would go here */}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-start">
                  <Link href={`/works/${work.slug}`} className="mb-4 text-2xl font-bold text-gray-900 hover:underline dark:text-gray-50">
                    {work.title}
                  </Link>
                  <div className="mb-4 flex items-center gap-4">
                    <span className="rounded-full bg-[#142850] px-3 py-1 text-sm font-bold text-white">
                      {work.year}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {work.category}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {work.excerpt}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">
              No featured works found.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
