
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

const navItems = [
    { name: "Home", href: "/" },
    { name: "Introduction", href: "/introduction" },
    { name: "Works", href: "/works" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
    { name: "Resume", href: "/resume" },
]

interface NavbarProps {
    ownerName?: string
}

export function Navbar({ ownerName = 'John Doe' }: NavbarProps) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    // Fix hydration error by delaying render of Sheet (which generates random IDs)
    // until client-side mount.
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return (
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="text-lg font-bold">{ownerName}</span>
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    pathname === item.href
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    {/* Placeholder for mobile menu button to prevent layout shift */}
                    <div className="w-6 md:hidden" />
                </div>
            </header>
        )
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <span className="text-lg font-bold">{ownerName}</span>
                </Link>
                <nav className="hidden md:flex gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === item.href
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                        >
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="pl-1 pr-6">
                        <div className="px-7">
                            <Link
                                href="/"
                                className="flex items-center"
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="font-bold">{ownerName}</span>
                            </Link>
                        </div>
                        <div className="flex flex-col gap-4 mt-8 px-7">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "text-lg font-medium transition-colors hover:text-primary",
                                        pathname === item.href
                                            ? "text-foreground"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
