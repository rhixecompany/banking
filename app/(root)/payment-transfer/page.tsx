import { cacheLife } from "next/cache";

/**
 (Payment transfer page component.
* @handles bank-to-bank transfer using Dwolla ACH.
* @returns {JSX.Element}
*/

async function getTransferConfig() {
  "use cache";
  cacheLife("minutes");
  return {};
}

const PaymentTransfer = async (): Promise<JSX.Element> => {
  return <div>Payment Transfer</div>;
};

export default PaymentTransfer;
