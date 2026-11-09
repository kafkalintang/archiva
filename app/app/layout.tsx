'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Archive,
  Folder,
  Image as ImageIcon,
  NotebookPen,
  BookOpen,
  Star,
  Trash2,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/auth';

const MENU_ITEMS = [
  { label: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { label: 'Digital Archive', href: '/app/archive', icon: Archive },
  { label: 'My Folders', href: '/app/folders', icon: Folder },
  { label: 'Media Gallery', href: '/app/gallery', icon: ImageIcon },
  { label: 'My Notes', href: '/app/notes', icon: NotebookPen },
  { label: 'My Library', href: '/app/library', icon: BookOpen },
  { label: 'Favorites', href: '/app/favorites', icon: Star },
  { label: 'Trash', href: '/app/trash', icon: Trash2 },
];

const BOTTOM_MENU = [
  { label: 'Search', href: '/app/search', icon: Search },
  { label: 'Settings', href: '/app/settings', icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    router.refresh();
  };

  // Sidebar Content Component (reusable untuk desktop & mobile)
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar-gradient text-white">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-4 border-b border-white/10 flex-shrink-0">
        <Link href="/app/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
            <Archive className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-semibold tracking-tight text-lg whitespace-nowrap">
              ARCHIVA
            </span>
          )}
        </Link>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium',
                isActive
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-white/10 space-y-1">
          {BOTTOM_MENU.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium',
                  isActive
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Profile / Bottom Area */}
      <div className="p-3 border-t border-white/10 flex-shrink-0">
        <div className={cn(
          "flex items-center gap-3 px-2 py-2 rounded-xl bg-white/10 backdrop-blur-sm",
          isCollapsed && "justify-center px-0"
        )}>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Test User</p>
              <p className="text-[10px] text-white/60 truncate">test@archiva.com</p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="text-white/60 hover:text-white transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {isCollapsed && (
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center justify-center py-2 text-white/60 hover:text-white transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* DESKTOP SIDEBAR */}
      <aside
        className={cn(
          'hidden md:flex flex-col transition-all duration-300 ease-in-out shadow-xl z-20 relative',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <SidebarContent />
        
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-line rounded-full flex items-center justify-center text-slate-soft hover:text-navy shadow-sm transition-colors z-30"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* MOBILE DRAWER OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-40 md:hidden animate-fade"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 w-64 z-50 transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* MOBILE TOPBAR */}
        <header className="md:hidden h-16 flex items-center justify-between px-4 bg-white border-b border-line flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy to-royal flex items-center justify-center">
              <Archive className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-navy">ARCHIVA</span>
          </div>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -mr-2 text-slate-soft hover:text-navy"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}