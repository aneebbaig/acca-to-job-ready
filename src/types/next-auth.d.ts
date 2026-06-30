import type { DefaultSession } from "next-auth";

type Role = "super_admin" | "admin" | "user";
type Status = "active" | "inactive";

declare module "next-auth" {
  interface User {
    role: Role;
    status: Status;
  }
  interface Session {
    user: {
      id: string;
      role: Role;
      status: Status;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    status: Status;
  }
}
