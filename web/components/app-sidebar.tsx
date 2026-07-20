"use client"

import { useEffect, useState, useRef } from "react"
import type { ComponentProps, FormEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  BarChart3,
  CreditCard,
  Settings2,
  HelpCircle,
  LogOut,
  ChevronsUpDown,
  Plus,
  User,
  Check,
  Sun,
  Moon,
  Monitor,
} from "lucide-react"
import { useTheme } from "next-themes"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient, signOut } from "@/lib/auth-client"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"
import { usePermissions } from "@/hooks/use-permissions"

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  metadata?: unknown;
  createdAt?: Date;
}

interface AppSidebarProps extends ComponentProps<typeof Sidebar> {
  initialActiveOrg?: Organization | null;
  initialOrganizations?: Organization[];
}

interface NavItem {
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
  isActive: boolean;
  external?: boolean;
  onClick?: string;
}

// Always show all nav items - permissions control actions, not visibility
const getNavData = (pathname: string): { navMain: NavItem[] } => ({
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/home",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard/home",
    },
    {
      title: "Usage",
      url: "/dashboard/usage",
      icon: BarChart3,
      isActive: pathname === "/dashboard/usage",
    },
    {
      title: "Billing",
      url: "#",
      icon: CreditCard,
      isActive: false,
      onClick: "billing",
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      isActive: pathname === "/dashboard/settings",
    },
  ],
})

export function AppSidebar({
  initialActiveOrg,
  initialOrganizations,
  ...props
}: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { open } = useSidebar()
  const { hasPermission, loading: permissionsLoading } = usePermissions()
  const data = getNavData(pathname)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Better Auth hooks
  const { data: activeOrgClient, isPending: isLoadingActive } = authClient.useActiveOrganization()
  const { data: organizationsClient, isPending: isLoadingOrgs } = authClient.useListOrganizations()

  const activeOrg = activeOrgClient ?? initialActiveOrg ?? null
  const organizations = organizationsClient ?? initialOrganizations ?? null
  const showOrgLoading = isLoadingActive && !initialActiveOrg

  // Create org dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [orgName, setOrgName] = useState("")
  const [creating, setCreating] = useState(false)

  // Track if we've attempted to auto-set organization to prevent infinite loops
  const hasAttemptedAutoSet = useRef(false)

  const handleSwitchOrganization = async (orgId: string, silent = false) => {
    try {
      await authClient.organization.setActive({
        organizationId: orgId,
      })
      if (!silent) {
        toast.success("Switched organization")
      }
      router.refresh()
    } catch (error) {
      if (!silent) {
        const message = error instanceof Error ? error.message : "Failed to switch organization"
        toast.error(message)
      }
    }
  }

  // Auto-set active organization if none is set but user has organizations (fallback for edge cases)
  useEffect(() => {
    if (!hasAttemptedAutoSet.current && !isLoadingOrgs && !isLoadingActive && !activeOrg && organizations && organizations.length > 0) {
      hasAttemptedAutoSet.current = true
      // Silent auto-set - the server should have done this, this is just a fallback
      handleSwitchOrganization(organizations[0].id, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingOrgs, isLoadingActive, activeOrg, organizations])

  const handleCreateOrganization = async (e: FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const result = await authClient.organization.create({
        name: orgName,
        slug: orgName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      toast.success("Organization created successfully")
      setOrgName("")
      setCreateDialogOpen(false)

      // Set the new org as active
      if (result.data) {
        await handleSwitchOrganization(result.data.id)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create organization"
      toast.error(message)
    } finally {
      setCreating(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/dashboard/login")
    } catch {
      toast.error("Failed to log out")
    }
  }

  const handleNavItemClick = async (handler: string) => {
    if (handler === "billing") {
      // Check permission before opening billing portal
      if (!hasPermission("canManageBilling")) {
        toast.error("You don't have permission to access billing")
        return
      }
      try {
        await authClient.customer.portal()
        // This will redirect to Polar's customer portal
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to open billing portal"
        toast.error(message)
      }
    }
  }

  const displayName = activeOrg?.name || "Select Organization"
  const displaySlug = activeOrg?.slug || ""

  return (
    <>
      <Sidebar className="border-r-0" collapsible="icon" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    tooltip={open ? undefined : displayName}
                  >
                    <div className="flex size-8 items-center justify-center">
                      <Image src="/integrate.png" alt="integrate.dev" width={32} height={32} className="size-8 rounded-lg" />
                    </div>
                    {open && (
                      <>
                        <div className="flex flex-1 flex-col gap-0.5 leading-none text-left">
                          {showOrgLoading ? (
                            <>
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-3 w-16 mt-1" />
                            </>
                          ) : (
                            <>
                              <span className="font-semibold">{displayName}</span>
                              {displaySlug && (
                                <span className="text-xs text-muted-foreground">
                                  {displaySlug}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        <ChevronsUpDown className="ml-auto" />
                      </>
                    )}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                  align="start"
                >
                  <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                  {isLoadingOrgs ? (
                    <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                  ) : organizations && organizations.length > 0 ? (
                    <>
                      {organizations.map((org: Organization) => (
                        <DropdownMenuItem
                          key={org.id}
                          onClick={() => handleSwitchOrganization(org.id)}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <div className="flex size-6 items-center justify-center">
                              <Image src="/integrate.png" alt="integrate.dev" width={24} height={24} className="size-6 rounded-lg" />
                            </div>
                            <div className="flex flex-col flex-1">
                              <span className="font-medium">{org.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {org.slug}
                              </span>
                            </div>
                            {activeOrg?.id === org.id && (
                              <Check className="size-4 ml-auto" />
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </>
                  ) : (
                    <DropdownMenuItem disabled>No organizations found</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="size-4 mr-2" />
                    Create Organization
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <NavMain items={data.navMain} onItemClick={handleNavItemClick} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton tooltip={open ? undefined : "Theme"}>
                    {mounted ? (
                      theme === "dark" ? (
                        <Moon className="size-4" />
                      ) : theme === "light" ? (
                        <Sun className="size-4" />
                      ) : (
                        <Monitor className="size-4" />
                      )
                    ) : (
                      <Monitor className="size-4" />
                    )}
                    <span>Theme</span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="size-4 mr-2" />
                    System
                    {mounted && theme === "system" ? <Check className="size-4 ml-auto" /> : null}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="size-4 mr-2" />
                    Light
                    {mounted && theme === "light" ? <Check className="size-4 ml-auto" /> : null}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="size-4 mr-2" />
                    Dark
                    {mounted && theme === "dark" ? <Check className="size-4 ml-auto" /> : null}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="https://integrate.dev/help" target="_blank" rel="noopener noreferrer">
                  <HelpCircle className="size-4" />
                  <span>Help & Support</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard/account"}>
                <Link href="/dashboard/account">
                  <User className="size-4" />
                  <span>Account</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut className="size-4" />
                <span>Log out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      {/* Create Organization Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
            <DialogDescription>
              Create a new workspace to organize your projects and team members.
              Your existing pricing plan will apply to all organizations.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateOrganization} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="org-name">Organization Name</FieldLabel>
              <Input
                id="org-name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Acme Corp"
                required
                disabled={creating}
                autoFocus
              />
              <FieldDescription>
                Choose a descriptive name for your workspace
              </FieldDescription>
            </Field>
            <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <span className="text-lg">ℹ️</span>
                <span>
                  Organizations are workspaces that share your account&apos;s pricing plan.
                  Usage across all organizations counts toward your account limits.
                </span>
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create Organization"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
