"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { updateMemberPermissions } from "@/lib/actions/organization";
import {
  getAllPermissions,
  getPermissionLabel,
  getPermissionDescription,
  getDefaultPermissions,
  type Permission,
  type MemberPermissions,
} from "@/lib/permissions";

interface Member {
  id: string;
  userId: string;
  role: string;
  permissions?: MemberPermissions | null;
  user?: {
    name: string;
    email: string;
  };
}

interface MemberPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  onUpdate: () => void;
}

export function MemberPermissionsDialog({
  open,
  onOpenChange,
  member,
  onUpdate,
}: MemberPermissionsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<MemberPermissions>({});

  useEffect(() => {
    if (member && open) {
      // Initialize with current custom permissions or empty object
      // This runs whenever the dialog opens or member data changes
      setPermissions(member.permissions || {});
    }
  }, [member, open]);

  const handlePermissionChange = (permission: Permission, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: checked,
    }));
  };

  const handleSave = async () => {
    if (!member) return;

    setLoading(true);
    try {
      const result = await updateMemberPermissions(member.id, permissions);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Permissions updated successfully");
      onUpdate();
      onOpenChange(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update permissions";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    // Reset to current saved permissions
    setPermissions(member?.permissions || {});
  };

  if (!member) return null;

  const isOwner = member.role.toLowerCase() === "owner";
  const allPermissions = getAllPermissions();
  const roleDefaults = getDefaultPermissions(member.role);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Manage Permissions for {member.user?.name || member.user?.email}
          </DialogTitle>
          <DialogDescription>
            Configure individual permissions for this member.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-2 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Role:</span>
            <Badge variant="outline">{member.role}</Badge>
          </div>
          {isOwner && (
            <div className="text-sm text-yellow-600 dark:text-yellow-500">
              Owner permissions cannot be changed and are always enabled.
            </div>
          )}
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto py-4">
          {allPermissions.map((permission) => {
            const isChecked = permissions[permission] ?? roleDefaults[permission];
            const isDefault = permissions[permission] === undefined;
            const defaultValue = roleDefaults[permission];

            return (
              <div
                key={permission}
                className="flex items-start space-x-3 p-3 rounded-lg border bg-card"
              >
                <Checkbox
                  id={permission}
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handlePermissionChange(permission, checked as boolean)
                  }
                  disabled={isOwner || loading}
                  className="mt-1"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor={permission}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {getPermissionLabel(permission)}
                    </label>
                    {isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        {defaultValue ? "Default: Enabled" : "Default: Disabled"}
                      </Badge>
                    )}
                    {!isDefault && permissions[permission] !== defaultValue && (
                      <Badge variant="default" className="text-xs">
                        Custom
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getPermissionDescription(permission)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset} disabled={loading}>
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isOwner || loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

