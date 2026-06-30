"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createUserAction,
  resetPasswordAction,
  toggleStatusAction,
  changeRoleAction,
} from "./actions";

type Role = "super_admin" | "admin" | "user";
type Row = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "inactive";
  createdAt: Date;
};

const ROLE_LABEL: Record<Role, string> = {
  super_admin: "Super admin",
  admin: "Admin",
  user: "User",
};

export function UsersManager({
  users,
  currentUserId,
  currentRole,
}: {
  users: Row[];
  currentUserId: string;
  currentRole: Role;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateUserDialog currentRole={currentRole} />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">
                  {u.name}
                  {u.id === currentUserId && (
                    <span className="text-muted-foreground"> (you)</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell>{ROLE_LABEL[u.role]}</TableCell>
                <TableCell>
                  <Badge
                    variant={u.status === "active" ? "secondary" : "outline"}
                  >
                    {u.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <RowActions
                    row={u}
                    currentUserId={currentUserId}
                    currentRole={currentRole}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function RowActions({
  row,
  currentUserId,
  currentRole,
}: {
  row: Row;
  currentUserId: string;
  currentRole: Role;
}) {
  const [resetOpen, setResetOpen] = useState(false);
  const isSelf = row.id === currentUserId;
  const canManageRole =
    currentRole === "super_admin" || row.role !== "super_admin";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon" className="size-8" />}
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Actions for {row.name}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Change role</DropdownMenuLabel>
          {(["user", "admin", "super_admin"] as Role[]).map((r) => (
            <form action={changeRoleAction} key={r}>
              <input type="hidden" name="userId" value={row.id} />
              <input type="hidden" name="role" value={r} />
              <DropdownMenuItem
                render={<button type="submit" className="w-full" />}
                disabled={
                  row.role === r ||
                  !canManageRole ||
                  (r === "super_admin" && currentRole !== "super_admin")
                }
              >
                {ROLE_LABEL[r]}
                {row.role === r && " ✓"}
              </DropdownMenuItem>
            </form>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setResetOpen(true)}>
            Reset password
          </DropdownMenuItem>
          <form action={toggleStatusAction}>
            <input type="hidden" name="userId" value={row.id} />
            <DropdownMenuItem
              render={<button type="submit" className="w-full" />}
              disabled={isSelf || !canManageRole}
              variant={row.status === "active" ? "destructive" : "default"}
            >
              {row.status === "active" ? "Deactivate" : "Reactivate"}
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResetPasswordDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        row={row}
      />
    </>
  );
}

function CreateUserDialog({ currentRole }: { currentRole: Role }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createUserAction, {
    ok: false,
    message: "",
  });

  useEffect(() => {
    if (state.message && state.ok) {
      toast.success(state.message);
      setOpen(false);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Add user</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a user</DialogTitle>
          <DialogDescription>
            They&apos;ll sign in with this email and password.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cu-name">Name</Label>
            <Input id="cu-name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cu-email">Email</Label>
            <Input id="cu-email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cu-password">Temporary password</Label>
            <Input
              id="cu-password"
              name="password"
              type="text"
              autoComplete="off"
              required
            />
            <p className="text-muted-foreground text-xs">
              At least 10 characters. Share it with them to change later.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cu-role">Role</Label>
            <Select name="role" defaultValue="user">
              <SelectTrigger id="cu-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                {currentRole === "super_admin" && (
                  <SelectItem value="super_admin">Super admin</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create user"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ResetPasswordDialog({
  open,
  onOpenChange,
  row,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  row: Row;
}) {
  const [state, action, pending] = useActionState(resetPasswordAction, {
    ok: false,
    message: "",
  });

  useEffect(() => {
    if (state.message && state.ok) {
      toast.success(state.message);
      onOpenChange(false);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset password</DialogTitle>
          <DialogDescription>
            Set a new password for {row.email}.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <input type="hidden" name="userId" value={row.id} />
          <div className="space-y-2">
            <Label htmlFor="rp-password">New password</Label>
            <Input
              id="rp-password"
              name="password"
              type="text"
              autoComplete="off"
              required
            />
            <p className="text-muted-foreground text-xs">At least 10 characters.</p>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Set password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
