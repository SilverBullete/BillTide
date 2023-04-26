import * as React from "react";
import { useState, useEffect } from "react";
import Category from "../Category";
import { TRawRecord, TRecordType } from "../../../type";
import Button from "../../Button";
import NumberPad from "../NumbePad";
import { Toast, Dialog, DatePicker } from "antd-mobile";
import dayjs from "dayjs";
import { DownOutline } from "antd-mobile-icons";
import useAxios from "../../../hooks/useAxios";
import Drawer from "../../Drawer";
import Note from "../Note";
import "./index.scss";
interface MoneyProps {
  closeDrawer: () => void;
  bookId?: number;
  value?: TRawRecord | null;
}

const Money = (props: MoneyProps) => {
  const { closeDrawer, bookId, value } = props;

  const [note, setNote] = useState(value ? value.note : "");
  const [type, setType] = useState<TRecordType>(
    value ? value.category.categoryType : "expense"
  );
  const [date, setDate] = useState(
    value ? value.date : dayjs(new Date()).format("YYYY-MM-DD HH:mm")
  );

  const [categoryId, setCategoryId] = useState<number>(value?.category.id || 2);

  const [amount, setAmount] = useState(value ? value.amount : 0);
  const [amountString, setAmountString] = useState(
    value ? "" + value.amount : "0"
  );
  const [showNote, toggleNote] = useState(false);

  const [pickerVisible, setPickerVisible] = useState(false);

  const [categories, setCategories] = useState<
    {
      id: number;
      name: string;
      iconName: string;
      categoryType: TRecordType;
    }[]
  >([]);
  const {
    data: getCategoriesData,
    loading: getCategoriesLoading,
    error: getCategoriesError,
    refetch: getCategoriesRefetch,
  } = useAxios(
    {
      url: "/api/get_categories",
      method: "POST",
      data: {
        user_id: "123456789",
        category_type: type,
      },
    },
    { trigger: false }
  );

  const {
    data: editRecordsData,
    loading: editRecordsLoading,
    error: editRecordsError,
    refetch: editRecordsRefetch,
  } = useAxios(
    {
      url: "/api/edit_record",
      data: {
        id: 0,
        user_id: "123456789",
        date: "",
        category_id: 0,
        amount: 0,
        note: "",
        record_type: "",
      },
      method: "POST",
    },
    { trigger: false }
  );

  const {
    data: addRecordData,
    loading: addRecordLoading,
    error: addRecordError,
    refetch: addRecordRefetch,
  } = useAxios(
    {
      url: "/api/add_record",
      method: "POST",
      data: {
        user_id: "123456789",
        category_type: type,
      },
    },
    { trigger: false }
  );

  useEffect(() => {
    if (getCategoriesData) {
      if (getCategoriesData.data.result) {
        setCategories(getCategoriesData.data.data);
        if (
          getCategoriesData.data.data.filter((c: { id: number }) => {
            return c.id === categoryId;
          }).length === 0
        )
          setCategoryId(getCategoriesData.data.data[0].id);
      }
    }
  }, [categoryId, getCategoriesData]);

  useEffect(() => {
    if (editRecordsData) {
      if (editRecordsData.data.code === 200) {
        Toast.show({
          icon: "success",
          content: "修改成功",
          position: "center",
        });
      } else {
        Dialog.alert({
          content: editRecordsData.data.message,
          closeOnMaskClick: true,
        });
      }
      closeDrawer();
    }
  }, [closeDrawer, editRecordsData]);

  useEffect(() => {
    if (addRecordData) {
      if (addRecordData.data.code === 200) {
        Toast.show({
          icon: "success",
          content: "添加成功",
          position: "center",
        });
      } else {
        Dialog.alert({
          content: addRecordData.data.message,
          closeOnMaskClick: true,
        });
      }
      closeDrawer();
    }
  }, [addRecordData, closeDrawer]);

  useEffect(() => {
    if (editRecordsError) {
      closeDrawer();
    }
  }, [closeDrawer, editRecordsError]);

  useEffect(() => {
    if (addRecordError) {
      closeDrawer();
    }
  }, [addRecordError, closeDrawer]);

  useEffect(() => {
    getCategoriesRefetch({
      url: "/api/get_categories",
      data: {
        user_id: "123456789",
        category_type: type,
      },
    });
  }, [type]);

  const onChangeAmount = (newValue: string) => {
    setAmountString(newValue);
    setAmount(parseFloat(newValue));
  };

  const addNote = () => {
    toggleNote(true);
  };

  const onOK = () => {
    if (amount === 0) {
      Dialog.alert({
        content: "所输金额不得小于0.01",
        closeOnMaskClick: true,
      });
      return;
    }
    if (value) {
      editRecordsRefetch({
        url: "/api/edit_record",
        data: {
          id: value.id,
          user_id: "123456789",
          date: date,
          category_id: categoryId,
          amount: amount,
          note: note,
          record_type: type,
        },
      });
    } else {
      addRecordRefetch({
        url: "/api/add_record",
        data: {
          user_id: "123456789",
          date: date,
          category_id: categoryId,
          amount: amount,
          note: note,
          record_type: type,
          book_id: bookId,
        },
      });
    }
  };

  const closeNote = () => {
    toggleNote(false);
  };

  return (
    <>
      <div
        className="money-pannel"
        style={{ display: showNote ? "none" : "block" }}
      >
        <section className="type-section">
          <Button
            recordType={type === "expense" ? "success" : "none"}
            onClick={() => setType("expense")}
            style={{
              borderRadius: "5px",
              borderWidth: 0,
            }}
          >
            支出
          </Button>
          <Button
            recordType={type === "income" ? "warning" : "none"}
            onClick={() => setType("income")}
            style={{
              borderRadius: "5px",
              borderWidth: 0,
            }}
          >
            收入
          </Button>
          <Button
            recordType={type === "other" ? "normal" : "none"}
            onClick={() => setType("other")}
            style={{
              borderRadius: "5px",
              borderWidth: 0,
            }}
          >
            不计入收支
          </Button>
          <Button
            onClick={() => setPickerVisible(true)}
            style={{
              borderRadius: "5px",
              borderWidth: 0,
              color: "#000",
              float: "right",
            }}
          >
            <div>
              <DatePicker
                defaultValue={new Date(date)}
                visible={pickerVisible}
                onClose={() => {
                  setPickerVisible(false);
                }}
                precision={"minute"}
                onConfirm={(val) => {
                  setDate(dayjs(val).format("YYYY-MM-DD HH:mm"));
                }}
              >
                {(value) =>
                  value ? dayjs(value).format("M月D日") : "请选择日期"
                }
              </DatePicker>
              <DownOutline />
            </div>
          </Button>
        </section>
        <section className="amount-section">
          <span>￥</span>
          <div>{amountString}</div>
        </section>
        <ul className="category-list">
          {categories.map((category) => (
            <li
              className="category-item"
              key={category.id}
              onClick={() => setCategoryId(category.id)}
            >
              <Category
                category={category}
                recordType={categoryId === category.id ? type : "none"}
                size={36}
              />
              <span className="category-text">{category.name}</span>
            </li>
          ))}
        </ul>
        <section className="note-section">
          <article>{note}</article>
          &nbsp;
          <span onClick={addNote}>{note ? "修改" : "添加备注"}</span>
        </section>
        <section className="number-pad-section">
          <NumberPad
            value={amountString}
            recordType={type}
            onChange={onChangeAmount}
            onOK={onOK}
          />
        </section>
      </div>
      {showNote && (
        <Drawer
          closeDrawer={closeNote}
          iconName="icon-yiliaohangyedeICON-"
          title="添加备注"
        >
          <Note
            closeDrawer={closeNote}
            note={note}
            onSubmit={(value) => {
              setNote(value);
              toggleNote(false);
            }}
          />
        </Drawer>
      )}
    </>
  );
};

Money.defaultProps = {
  bookId: 1,
  value: null,
};

export default Money;
