import { requireAdmin } from "@/lib/auth-guards";
import { listUsers } from "@/lib/users";
import { UsersManager } from "./users-manager";

export const metadata = { title: "Users" };

export default async function UsersPage() {
  const admin = await requireAdmin();
  const users = await listUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Create accounts, change roles, reset passwords, and deactivate access.
        </p>
      </div>
      <UsersManager
        users={users}
        currentUserId={admin.id}
        currentRole={admin.role as "super_admin" | "admin" | "user"}
      />
    </div>
  );
}
