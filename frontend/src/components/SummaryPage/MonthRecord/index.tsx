import * as React from "react";
import DayRecord from "../DayRecord";
import { TMonthRecord } from "../../../type";
import Divider from "../../Divider";
import dayjs from "dayjs";
import "./index.scss";

type TProps = {
  monthRecord: TMonthRecord;
};

const MonthRecord: React.FC<TProps> = (props) => {
  const { month, recordList, incomeTotal, expenseTotal } = props.monthRecord;

  const curtMonth = dayjs().format("YYYY-MM");

  return (
    <li id={month} className="month-record">
      {curtMonth !== month && ( // 只显示非当月的记录
        <div className="header">
          <span>{dayjs(month).format("YYYY年M月")}</span>
          <Divider gap={8} />
          <span style={{ marginRight: 12 }}>总支出￥{expenseTotal}</span>
          <span>总收入￥{incomeTotal}</span>
        </div>
      )}
      <ul>
        {recordList &&
          recordList.map((dayRecord) => (
            <DayRecord key={dayRecord.day} dayRecord={dayRecord} />
          ))}
      </ul>
    </li>
  );
};

export default MonthRecord;
