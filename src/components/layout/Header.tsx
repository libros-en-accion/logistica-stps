'use client'

import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'

export function Header() {
  return (
    <header className="flex h-14 items-center justify-end gap-4 border-b px-6 bg-background">
      <ThemeToggle />
      <UserMenu />
    </header>
  )
}
