import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import "./index.scss";
import theme from "../../../theme";

interface MonthPanelProps {
  months: string[];
  value: Dayjs;
  closeDrawer: () => void;
  onSubmit: (newMonth: Dayjs) => void;
}

export const getPrevMonths = () => {
  const DURATION = 5;

  return [...Array(DURATION)].map((_, index) =>
    dayjs().subtract(index, "month")
  );
};

const MonthPanel = (props: MonthPanelProps) => {
  const { months, closeDrawer, value, onSubmit } = props;

  const [years, setYears] = useState<{ [key: string]: number[] }>({});
  useEffect(() => {
    let years_dic: { [key: string]: number[] } = {};
    for (let month of months) {
      let date = new Date(month);
      years_dic[date.getFullYear()] = years_dic[date.getFullYear()]
        ? years_dic[date.getFullYear()]
        : [];
      years_dic[date.getFullYear()].push(date.getMonth());
    }
    setYears(years_dic);
  }, [months]);

  const submit = (year: string, m: number) => {
    onSubmit(dayjs(new Date(year + "-" + (m + 1))));
    closeDrawer();
  };

  return (
    <section className="month-panel">
      {Object.keys(years).map((year) => {
        return (
          <section className="year" key={year}>
            <p>{year}</p>
            <ul className="month-list">
              {years[year].map((m: number) => (
                <li
                  className="month-item"
                  style={{
                    background: value.month() === m ? theme.$success : "white",
                    color: value.month() === m ? "white" : theme.$normalText,
                  }}
                  key={year + m}
                  onClick={() => submit(year, m)}
                >
                  {m + 1}月
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </section>
  );
};

export default MonthPanel;
