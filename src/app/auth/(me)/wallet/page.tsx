"use client";

import {
  useWalletService,
  useWalletTransactionsService,
} from "@/services/walletServices";
import TableMyWallet from "@/components/organisms/table-my-wallet";

import { WalletTransaction } from "@/types";

function WalletPage() {
  const { data: walletData } = useWalletService();
  const { data: walletTransaction } = useWalletTransactionsService();

  console.log(walletTransaction?.data, "tran");
  // Sort transactions by createdAt in descending order (newest first)
  const sortedTransactions = (walletData?.data?.transactions || []).sort(
    (a: WalletTransaction, b: WalletTransaction) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <TableMyWallet transactions={sortedTransactions} />
    </div>
  );
}

export default WalletPage;
