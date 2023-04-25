import {
  parseMonthRecord,
  TMonthRecord,
  TRawRecord,
  TRecordType,
} from "../../../type";
import Category, { TCategory } from "../../../components/SummaryPage/Category";
import ProgressBar from "../../../components/AnalysisPage/ProgressBar";
import theme from "../../../theme";
import ReactEcharts from "echarts-for-react";
import "./index.scss";

interface CategorySectionProps {
  type: TRecordType;
  monthRecord?: TMonthRecord;
}

type TClass = {
  amount: number;
  category: TCategory;
  ratio: number;
};

const classify = (rawRecordList: TRawRecord[]) => {
  let classified: { [key: string]: TClass } = {};
  let total = 0;

  rawRecordList.forEach((r) => {
    const { category } = r;

    if (!(category.id in classified)) {
      classified[category.id] = {
        amount: 0,
        category: category,
        ratio: 0.0,
      };
    }

    total += r.amount;

    classified[category.id].amount += r.amount;
    classified[category.id].ratio = classified[category.id].amount / total;
  });

  // 计算 ratio
  Object.values(classified).forEach((c) => (c.ratio = c.amount / total));

  return Object.values(classified).sort((a, b) => b.ratio - a.ratio);
};

const CategorySection = (props: CategorySectionProps) => {
  const { monthRecord, type } = props;
  const rawRecordList = monthRecord
    ? parseMonthRecord(monthRecord).filter((r) => r.recordType === type)
    : [];
  const classified = classify(rawRecordList);
  let data: { value: number; name: string }[] = [];
  classified.map(({ category, amount, ratio }) => {
    data.push({
      value: amount,
      name: category.name + " " + (ratio * 100).toFixed(2) + "%",
    });
  });
  const option = {
    textStyle: {
      color: "#808080",
    },
    series: [
      {
        type: "pie",
        radius: ["30%", "60%"],
        data: data,
        color: [
          "#3EB575",
          "#51BD83",
          "#66C492",
          "#78CB9F",
          "#89D3AC",
          "#9FDABA",
          "#B3E1C7",
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return (
    <section className="category-section">
      <div className="header">
        <span>收支构成</span>
      </div>
      <ReactEcharts
        option={option}
        style={{ height: "200px", width: "100%" }}
      ></ReactEcharts>

      {classified.length !== 0 ? (
        <ul className="class-list">
          {classified.map(({ category, amount, ratio }) => (
            <li className="class-item" key={category.id}>
              <span className="category">
                <Category category={category} recordType={type} size={20} />
                <span style={{ marginLeft: 8 }}>{category.name}</span>
              </span>
              <span className="ratio">
                <ProgressBar
                  color={type === "expense" ? theme.$success : theme.$warning}
                  value={ratio}
                  width={200}
                  height={6}
                />
              </span>
              <div className="amount">￥{amount.toFixed(2)}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">暂无数据</div>
      )}
    </section>
  );
};

export default CategorySection;
