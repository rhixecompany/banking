import { cacheLife } from "next/cache";

/**
 (Transaction history page component.
* @returns {JSX.Element}
*/

async function getTransactionHistory() {
  "use cache";
  cacheLife("hours");
  return [];
}

const TransactionHistory = async (): Promise<JSX.Element> => {
  return <div>Transaction History</div>;
};

export default TransactionHistory;
