import ReactEcharts from "echarts-for-react";
import {
  parseMonthRecord,
  TMonthRecord,
  TRawRecord,
  TRecordType,
} from "../../../type";
import dayjs, { Dayjs } from "dayjs";
import { getDaysInMonth } from "../../../lib/date";
import theme from "../../../theme";
import "./index.scss";

type TProps = {
  type: TRecordType;
  month: Dayjs;
  monthRecord?: TMonthRecord;
};

const getYData = (days: number[], rawRecordList: TRawRecord[]) => {
  return days.map((d) => {
    const records = rawRecordList.filter(
      (r) => dayjs(r.date).get("date") === d
    );
    let res = 0;
    for (let record of records) {
      res += record.amount;
    }
    return res;
  });
};

const barChart = (
  xData: any[],
  yData: any[],
  type: TRecordType,
  month: string
) => {
  const color = type === "expense" ? theme.$success : theme.$warning;
  const name = type === "expense" ? "支出" : "收入";

  return {
    grid: {
      left: "15%",
    },
    tooltip: {
      show: true,
      className: "tooltip",
      trigger: "axis",
      position: function (
        point: number[],
        params: any,
        dom: any,
        rect: any,
        size: any
      ) {
        let rectWidth = (size.viewSize[0] * 0.75) / xData.length;
        return [
          size.viewSize[0] * 0.15 +
            rectWidth * (params[0].dataIndex + 0.5) -
            dom.offsetWidth / 2,
          "0%",
        ];
      },
      formatter: function (params: any) {
        return `<span style="font-size: 10px;color:#fff">${month}月${params[0].name}日共${params[0].seriesName}</span><br/><span style='color:${color};font-size:12px'>￥${params[0].value}<span>`;
      },
      backgroundColor: "#000000c0",
      borderColor: "#00000000",
      padding: [0, 10],
    },
    xAxis: {
      nameLocation: "center",
      axisTick: {
        show: false,
      },
      axisLabel: {
        interval: function (index: number) {
          return (index + 1) % 5 === 0 && index < 28;
        },
        formatter: function (value: number) {
          return `${month}.${value}`;
        },
        fontSize: 10,
        textStyle: { color: theme.$subText },
      },
      data: xData,
    },
    yAxis: {
      show: true,
      axisLabel: {
        formatter: function (value: number) {
          return `￥${Intl.NumberFormat().format(value)}`;
        },
        fontSize: 10,
      },
      textStyle: {
        color: theme.$subText,
      },
    },
    selectedMode: "series",
    select: {
      itemStyle: {
        color: color,
        borderWidth: 0,
      },
      labelLine: {
        show: false,
      },
    },
    series: [
      {
        type: "bar",
        name,
        data: yData,
        itemStyle: {
          color: color,
        },
        barMinHeight: 4,
      },
    ],
  };
};

const DayAnalysis: React.FC<TProps> = (props) => {
  const { month, monthRecord, type } = props;

  const rawRecordList = monthRecord
    ? parseMonthRecord(monthRecord).filter((r) => r.recordType === type)
    : [];

  // 每日对比
  const xDayData = getDaysInMonth(month);
  const yDayData = getYData(xDayData, rawRecordList);

  const dayChartOptions = barChart(xDayData, yDayData, type, month.format("M"));

  return (
    <section className="day-analysis">
      <div className="header">
        <span>每日对比</span>
      </div>

      <div className="main">
        <ReactEcharts option={dayChartOptions} />
      </div>
    </section>
  );
};

export default DayAnalysis;
