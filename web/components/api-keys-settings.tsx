"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Copy, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createApiKey, deleteApiKey } from "@/lib/actions/api-keys";
import type { ApiKeyRecord } from "@/lib/data/api-keys";
import { ApiKeysEmpty } from "@/components/empty-states/api-keys-empty";

interface ApiKeysContentProps {
  initialKeys: ApiKeyRecord[];
  canManageApiKeys?: boolean;
}

export function ApiKeysContent({
  initialKeys,
  canManageApiKeys = true,
}: ApiKeysContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnvironment, setNewKeyEnvironment] = useState<"dev" | "prod">("dev");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [environmentFilter, setEnvironmentFilter] = useState<"all" | "dev" | "prod">("all");

  const apiKeys = useMemo(() => {
    if (environmentFilter === "all") return initialKeys;
    return initialKeys.filter((key) => key.environment === environmentFilter);
  }, [initialKeys, environmentFilter]);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await createApiKey(newKeyName, newKeyEnvironment);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      if (result.key) {
        setNewlyCreatedKey(result.key);
        setShowKeyDialog(true);
      }

      setNewKeyName("");
      setNewKeyEnvironment("dev");
      setCreateDialogOpen(false);
      toast.success("API key created successfully");
      router.refresh();
    });
  };

  const handleDeleteKey = (keyId: string) => {
    startTransition(async () => {
      const result = await deleteApiKey(keyId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("API key deleted successfully");
      router.refresh();
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">API Keys</h3>
          <p className="text-sm text-muted-foreground">
            Manage your organization&apos;s API keys
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={environmentFilter}
            onValueChange={(value) =>
              setEnvironmentFilter(value as "all" | "dev" | "prod")
            }
          >
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Environments</SelectItem>
              <SelectItem value="dev">Development</SelectItem>
              <SelectItem value="prod">Production</SelectItem>
            </SelectContent>
          </Select>
          {canManageApiKeys ? (
            <Button
              onClick={() => setCreateDialogOpen(true)}
              size="sm"
              type="button"
            >
              <Plus className="mr-2 size-4" />
              Create Key
            </Button>
          ) : null}
        </div>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Your API Keys</CardTitle>
          <CardDescription>
            Use these keys to authenticate API requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <ApiKeysEmpty
              canManage={canManageApiKeys}
              onCreateClick={
                canManageApiKeys ? () => setCreateDialogOpen(true) : undefined
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <span>{`${apiKey.start || "••••••"}...`}</span>
                        <span className="text-xs text-muted-foreground">
                          Key hidden for security
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          apiKey.environment === "prod" ? "default" : "secondary"
                        }
                      >
                        {apiKey.environment === "prod" ? "Production" : "Development"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={apiKey.enabled ? "default" : "secondary"}>
                        {apiKey.enabled ? "Active" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(apiKey.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {canManageApiKeys ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteKey(apiKey.id)}
                          type="button"
                          disabled={isPending}
                        >
                          <Trash2 className="size-4 text-destructive" />
                          <span className="sr-only">Delete API key</span>
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>
              Give your API key a descriptive name
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateKey} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="key-name">Name</FieldLabel>
              <Input
                id="key-name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Production API Key"
                required
                disabled={isPending}
              />
              <FieldDescription>
                A friendly name to help you identify this key
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="key-environment">Environment</FieldLabel>
              <Select
                value={newKeyEnvironment}
                onValueChange={(value) =>
                  setNewKeyEnvironment(value as "dev" | "prod")
                }
              >
                <SelectTrigger id="key-environment" disabled={isPending}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dev">Development</SelectItem>
                  <SelectItem value="prod">Production</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                Choose the environment for this API key
              </FieldDescription>
            </Field>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Key"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key Created</DialogTitle>
            <DialogDescription>
              Copy your API key now. You won&apos;t be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <code className="text-sm break-all">{newlyCreatedKey}</code>
            </div>
            <Button
              onClick={() => newlyCreatedKey && copyToClipboard(newlyCreatedKey)}
              className="w-full"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
