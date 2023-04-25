import Layout from "../../components/Layout";
import Drawer from "../../components/Drawer";
import MonthPanel from "../../components/SummaryPage/MonthPanel";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { TMonthRecord, TRecordType } from "../../type";
import CategorySection from "../../components/AnalysisPage/CategorySection";
import Divider from "../../components/Divider";
import DayAnalysis from "../../components/AnalysisPage/DayAnalysis";
import MonthAnalysis from "../../components/AnalysisPage/MonthAnalysis";
import useAxios from "../../hooks/useAxios";
import Icon from "../../components/Icon";
import "./index.scss";

const Analysis: React.FC = () => {
  const [showMonth, toggleMonth] = useState(false);
  const [month, setMonth] = useState(dayjs());
  const [months, setMonths] = useState<string[]>([]);
  const [type, setType] = useState<TRecordType>("expense");
  const { data, loading, error, refetch } = useAxios(
    {
      url: "/get_records_by_month",
      method: "POST",
      data: {
        book_id: 1,
        month: month.format("YYYY-MM"),
      },
    },
    { trigger: false }
  );
  const [selectedRecordList, setSelectedRecordList] = useState<TMonthRecord>({
    month: "",
    recordList: [],
    incomeTotal: 0,
    expenseTotal: 0,
  });

  useEffect(() => {
    if (data) {
      if (data.data.result) {
        let idx = 1;
        let months = [dayjs().format("YYYY-MM")];
        while (true) {
          let day = dayjs().subtract(idx, "month");
          if (
            day.format("YYYY-MM") === data.data.data.first_month.substring(0, 7)
          ) {
            break;
          }
          months.push(day.format("YYYY-MM"));
          idx += 1;
        }
        months.reverse();
        setMonths(months);
        setSelectedRecordList(data.data.data.records);
      } else {
        setMonths([]);
        setSelectedRecordList({
          month: "",
          recordList: [],
          incomeTotal: 0,
          expenseTotal: 0,
        });
      }
    }
  }, [data]);

  useEffect(() => {
    refetch({
      data: {
        book_id: 1,
        month: month.format("YYYY-MM"),
      },
    });
  }, [month]);

  return (
    <Layout className="analysis">
      <div className="analysis-content">
        <div className={`header ${type}`}>
          <div className="header-buttons">
            <div
              className="month-selecter"
              onClick={() => {
                toggleMonth(true);
              }}
            >
              {month.format("YYYY年M月")}{" "}
              <Icon name="icon-rili" color="white" size={16}></Icon>
            </div>
            <div
              className={`type-button${type === "expense" ? " select" : ""}`}
              onClick={() => {
                setType("expense");
              }}
            >
              支出
            </div>
            <div
              className={`type-button${type === "income" ? " select" : ""}`}
              onClick={() => {
                setType("income");
              }}
            >
              入账
            </div>
          </div>
          <div className="header-info">
            <span>共支出</span>
            <br />
            <span className="symbol">￥</span>
            {selectedRecordList.expenseTotal.toFixed(2)}
          </div>
        </div>

        <section className="main">
          <CategorySection type={type} monthRecord={selectedRecordList} />

          <Divider direction="horizontal" gap={24} />

          <DayAnalysis
            type={type}
            month={month}
            monthRecord={selectedRecordList}
          />

          <Divider direction="horizontal" gap={24} />

          <MonthAnalysis type={type} month={month} />
        </section>
      </div>

      {/*选择月份*/}
      {showMonth && (
        <Drawer title="请选择月份" closeDrawer={() => toggleMonth(false)}>
          <MonthPanel
            months={months}
            value={month}
            closeDrawer={() => toggleMonth(false)}
            onSubmit={(newMonth: Dayjs) => setMonth(newMonth)}
          />
        </Drawer>
      )}
    </Layout>
  );
};

export default Analysis;
