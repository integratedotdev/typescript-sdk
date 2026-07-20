"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Trash2, RefreshCw, X, UserPlus, Shield } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { organization, useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { usePermissions } from "@/hooks/use-permissions"
import { MemberPermissionsDialog } from "@/components/member-permissions-dialog"

// Combined type for both members and invitations
export type OrgMember = {
  id: string
  name: string
  email: string
  role: string
  status: "Active" | "Pending"
  joinedDate: string
  userId?: string
  type: "member" | "invitation"
  permissions?: any
  user?: {
    name: string
    email: string
  }
}

// Helper function to create columns with action handlers
const createColumns = (
  onRemoveMember: (id: string) => void,
  onCancelInvite: (id: string) => void,
  onResendInvite: (id: string) => void,
  onChangeRole: (id: string, role: string) => void,
  onManagePermissions: (member: OrgMember) => void,
  currentUserId?: string,
  changingRole?: string,
  canManageMembers?: boolean
): ColumnDef<OrgMember>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const isCurrentUser = row.original.userId === currentUserId
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.getValue("name")}</span>
          {isCurrentUser && (
            <Badge variant="outline" className="text-xs">
              You
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const member = row.original
      const role = member.role
      const isOwner = role === "owner"
      const isPending = member.status === "Pending"
      
      if (isPending || isOwner) {
        return (
          <Badge variant={isOwner ? "default" : "secondary"}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        )
      }

      return (
        <Select
          value={role}
          onValueChange={(newRole) => onChangeRole(member.id, newRole)}
          disabled={changingRole === member.id}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="owner" disabled>
              Owner
            </SelectItem>
          </SelectContent>
        </Select>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "Pending" ? "outline" : "secondary"}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "joinedDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Joined
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.original.status
      return <div>{status === "Pending" ? "Pending" : row.getValue("joinedDate")}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const member = row.original
      const isOwner = member.role === "owner"

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(member.email)}
            >
              Copy email address
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {member.status === "Pending" && (
              <>
                <DropdownMenuItem onClick={() => onResendInvite(member.id)}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend invite
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => onCancelInvite(member.id)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel invite
                </DropdownMenuItem>
              </>
            )}
            {!isOwner && member.status === "Active" && canManageMembers && (
              <>
                <DropdownMenuItem onClick={() => onManagePermissions(member)}>
                  <Shield className="mr-2 h-4 w-4" />
                  Manage Permissions
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => onRemoveMember(member.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove member
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

import type { OrgMember as ServerOrgMember } from "@/lib/data/organization"

function transformServerMembers(members: ServerOrgMember[]): OrgMember[] {
  return members.map((member) => ({
    id: member.id,
    name: member.user?.name || "Unknown",
    email: member.user?.email || "N/A",
    role: member.role,
    status: "Active" as const,
    joinedDate: new Date(member.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    userId: member.userId,
    type: "member" as const,
    permissions: member.permissions,
    user: {
      name: member.user?.name || "Unknown",
      email: member.user?.email || "N/A",
    },
  }))
}

interface OrgMembersTableProps {
  organizationId?: string
  initialMembers?: ServerOrgMember[]
  canManageMembers?: boolean
  canManageInvitations?: boolean
}

export function OrgMembersTable({
  organizationId,
  initialMembers,
  canManageMembers: canManageMembersProp,
  canManageInvitations: canManageInvitationsProp,
}: OrgMembersTableProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const { hasPermission } = usePermissions()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = React.useState<OrgMember[]>(() =>
    initialMembers ? transformServerMembers(initialMembers) : []
  )
  const [loading, setLoading] = React.useState(!initialMembers)
  const [changingRole, setChangingRole] = React.useState<string | null>(null)
  const [memberToRemove, setMemberToRemove] = React.useState<OrgMember | null>(null)
  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false)
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [inviteRole, setInviteRole] = React.useState<"member" | "admin" | "owner">("member")
  const [inviteLoading, setInviteLoading] = React.useState(false)
  // Local state for filter inputs to ensure they're always controlled
  const [emailFilter, setEmailFilter] = React.useState("")
  const [nameFilter, setNameFilter] = React.useState("")
  // Permissions dialog state
  const [selectedMemberForPermissions, setSelectedMemberForPermissions] = React.useState<OrgMember | null>(null)
  const [permissionsDialogOpen, setPermissionsDialogOpen] = React.useState(false)

  const canManageMembers =
    canManageMembersProp ?? hasPermission("canManageMembers")
  const canManageInvitations =
    canManageInvitationsProp ?? hasPermission("canManageInvitations")

  const fetchInvitations = React.useCallback(async () => {
    const invitationsResponse = await organization.listInvitations()
    const allInvitations = invitationsResponse?.data || []

    return allInvitations
      .filter((invitation) => {
        const status = String(invitation.status).toLowerCase()
        const isPending = status === "pending"
        const isNotExpired =
          !invitation.expiresAt || new Date(invitation.expiresAt) > new Date()
        return isPending && isNotExpired
      })
      .map((invitation) => ({
        id: invitation.id,
        name: invitation.email,
        email: invitation.email,
        role: invitation.role,
        status: "Pending" as const,
        joinedDate: "",
        type: "invitation" as const,
      }))
  }, [])

  const mergeMembersAndInvitations = React.useCallback(
    (members: ServerOrgMember[], invitations: OrgMember[]) => {
      setData([...transformServerMembers(members), ...invitations])
    },
    []
  )

  React.useEffect(() => {
    if (!initialMembers) return

    void fetchInvitations()
      .then((invitations) => mergeMembersAndInvitations(initialMembers, invitations))
      .catch((error) => {
        console.error("Failed to fetch organization invitations:", error)
        mergeMembersAndInvitations(initialMembers, [])
      })
      .finally(() => setLoading(false))
  }, [initialMembers, fetchInvitations, mergeMembersAndInvitations])

  const refreshData = React.useCallback(async () => {
    try {
      const invitations = await fetchInvitations()
      if (initialMembers) {
        mergeMembersAndInvitations(initialMembers, invitations)
      }
      router.refresh()
    } catch (error) {
      console.error("Failed to fetch organization data:", error)
      toast.error("Failed to load organization members")
    }
  }, [fetchInvitations, initialMembers, mergeMembersAndInvitations, router])

  // Handle removing a member
  const handleRemoveMember = React.useCallback(async (memberId: string) => {
    const member = data.find(m => m.id === memberId)
    if (member) {
      setMemberToRemove(member)
    }
  }, [data])

  const confirmRemoveMember = React.useCallback(async () => {
    if (!memberToRemove) return

    try {
      await organization.removeMember({
        memberIdOrEmail: memberToRemove.id,
      })
      toast.success("Member removed successfully")
      await refreshData()
    } catch (error: any) {
      const message = error?.message || "Failed to remove member"
      toast.error(message)
    } finally {
      setMemberToRemove(null)
    }
  }, [memberToRemove, refreshData])

  // Handle canceling an invitation
  const handleCancelInvite = React.useCallback(async (invitationId: string) => {
    try {
      await organization.cancelInvitation({
        invitationId,
      })
      toast.success("Invitation canceled successfully")
      await refreshData()
    } catch (error: any) {
      const message = error?.message || "Failed to cancel invitation"
      toast.error(message)
    }
  }, [refreshData])

  // Handle resending an invitation
  const handleResendInvite = React.useCallback(async (invitationId: string) => {
    const invitation = data.find(m => m.id === invitationId)
    if (!invitation) return

    try {
      // Cancel old invitation first and wait for it to complete
      await organization.cancelInvitation({
        invitationId,
      })
      
      // Wait a bit to ensure cancellation is processed
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Fetch fresh data to ensure old invitation is removed
      await refreshData()
      
      // Ensure role is properly typed
      const role = invitation.role as "member" | "admin" | "owner"
      
      // Create new invitation
      await organization.inviteMember({
        email: invitation.email,
        role: role,
      })
      
      toast.success("Invitation resent successfully")
      
      // Fetch again to show the new invitation
      await refreshData()
    } catch (error: any) {
      const message = error?.message || "Failed to resend invitation"
      toast.error(message)
      // Still refresh to show current state
      await refreshData()
    }
  }, [data, refreshData])

  // Handle changing role
  const handleChangeRole = React.useCallback(async (memberId: string, newRole: string) => {
    setChangingRole(memberId)
    try {
      const role = newRole as "member" | "admin" | "owner"
      await organization.updateMemberRole({
        memberId: memberId,
        role: role,
      })
      toast.success("Member role updated successfully")
      await refreshData()
    } catch (error: any) {
      const message = error?.message || "Failed to update member role"
      toast.error(message)
    } finally {
      setChangingRole(null)
    }
  }, [refreshData])

  // Handle inviting a new member
  const handleInvite = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteLoading(true)

    try {
      await organization.inviteMember({
        email: inviteEmail,
        role: inviteRole,
      })

      toast.success(`Invitation sent to ${inviteEmail}`)
      await refreshData()
      // Reset form and close dialog after successful invite
      setInviteDialogOpen(false)
      // Delay resetting form to avoid controlled/uncontrolled input warning
      setTimeout(() => {
        setInviteEmail("")
        setInviteRole("member")
      }, 100)
    } catch (error: any) {
      const message = error?.message || "Failed to send invitation"
      toast.error(message)
    } finally {
      setInviteLoading(false)
    }
  }, [inviteEmail, inviteRole, refreshData])

  // Sync selected member with fresh data after updates
  React.useEffect(() => {
    if (selectedMemberForPermissions && permissionsDialogOpen) {
      const updatedMember = data.find(m => m.id === selectedMemberForPermissions.id)
      if (updatedMember && JSON.stringify(updatedMember.permissions) !== JSON.stringify(selectedMemberForPermissions.permissions)) {
        setSelectedMemberForPermissions(updatedMember)
      }
    }
  }, [data, selectedMemberForPermissions, permissionsDialogOpen])

  // Handle managing permissions
  const handleManagePermissions = React.useCallback((member: OrgMember) => {
    setSelectedMemberForPermissions(member)
    setPermissionsDialogOpen(true)
  }, [])

  const handlePermissionsUpdate = React.useCallback(async () => {
    await refreshData()
  }, [refreshData])

  const columns = React.useMemo(
    () => createColumns(
      handleRemoveMember,
      handleCancelInvite,
      handleResendInvite,
      handleChangeRole,
      handleManagePermissions,
      session?.user?.id,
      changingRole || undefined,
      canManageMembers
    ),
    [handleRemoveMember, handleCancelInvite, handleResendInvite, handleChangeRole, handleManagePermissions, session?.user?.id, changingRole, canManageMembers]
  )

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (loading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <Input placeholder="Filter by email..." value="" disabled className="max-w-sm" readOnly />
            <Input placeholder="Filter by name..." value="" disabled className="max-w-sm" readOnly />
          </div>
          <Button disabled>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading members...
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <Input
              placeholder="Filter by email..."
              value={emailFilter}
              onChange={(event) => {
                setEmailFilter(event.target.value)
                table.getColumn("email")?.setFilterValue(event.target.value)
              }}
              className="max-w-sm"
            />
            <Input
              placeholder="Filter by name..."
              value={nameFilter}
              onChange={(event) => {
                setNameFilter(event.target.value)
                table.getColumn("name")?.setFilterValue(event.target.value)
              }}
              className="max-w-sm"
            />
          </div>
          {canManageInvitations && (
            <Button onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          )}
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredRowModel().rows.length} member(s) total
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Remove member confirmation dialog */}
      <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {memberToRemove?.name} ({memberToRemove?.email}) from the organization?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveMember} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Invite member dialog */}
      <Dialog 
        open={inviteDialogOpen} 
        onOpenChange={(open) => {
          setInviteDialogOpen(open)
          // Reset form when dialog closes
          if (!open) {
            setTimeout(() => {
              setInviteEmail("")
              setInviteRole("member")
            }, 100)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your organization
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="invite-email">Email Address</FieldLabel>
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail || ""}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                disabled={inviteLoading}
              />
              <FieldDescription>
                We&apos;ll send an invitation to this email address
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="invite-role">Role</FieldLabel>
              <Select 
                value={inviteRole || "member"} 
                onValueChange={(value) => setInviteRole(value as "member" | "admin" | "owner")} 
                disabled={inviteLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                Admins can manage members and settings
              </FieldDescription>
            </Field>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setInviteDialogOpen(false)}
                disabled={inviteLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={inviteLoading}>
                {inviteLoading ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Permissions management dialog */}
      <MemberPermissionsDialog
        open={permissionsDialogOpen}
        onOpenChange={setPermissionsDialogOpen}
        member={selectedMemberForPermissions as any}
        onUpdate={handlePermissionsUpdate}
      />
    </>
  )
}

