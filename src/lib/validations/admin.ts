// lib/validations/admin.ts
import { z } from "zod";

/**
 * Interface for admin dashboard statistics
 */
export interface AdminStats {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {number}
   */
  totalUsers: number;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {number}
   */
  totalWallets: number;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {number}
   */
  totalTransactions: number;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {number}
   */
  totalAmount: number;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {number}
   */
  recentTransactionCount: number;
}

/**
 * Interface for paginated users response
 */
export interface PaginatedUsers {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {{
   *     id: string;
   *     email: string;
   *     name: string;
   *     isActive: boolean;
   *     isAdmin: boolean;
   *     createdAt: string;
   *     updatedAt: string;
   *     profile: {
   *       address: null | string;
   *       city: null | string;
   *       state: null | string;
   *       postalCode: null | string;
   *       phone: null | string;
   *     };
   *   }[]}
   */
  users: {
    id: string;
    email: string;
    name: string;
    isActive: boolean;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
    profile: {
      address: null | string;
      city: null | string;
      state: null | string;
      postalCode: null | string;
      phone: null | string;
    };
  }[];
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {{
   *     page: number;
   *     pageSize: number;
   *     totalPages: number;
   *     totalItems: number;
   *   }}
   */
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

/**
 * Interface for admin transaction
 */
export interface AdminTransaction {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string}
   */
  id: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {number}
   */
  amount: number;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string}
   */
  name: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string}
   */
  status: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string}
   */
  type: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string}
   */
  createdAt: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {{
   *     id?: string;
   *     email: string;
   *     name: string;
   *   }}
   */
  user: {
    id?: string;
    email: string;
    name: string;
  };
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {{
   *     id: string;
   *     name: string;
   *   }}
   */
  wallet: {
    id: string;
    name: string;
  };
}

/**
 * Zod schema for getting admin stats (no input needed)
 */
export const GetAdminStatsSchema = z.object({}).meta({
  description: "Input schema for getting admin stats (no input required)",
});

/**
 * Zod schema for getting users with pagination and search
 */
export const GetUsersSchema = z
  .object({
    page: z
      .number()
      .int()
      .min(1)
      .default(1)
      .meta({ description: "Page number (1-based)" }),
    pageSize: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10)
      .meta({ description: "Number of users per page" }),
    search: z.string().trim().optional().meta({
      description: "Search term for filtering users by name or email",
    }),
  })
  .meta({
    description: "Input schema for getting users with pagination and search",
  });

/**
 * Zod schema for getting recent transactions
 */
export const GetRecentTransactionsSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10)
      .meta({ description: "Maximum number of transactions to return" }),
  })
  .meta({ description: "Input schema for getting recent transactions" });
