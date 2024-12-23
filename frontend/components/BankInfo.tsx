"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  cn,
  formUrlQuery,
  formatAmount,
  getAccountTypeColors,
} from "@/lib/utils";
import { BankInfoProps, AccountTypes } from "@/types";

const BankInfo = ({ account, accountId, type }: BankInfoProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isActive = accountId === account?.accountId;

  const handleBankChange = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: account?.accountId,
    });
    router.push(newUrl, { scroll: false });
  };

  const colors = getAccountTypeColors(account?.type as AccountTypes);

  return (
    <div
      onClick={handleBankChange}
      className={cn(`bank-info ${colors.bg}`, {
        "shadow-sm border-green-600": type === "card" && isActive,
        "rounded-xl": type === "card",
        "hover:shadow-sm cursor-pointer": type === "card",
      })}
    >
      <figure
        className={`flex-center h-fit rounded-full bg-green-100 ${colors.lightBg}`}
      >
        <Image
          src="/icons/connect-bank.svg"
          width={20}
          height={20}
          alt={account.institution}
          className="m-2 min-w-5"
        />
      </figure>
      <div className="flex w-full flex-1 flex-col justify-center gap-1">
        <div className="bank-info_content">
          <h2
            className={`text-16 line-clamp-1 flex-1 font-bold text-green-900 ${colors.title}`}
          >
            {account.name}
          </h2>
          {type === "full" && (
            <p
              className={`text-12 rounded-full px-3 py-1 font-medium text-green-700 ${colors.subText} ${colors.lightBg}`}
            >
              {account.institution}
            </p>
          )}
        </div>
        <p className={`text-16 font-medium text-green-700 ${colors.subText}`}>
          {formatAmount(account.currentBalance)}
        </p>
      </div>
    </div>
  );
};

export default BankInfo;