
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, FileText, Briefcase, Settings, LogOut } from 'lucide-react'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        // If user is logged in but not admin, maybe redirect to home or show error
        // For now, redirect to home
        redirect('/')
    }

    const handleSignOut = async () => {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/login')
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full border-b border-gray-200 bg-white p-6 md:w-64 md:border-b-0 md:border-r dark:border-gray-800 dark:bg-gray-950">
                <div className="mb-8 flex items-center gap-2 font-bold text-xl">
                    <span>Admin Panel</span>
                </div>
                <nav className="flex flex-col gap-2">
                    <Link href="/admin/dashboard">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <LayoutDashboard size={20} />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/admin/works">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Briefcase size={20} />
                            Works
                        </Button>
                    </Link>
                    <Link href="/admin/blog">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <FileText size={20} />
                            Blog
                        </Button>
                    </Link>
                    <Link href="/admin/pages">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Settings size={20} />
                            Pages
                        </Button>
                    </Link>
                    <form action={handleSignOut} className="mt-auto pt-8">
                        <Button variant="outline" className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                            <LogOut size={20} />
                            Sign Out
                        </Button>
                    </form>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-gray-50 p-6 md:p-12 dark:bg-gray-900">
                {children}
            </main>
        </div>
    )
}
