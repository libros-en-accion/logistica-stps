'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Sidebar } from './Sidebar'

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b px-6 bg-background">
      {/* Mobile Hamburger Menu */}
      <div className="flex md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="-ml-2" />}>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 h-full border-r-0" showCloseButton={false}>
            <Sidebar className="w-full border-r-0" />
          </SheetContent>
        </Sheet>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4 ml-auto">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
