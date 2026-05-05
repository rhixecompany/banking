/**
 * Navigation links for the sidebar and mobile nav.
 *
 * @constant
 * @type {Array<{imgURL: string, label: string, route: string}>}
 */
export const sidebarLinks = [
  {
    imgURL: "/icons/home.svg",
    label: "Home",
    route: "/",
  },
  {
    imgURL: "/icons/dollar-circle.svg",
    label: "My Wallets",
    route: "/my-wallets",
  },
  {
    imgURL: "/icons/transaction.svg",
    label: "Transaction History",
    route: "/transaction-history",
  },
  {
    imgURL: "/icons/money-send.svg",
    label: "Transfer Funds",
    route: "/payment-transfer",
  },
];

// good_user / good_password - Bank of America
/**
 * Description placeholder
 *
 * @type {"6627ed3d00267aa6fa3e"}
 */
export const TEST_USER_ID = "6627ed3d00267aa6fa3e";

// custom_user -> Chase Bank
// export const TEST_ACCESS_TOKEN =
//   "access-sandbox-da44dac8-7d31-4f66-ab36-2238d63a3017";

// custom_user -> Chase Bank
/**
 * Description placeholder
 *
 * @type {"access-sandbox-229476cf-25bc-46d2-9ed5-fba9df7a5d63"}
 */
export const TEST_ACCESS_TOKEN =
  "access-sandbox-229476cf-25bc-46d2-9ed5-fba9df7a5d63";

/**
 * Description placeholder
 *
 * @type {{}}
 */
export const ITEMS = [
  {
    accessToken: "access-sandbox-83fd9200-0165-4ef8-afde-65744b9d1548",
    // eslint-disable-next-line no-secrets/no-secrets
    accountId: "X7LMJkE5vnskJBxwPeXaUWDBxAyZXwi9DNEWJ",
    id: "6624c02e00367128945e",
    // eslint-disable-next-line no-secrets/no-secrets
    itemId: "VPMQJKG5vASvpX8B6JK3HmXkZlAyplhW3r9xm",
    userId: "6627ed3d00267aa6fa3e",
  },
  {
    accessToken: "access-sandbox-74d49e15-fc3b-4d10-a5e7-be4ddae05b30",
    // eslint-disable-next-line no-secrets/no-secrets
    accountId: "x1GQb1lDrDHWX4BwkqQbI4qpQP1lL6tJ3VVo9",
    id: "6627f07b00348f242ea9",
    // eslint-disable-next-line no-secrets/no-secrets
    itemId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
    userId: "6627ed3d00267aa6fa3e",
  },
];

/**
 * Description placeholder
 *
 * @type {{ "Food and Drink": { bg: string; circleBg: string; text: { main: string; count: string; }; progress: { bg: string; indicator: string; }; icon: string; }; Travel: { bg: string; circleBg: string; text: { main: string; count: string; }; progress: { ...; }; icon: string; }; default: { ...; }; }}
 */
export const topCategoryStyles = {
  default: {
    bg: "bg-pink-25",
    circleBg: "bg-pink-100",
    icon: "/icons/shopping-bag.svg",
    progress: {
      bg: "bg-pink-100",
      indicator: "bg-pink-700",
    },
    text: {
      count: "text-pink-700",
      main: "text-pink-900",
    },
  },
  "Food and Drink": {
    bg: "bg-blue-25",
    circleBg: "bg-blue-100",
    icon: "/icons/monitor.svg",
    progress: {
      bg: "bg-blue-100",
      indicator: "bg-blue-700",
    },
    text: {
      count: "text-blue-700",
      main: "text-blue-900",
    },
  },
  Travel: {
    bg: "bg-success-25",
    circleBg: "bg-success-100",
    icon: "/icons/coins.svg",
    progress: {
      bg: "bg-success-100",
      indicator: "bg-success-700",
    },
    text: {
      count: "text-success-700",
      main: "text-success-900",
    },
  },
};

/**
 * Description placeholder
 *
 * @type {{ "Food and Drink": { borderColor: string; backgroundColor: string; textColor: string; chipBackgroundColor: string; }; Payment: { borderColor: string; backgroundColor: string; textColor: string; chipBackgroundColor: string; }; ... 4 more ...; default: { ...; }; }}
 */
export const transactionCategoryStyles = {
  "Bank Fees": {
    backgroundColor: "bg-green-600",
    borderColor: "border-success-600",
    chipBackgroundColor: "bg-inherit",
    textColor: "text-success-700",
  },
  default: {
    backgroundColor: "bg-blue-500",
    borderColor: "",
    chipBackgroundColor: "bg-inherit",
    textColor: "text-blue-700",
  },
  "Food and Drink": {
    backgroundColor: "bg-pink-500",
    borderColor: "border-pink-600",
    chipBackgroundColor: "bg-inherit",
    textColor: "text-pink-700",
  },
  Payment: {
    backgroundColor: "bg-green-600",
    borderColor: "border-success-600",
    chipBackgroundColor: "bg-inherit",
    textColor: "text-success-700",
  },
  Processing: {
    backgroundColor: "bg-gray-500",
    borderColor: "border-[#F2F4F7]",
    chipBackgroundColor: "bg-[#F2F4F7]",
    textColor: "text-[#344054]",
  },
  Success: {
    backgroundColor: "bg-[#12B76A]",
    borderColor: "border-[#12B76A]",
    chipBackgroundColor: "bg-[#ECFDF3]",
    textColor: "text-[#027A48]",
  },
  Transfer: {
    backgroundColor: "bg-red-700",
    borderColor: "border-red-700",
    chipBackgroundColor: "bg-inherit",
    textColor: "text-red-700",
  },
};
