import { useState, useEffect } from "react";
import Icon from "../../components/Icon";
import Divider from "../../components/Divider";
import MonthRecord from "../../components/SummaryPage/MonthRecord";
import { TRecordType } from "../../type";
import dayjs, { Dayjs } from "dayjs";
import { MONTH } from "../../lib/date";
import Sticker from "../../components/SummaryPage/Sticker";
import theme from "../../theme";
import Drawer from "../../components/Drawer";
import Money from "../../components/SummaryPage/Money";
import CategoryFilter from "../../components/SummaryPage/CategoryFilter";
import MonthPanel from "../../components/SummaryPage/MonthPanel";
import Layout from "../../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";

import { Picker, Space, ActionSheet } from "antd-mobile";
import type { PickerValue } from "antd-mobile/es/components/picker";
import { DownOutline, MoreOutline } from "antd-mobile-icons";
import type { Action } from "antd-mobile/es/components/action-sheet";
import "./index.scss";

const BookField = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [books, setBooks] = useState<string[][]>([[]]);
  const [dic, setDic] = useState<{ [key: string]: number }>({});
  const { data, loading } = useAxios(
    {
      url: "/get_books",
      method: "POST",
      data: {
        user_id: "",
      },
    },
    { trigger: false }
  );
  const [actionVisible, setActionVisible] = useState(false);
  const actions: Action[] = [
    {
      text: "编辑",
      key: "edit",
      onClick: () => {
        navigate("/book_edit/" + id);
      },
    },
    { text: "从微信账单导入", key: "importFromWechat" },
    { text: "从支付宝账单导入", key: "importFromAlipay" },
  ];

  useEffect(() => {
    if (data) {
      if (data.data.result) {
        let temp = [];
        let tempDic: { [key: string]: number } = {};
        for (let book of data.data.data) {
          tempDic[book.name] = book.id;
          temp.push(book.name);
          if (book.id === (id ? +id : 0)) {
            setTitle(book.name);
          }
        }
        setBooks([temp]);
        setDic(tempDic);
      } else {
        setBooks([[]]);
      }
    }
  }, [data, id]);

  const onPreValueChange = (value: PickerValue[]) => {
    const v = value[0];
    if (v === null) return;
    setTitle(v);
    navigate(`/book/${dic[v]}`);
  };

  return (
    <>
      <div className="title">
        <Space align="center" onClick={() => setVisible(true)}>
          <div>{title ? title : "暂无账本"}</div>
          <DownOutline />
        </Space>
        <Picker
          columns={books}
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
          value={[title]}
          onConfirm={onPreValueChange}
        />
      </div>
      <div className="more" onClick={() => setActionVisible(true)}>
        <MoreOutline />
      </div>
      <ActionSheet
        visible={actionVisible}
        actions={actions}
        onClose={() => setActionVisible(false)}
      />
    </>
  );
};

const Summary = () => {
  const { id } = useParams();

  const [showMonth, toggleMonth] = useState(false);
  const [showFilter, toggleFilter] = useState(false);
  const [showMoney, toggleMoney] = useState(false);

  const [month, setMonth] = useState(dayjs());
  const [months, setMonths] = useState<string[]>([]);
  const [monthCount, setMonthCount] = useState<{
    [key: string]: { expenseTotal: number; incomeTotal: number };
  }>({});
  const [filterId, setFilterId] = useState(0);
  const [filterType, setFilterType] = useState<TRecordType>("expense");
  const [categories, setCategories] = useState<
    { id: number; name: string; categoryType: string }[]
  >([]);

  const [recordList, setRecordList] = useState([]);
  const [firstMonth, setFirstMonth] = useState<number>(0);

  const {
    data: getRecordsData,
    error: getRecordsError,
    loading: getRecordsLoading,
    refetch: getRecordRefetch,
  } = useAxios(
    {
      url: "/get_records_by_book",
      method: "POST",
      data: {
        book_id: 0,
        filter_id: filterId,
      },
    },
    { trigger: false }
  );
  const {
    data: getCategoriesData,
    error: getCategoriesError,
    refetch: getCategoriesRefetch,
  } = useAxios(
    {
      url: "/get_all_categories",
      method: "POST",
      data: {
        user_id: "",
      },
    },
    {
      trigger: false,
    }
  );

  const filter = categories.find((c) => c.id === filterId);

  useEffect(() => {
    getRecordRefetch({
      data: {
        book_id: id,
        filter_id: filterId,
      },
    });
    getCategoriesRefetch({
      data: {
        user_id: "",
      },
    });
  }, []);

  useEffect(() => {
    if (getRecordsData) {
      if (getRecordsData.data.result) {
        setRecordList(getRecordsData.data.data);
        let list = [];
        let dic: {
          [key: string]: { expenseTotal: number; incomeTotal: number };
        } = {};
        for (let monthRecord of getRecordsData.data.data) {
          list.push(monthRecord.month);
          dic[monthRecord.month] = {
            expenseTotal: monthRecord.expenseTotal,
            incomeTotal: monthRecord.incomeTotal,
          };
        }
        list.reverse();
        setMonths(list);
        setMonthCount(dic);
      } else {
        setRecordList([]);
        setMonths([]);
        setMonthCount({});
      }
    }
  }, [getRecordsData]);

  useEffect(() => {
    if (getCategoriesData) {
      if (getCategoriesData.data.code === 200) {
        setCategories(getCategoriesData.data.data);
      }
    }
  }, [getCategoriesData]);

  useEffect(() => {
    let list = document.getElementById("record-list");
    if (list) {
      list.onscroll = function () {
        let blocks = list?.children;
        let height = list?.scrollTop;
        let count = 0;
        let idx = 0;
        if (blocks) {
          for (let block of Array.from(blocks)) {
            let offsetHeight = (block as HTMLLIElement).offsetHeight;
            if (offsetHeight + count > (height || 0)) {
              setFirstMonth(idx);
              setMonth(dayjs(months[months.length - idx - 1]));
              break;
            } else {
              count += offsetHeight;
              idx += 1;
            }
          }
        }
      };
    }
  }, [getRecordsData, getCategoriesData]);

  useEffect(() => {
    getRecordRefetch({
      url: "/get_records_by_book",
      data: {
        book_id: id,
        filter_id: filterId,
      },
    });
  }, [id, filterId]);

  const closeMoney = () => {
    getRecordRefetch({
      url: "/get_records_by_book",
      data: {
        book_id: id,
        filter_id: filterId,
      },
    });
    toggleMoney(false);
  };

  return (
    <Layout className="summary">
      <header className="header">
        <BookField />
      </header>
      <section className="filter-wrapper">
        <section>
          <button className="type-button" onClick={() => toggleFilter(true)}>
            <span>{filter ? filter.name : "全部类型"}</span>
            <Divider color="#68C895" />
            <Icon color="#edf5ed" name="icon-application" />
          </button>
        </section>

        <section className="month-filter-section">
          <button className="month-button" onClick={() => toggleMonth(true)}>
            <span style={{ marginRight: 4 }}>{month.format(MONTH)}</span>
            <Icon color="#A0D8BB" name="icon-drop-down" />
          </button>
          <span style={{ marginRight: 12 }}>
            总支出￥
            {Object.keys(monthCount).length > 0
              ? monthCount[months[firstMonth]].expenseTotal.toFixed(2)
              : "0.00"}
          </span>
          <span>
            总收入￥
            {Object.keys(monthCount).length > 0
              ? monthCount[months[firstMonth]].incomeTotal.toFixed(2)
              : "0.00"}
          </span>
        </section>
      </section>

      {getRecordsLoading ? (
        <div className="empty">暂无数据</div>
      ) : recordList.length !== 0 ? (
        <ul className="record-list" id="record-list">
          {recordList.map((monthRecord: any) => (
            <MonthRecord key={monthRecord.month} monthRecord={monthRecord} />
          ))}
        </ul>
      ) : (
        <div className="empty">暂无数据</div>
      )}

      {/*记账*/}
      <Sticker onClick={() => toggleMoney(true)}>
        <Icon name="icon-survey" size={22} color={theme.$success} />
      </Sticker>

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

      {/*过滤 Category*/}
      {showFilter && (
        <Drawer closeDrawer={() => toggleFilter(false)}>
          <CategoryFilter
            categories={categories}
            value={filterId}
            recordType={filterType}
            closeDrawer={() => toggleFilter(false)}
            onSubmit={(id, type) => {
              setFilterId(id);
              setFilterType(type);
            }}
          />
        </Drawer>
      )}

      {/*记账*/}
      {showMoney && (
        <Drawer closeDrawer={closeMoney}>
          <Money closeDrawer={closeMoney} bookId={id ? +id : 0} />
        </Drawer>
      )}
    </Layout>
  );
};

export default Summary;
