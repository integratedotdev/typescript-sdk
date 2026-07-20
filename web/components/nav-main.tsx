"use client"

import { type LucideIcon, ExternalLink } from "lucide-react"
import Link from "next/link"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  external?: boolean
  onClick?: string
}

interface NavMainProps {
  items: NavItem[]
  onItemClick?: (handler: string) => void
}

export function NavMain({ items, onItemClick }: NavMainProps) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          {item.onClick ? (
            <SidebarMenuButton
              isActive={item.isActive}
              onClick={() => onItemClick?.(item.onClick as string)}
              className={
                item.onClick === "billing"
                  ? "!text-link hover:!text-link hover:underline"
                  : undefined
              }
            >
              <item.icon
                className={
                  item.onClick === "billing" ? "size-4 text-link" : "size-4"
                }
              />
              <span
                className={item.onClick === "billing" ? "text-link" : undefined}
              >
                {item.title}
              </span>
            </SidebarMenuButton>
          ) : item.external ? (
            <SidebarMenuButton asChild isActive={item.isActive}>
              <a 
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <item.icon className="size-4" />
                <span>{item.title}</span>
                <ExternalLink className="ml-auto size-3 text-muted-foreground" />
              </a>
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton asChild isActive={item.isActive}>
              <Link href={item.url}>
                <item.icon className="size-4" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
