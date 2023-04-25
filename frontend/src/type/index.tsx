export type TRecordType = "expense" | "income" | "other";
export type TRawRecord = {
  id: number;
  date: string;
  category: {
    id: number;
    name: string;
    iconName: string;
    categoryType: TRecordType;
  };
  amount: number;
  note: string;
  recordType: TRecordType;
};
export type TRecord = {
  incomeTotal: number;
  expenseTotal: number;
};
export type TDayRecord = TRecord & {
  day: string;
  recordList: TRawRecord[];
};
export type TMonthRecord = TRecord & {
  month: string;
  recordList: TDayRecord[];
};
