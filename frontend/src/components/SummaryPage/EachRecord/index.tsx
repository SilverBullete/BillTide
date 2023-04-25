import * as React from "react";
import Category from "../Category";
import Divider from "../../Divider";
import { TRawRecord } from "../../../type";
import { Link } from "react-router-dom";
import "./index.scss";

type TProps = {
  record: TRawRecord;
};

const EachRecord: React.FC<TProps> = (props) => {
  const { id, date, amount, category, note, recordType } = props.record;

  return (
    <li>
      <Link className="each-record" to={`/record/${id}`}>
        <Category category={category!} recordType={recordType} />
        <div className="record-content">
          <div>{category && category.name}</div>
          <div className="record-content-details">
            <span>{date.split(" ")[1]}</span>
            <Divider gap={8} />
            <span>{note}</span>
          </div>
        </div>
        <div className="record-content-amount">
          {recordType === "income" ? "+" : recordType === "expense" ? "-" : ""}
          {amount.toFixed(2)}
        </div>
      </Link>
    </li>
  );
};

export default EachRecord;
