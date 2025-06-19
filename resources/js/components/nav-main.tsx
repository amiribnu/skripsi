import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    const toggleItem = (title: string) => {
        setOpenItems((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {items.map((item) => {
                    const isOpen = openItems[item.title];

                    return (
                        <SidebarMenuItem key={item.title}>
                            <div className="flex w-full items-center justify-between">
                                <SidebarMenuButton
                                    asChild
                                    isActive={item.href === page.url}
                                    tooltip={{ children: item.title }}
                                    onClick={() => {
                                        if (item.children) {
                                            toggleItem(item.title);
                                        }
                                    }}
                                >
                                    <Link href={item.href || '#'} prefetch className="flex w-full items-center">
                                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>

                                {item.children && (
                                    <button onClick={() => toggleItem(item.title)} className="px-2 focus:outline-none" aria-label="Toggle submenu">
                                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </button>
                                )}
                            </div>

                            {item.children && isOpen && (
                                <SidebarMenu className="mt-1 ml-4">
                                    {item.children.map((child) => (
                                        <SidebarMenuItem key={child.title}>
                                            <SidebarMenuButton asChild isActive={child.href === page.url} tooltip={{ children: child.title }}>
                                                <Link href={child.href} prefetch>
                                                    <span>{child.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
