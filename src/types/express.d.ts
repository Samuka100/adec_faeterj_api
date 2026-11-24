import type { UserRole } from "../enum/user-role.enum.js";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      userRole?: UserRole;
    }
  }
}

export {};