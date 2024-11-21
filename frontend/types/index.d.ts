/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */

import { JwtPayload } from "jwt-decode";

declare interface CustomJwtPayload extends JwtPayload {
  role: string;
}

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// ========================================

declare type SignUpParams = {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  email: string;
  password: string;
};

declare type LoginUser = {
  email: string;
  password: string;
};

declare type loginResponse = {
  emailId: string;
  firstName: string;
  userId: string;
  lastName: string;
  membershipStatus: string;
  role: string;
  familyId?: string | null;
}

declare type User = {
  // $id: string;
  email: string;
  userId: string;
  // dwollaCustomerUrl: string;
  // dwollaCustomerId: string;
  firstName: string;
  lastName: string;
  // address1: string;
  // city: string;
  // state: string;
  // postalCode: string;
  // dateOfBirth: string;
  // ssn: string;
};

declare type NewUserParams = {
  userId: string;
  email: string;
  name: string;
  password: string;
};

declare type Account = {
  accountId: string;
  availableBalance: number;
  currentBalance: number;
  name: string;
  institution: string;
  type: string;
  accountNumber: string;
};

declare type Transaction = {
  transactionId: string;
  name: string;
  date: string;
  amount: number;
  type: string;
  category: string;
  pending: boolean;
  accountId: string;
};

declare type AccountMinimal = {
  accountId: string;
  name: string;
}

declare type BalanceSheetItemDto = {
  itemId: string;
  name: string;
  type: string;
  description: string;
  amount: number;
  frequencyNumber: number;
  frequency: string;
  account: AccountMinimal;
}


declare type IndividualGoalsDto = {
  individualGoalId: string;
  name: string;
  goalAmount: number;
  amountContributed: number;
  description: string;
  frequencyNumber: number;
  frequency: string;
  autoContribute: boolean;
  status: string;
  createdDate: Date;
  targetDate: Date;
  account: AccountMinimal;
}

declare type Bank = {
  $id: string;
  accountId: string;
  bankId: string;
  accessToken: string;
  fundingSourceUrl: string;
  userId: string;
  sharableId: string;
};

declare type AccountTypes =
  | "depository"
  | "credit"
  | "loan "
  | "investment"
  | "other";

declare type Category = "Food and Drink" | "Travel" | "Transfer";

declare type CategoryCount = {
  name: string;
  count: number;
  totalCount: number;
};

declare type Receiver = {
  firstName: string;
  lastName: string;
};

declare type TransferParams = {
  sourceFundingSourceUrl: string;
  destinationFundingSourceUrl: string;
  amount: string;
};

declare type AddFundingSourceParams = {
  dwollaCustomerId: string;
  processorToken: string;
  bankName: string;
};

declare type NewDwollaCustomerParams = {
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
};

declare interface CreditCardProps {
  account: Account;
  userName?: string;
  showBalance?: boolean;
}

declare interface BankInfoProps {
  account: Account;
  accountId?: string;
  type: "full" | "card";
}

declare interface HeaderBoxProps {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  user?: string;
}

declare interface MobileNavProps {
  user: loginResponse | null;
}

declare interface PageHeaderProps {
  topTitle: string;
  bottomTitle: string;
  topDescription: string;
  bottomDescription: string;
  connectBank?: boolean;
}

declare interface PaginationProps {
  page: number;
  totalPages: number;
}

declare interface PlaidLinkProps {
  user: User;
  variant?: "primary" | "ghost";
  dwollaCustomerId?: string;
}

// declare type User = sdk.Models.Document & {
//   accountId: string;
//   email: string;
//   name: string;
//   items: string[];
//   accessToken: string;
//   image: string;
// };

declare interface AuthFormProps {
  type: "login" | "register";
}

declare interface BankDropdownProps {
  accounts: Account[];
  setValue?: UseFormSetValue<any>;
  otherStyles?: string;
}

declare interface BankTabItemProps {
  account: Account;
  accountId?: string;
}

declare interface TotalBalanceBoxProps {
  accounts: Account[];
  totalBanks: number;
  totalCurrentBalance: number;
}

declare interface TotalExpenseBoxProps {
  category: CategoryCount[];
  totalExpenses: number;
  categoryCount: CategoryCount[];
}

declare interface FooterProps {
  user: loginResponse | null;
  type?: 'mobile' | 'desktop'
}

declare interface RightSidebarProps {
  user: loginResponse | null;
  // transactions: Transaction[];
  // banks: Bank[] & Account[];
  banks: Account[];
  onBankAccountAdded;
}

declare interface SidebarProps {
  user: loginResponse | null;
}

declare interface RecentTransactionsProps {
  accounts: Account[];
  transactions: Transaction[];
  page: number;
}

declare interface MakeTransactionProps {
  accounts: Account[];
  onTransactionAdded: () => void;
}

declare interface IndividualGoalFormProps {
  user: loginResponse;
  accounts: AccountMinimal[];
  onIndividualGoalAdded: () => void;
}

declare interface TransactionHistoryTableProps {
  transactions: Transaction[];
  page: number;
}

declare interface CategoryBadgeProps {
  category: string;
}

declare interface TransactionTableProps {
  transactions: Transaction[];
}

declare interface CategoryProps {
  category: CategoryCount;
}

declare interface DoughnutChartProps {
  accounts: Account[];
}

declare interface DoughnutChartExpensesProps {
  categoryCount: CategoryCount[];
}

declare interface PaymentTransferFormProps {
  accounts: Account[];
  category: Category[];
}

// Actions
declare interface getAccountsProps {
  userId: string;
}

declare interface getAccountProps {
  appwriteItemId: string;
}

declare interface getInstitutionProps {
  institutionId: string;
}

declare interface getTransactionsProps {
  accessToken: string;
}

declare interface CreateFundingSourceOptions {
  customerId: string; // Dwolla Customer ID
  fundingSourceName: string; // Dwolla Funding Source Name
  plaidToken: string; // Plaid Account Processor Token
  _links: object; // Dwolla On Demand Authorization Link
}

declare interface CreateTransactionProps {
  name: string;
  amount: string;
  senderId: string;
  senderBankId: string;
  receiverId: string;
  receiverBankId: string;
  email: string;
}

declare interface getTransactionsByBankIdProps {
  bankId: string;
}

declare interface signInProps {
  email: string;
  password: string;
}

declare interface getUserInfoProps {
  userId: string;
}

declare interface exchangePublicTokenProps {
  publicToken: string;
  user: User;
}

declare interface createBankAccountProps {
  accessToken: string;
  userId: string;
  accountId: string;
  bankId: string;
  fundingSourceUrl: string;
  sharableId: string;
}

declare interface getBanksProps {
  userId: string;
}

declare interface getBankProps {
  documentId: string;
}

declare interface getBankByAccountIdProps {
  accountId: string;
}

declare interface FamilyMember {
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  role: string;
  membershipStatus: string;
}