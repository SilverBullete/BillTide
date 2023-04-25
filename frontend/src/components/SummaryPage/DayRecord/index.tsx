import * as React from "react";
import Tag from "../Tag";
import EachRecord from "../EachRecord";
import { TDayRecord } from "../../../type";
import dayjs from "dayjs";
import "./index.scss";

type TProps = {
  dayRecord: TDayRecord;
};

const DayRecord: React.FC<TProps> = (props) => {
  const { day, expenseTotal, incomeTotal, recordList } = props.dayRecord;
  const weekday = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  return (
    <ul className="day-record">
      <header className="header">
        <section>
          <span style={{ marginRight: 8 }}>{dayjs(day).format("M月D日")}</span>
          <span>{weekday[new Date(day).getDay()]}</span>
        </section>
        <section className="amount-section">
          <Tag>支</Tag>
          <span style={{ marginRight: 16 }}>{expenseTotal}</span>
          <Tag>收</Tag>
          <span>{incomeTotal}</span>
        </section>
      </header>

      <ul>
        {recordList &&
          recordList.map((record) => (
            <EachRecord key={record.id} record={record} />
          ))}
      </ul>
    </ul>
  );
};

export default DayRecord;
