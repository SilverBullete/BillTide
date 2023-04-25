import * as React from "react";
import { TRecordType } from "../../../type";
import Icon from "../../Icon";
import "./index.scss";
import theme from "../../../theme";

interface NumberPadProps {
  value: string;
  recordType: TRecordType;
  onChange: (newValue: string) => void;
  onOK: () => void;
}

const updateAmount = (prevValue: string, text: string) => {
  const MAX_DECIMAL_LENGTH = 2;

  // 非法情况
  if (!/[\d.]/.test(text)) return prevValue;

  if (prevValue.includes(".")) {
    // 如果 text 是 .
    if (text === ".") return prevValue;

    // 如果是数字
    if (!isNaN(parseFloat(text))) {
      // 判断是否超出
      const decimal = prevValue.split(".")[1];

      return decimal.length >= MAX_DECIMAL_LENGTH
        ? prevValue
        : prevValue + text;
    }

    return prevValue;
  }

  if (prevValue === "0") {
    return text === "." ? prevValue + text : text;
  }

  const newValue = prevValue + text;

  return newValue;
};

const NumberPad = (props: NumberPadProps) => {
  const { value, onOK, onChange, recordType } = props;

  const onDel = () => {
    if (value === "0") return;

    if (value.length === 1) return onChange("0");

    onChange(value.slice(0, -1));
  };

  const onClickPad = (e: React.MouseEvent<HTMLDivElement>) => {
    const text = (e.target as HTMLButtonElement).textContent;
    // Del
    if (text === "") return onDel();

    // null
    if (!text) return;

    // OK
    if (text === "确定") return onOK();

    // 其他
    const newValue = updateAmount(value, text);
    onChange(newValue);
  };

  return (
    <div className="clearfix number-pad" onClick={onClickPad}>
      <button>1</button>
      <button>2</button>
      <button>3</button>
      <button>
        <Icon name="icon-delete" color="#000" size={21}></Icon>
      </button>

      <button>4</button>
      <button>5</button>
      <button>6</button>
      <button
        className="OK"
        style={{
          opacity: value === "0" ? 0.6 : 1,
          background:
            recordType === "expense"
              ? theme.$success
              : recordType === "income"
              ? theme.$warning
              : theme.$other,
        }}
      >
        确定
      </button>

      <button>7</button>
      <button>8</button>
      <button>9</button>

      <button className="zero">0</button>
      <button>.</button>
    </div>
  );
};

export default NumberPad;
