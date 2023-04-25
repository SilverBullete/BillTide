import { TRecordType } from "../../../type";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import useAxios from "../../../hooks/useAxios";
import theme from "../../../theme";
import "./index.scss";

interface MonthAnalysisProps {
  type: TRecordType;
  month: Dayjs;
}

const barChart = (xData: any[], yData: any[], type: TRecordType) => {
  const color = type === "expense" ? theme.$success : theme.$warning;
  const name = type === "expense" ? "支出" : "收入";

  return {
    tooltip: {
      show: false,
    },
    xAxis: {
      nameLocation: "center",
      axisTick: {
        show: false,
      },
      axisLabel: {
        formatter: function (value: number) {
          return `${value}`;
        },
        fontSize: 10,
        textStyle: { color: theme.$subText },
      },
      data: xData,
    },
    yAxis: {
      show: false,
    },

    series: [
      {
        type: "bar",
        name,
        data: yData,
        itemStyle: {
          color: color + "c0",
        },
        barMinHeight: 4,
        label: {
          show: true,
          precision: 1,
          position: "top",
          formatter: function (params: any) {
            return `￥${params.value.toFixed(2)}`;
          },
          color: color + "a0",
          fontSize: 8,
          align: "center",
        },
        selectedMode: "single",
        select: {
          itemStyle: {
            color: color,
            borderWidth: 0,
          },
          labelLine: {
            show: false,
          },
          label: {
            color: color,
          },
        },
        animation: false,
      },
    ],
  };
};

const MonthAnalysis = (props: MonthAnalysisProps) => {
  const { month, type } = props;
  const [monthChartOptions, setMonthChartOptions] = useState<any>({});
  const [selectMonth, setSelectMonth] = useState<string>("");
  const clickHandel = (params: any) => {
    setSelectMonth(params.name);
  };

  const { data, error, loading, refetch } = useAxios(
    {
      url: "/get_recent_records_count",
      method: "POST",
      data: {
        book_id: 1,
        month: month.format("YYYY-MM"),
      },
    },
    { trigger: false }
  );

  useEffect(() => {
    if (data) {
      if (data.data.result) {
        let xData = [];
        let yData = [];
        for (let d of data.data.data) {
          xData.push(d.month);
          if (type === "expense") yData.push(d.expenseTotal);
          else yData.push(d.incomeTotal);
        }
        xData.reverse();
        yData.reverse();
        setMonthChartOptions(barChart(xData, yData, type));
      } else {
        setMonthChartOptions(barChart([], [], type));
      }
    }
  }, [data, type]);

  useEffect(() => {
    refetch({
      data: {
        book_id: 1,
        month: month.format("YYYY-MM"),
      },
    });
  }, [month]);

  return (
    <div className="month-analysis">
      <div className="header">
        <span>月度对比</span>
      </div>

      <div className="main">
        <ReactEcharts
          option={monthChartOptions}
          onEvents={{ click: clickHandel }}
        />
      </div>
    </div>
  );
};

export default MonthAnalysis;
