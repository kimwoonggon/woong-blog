
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, Briefcase, FileText } from 'lucide-react'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Basic counts
    const { count: worksCount } = await supabase
        .from('works')
        .select('*', { count: 'exact', head: true })

    const { count: blogsCount } = await supabase
        .from('blogs')
        .select('*', { count: 'exact', head: true })

    const { count: viewsCount } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Dashboard</h1>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{viewsCount || 0}</div>
                        <p className="text-xs text-muted-foreground">+0% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Works</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{worksCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Published projects</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Blog Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{blogsCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Published articles</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
