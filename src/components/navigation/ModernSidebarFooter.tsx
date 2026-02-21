'use client'

import { useAuth } from '@/contexts/AuthContext'
// import { ThemeToggle } from '@/components/theme-toggle' // Removed for light-only theme
import { User, LogOut, Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

/**
 * Modern sidebar footer with profile, theme toggle, and logout
 * Uses shadcn/ui components for consistent styling
 */
export function ModernSidebarFooter() {
  const { authState, logout } = useAuth()

  const handlelogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className="p-2 space-y-2">
      {/* User Profile Section */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="justify-start w-full h-auto p-2 hover:bg-sidebar-accent"
          >
            <div className="flex items-center w-full gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={ ''} />
                <AvatarFallback className="text-xs text-white bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500">
                  {authState.user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium truncate text-sidebar-foreground">
                  {authState.user?.name || 'User'}
                </p>
                <p className="text-xs truncate text-sidebar-foreground/70">
                  {authState.user?.email}
                </p>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="w-4 h-4 mr-2" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="w-4 h-4 mr-2" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handlelogout} className="text-red-600">
            <LogOut className="w-4 h-4 mr-2" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Toggle - Removed for light-only theme */}
      {/* <div className="flex justify-center">
        <ThemeToggle />
      </div> */}
    </div>
  )
}
