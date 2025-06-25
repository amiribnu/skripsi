import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Database, DollarSign, LayoutGrid, Receipt, ReceiptText } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Persuratan',
        href: '#',
        icon: ReceiptText,
        children: [
            { title: 'Surat Masuk', href: '/persuratan/client-surat-masuk' },
            { title: 'Surat Keluar', href: '/persuratan/client-surat-keluar' },
        ],
    },
    {
        title: 'Kwitansi',
        href: '/client-kwitansi',
        icon: Receipt,
    },
    {
        title: 'Invoice',
        href: '/client-invoice',
        icon: DollarSign,
    },
    {
        title: 'Data Master',
        href: '#',
        icon: Database,
        children: [
            { title: 'User', href: '/data-master/user' },
            { title: 'Roles', href: '/roles' },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar variant="inset" className="h-screen">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <div className="flex h-full flex-col">
                    <NavMain items={mainNavItems} />
                    <div className="mt-auto">
                        <NavUser />
                    </div>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}
