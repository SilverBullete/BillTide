import Category from "../../SummaryPage/Category";
import dayjs from "dayjs";
import { TRawRecord } from "../../../type";
import Divider from "../../Divider";
import Icon from "../../Icon";
import { Dialog } from "antd-mobile";
import "./index.scss";

interface RecordDetailsProps {
  rawRecord: TRawRecord | null;
  onDelete: (id: number) => void;
  onEdit: () => void;
}

const RecordDetails = (props: RecordDetailsProps) => {
  const { rawRecord, onDelete, onEdit } = props;
  if (rawRecord === null) {
    return <div>页面出错</div>;
  }
  const { id, amount, recordType, date, note, category } = rawRecord;

  const deleteRecord = () => {
    Dialog.show({
      content: "删除后无法恢复，是否删除？",
      closeOnAction: true,
      actions: [
        [
          {
            key: "cancel",
            text: "取消",
          },
          {
            key: "delete",
            text: "删除",
            danger: true,
            onClick: () => {
              onDelete(id);
            },
          },
        ],
      ],
    });
  };

  return (
    <div className="record-details">
      <section className="category">
        <Category category={category} recordType={recordType} size={14} />
        <span style={{ marginLeft: 8 }}>{category.name}</span>
      </section>
      <h3>
        {recordType === "expense" ? "-" : "+"}
        {amount.toFixed(2)}
      </h3>
      <table className="details-table">
        <tbody>
          <tr>
            <td>收支时间</td>
            <td>{dayjs(date).format("YYYY年M月D日 HH:mm")}</td>
          </tr>
          <tr>
            <td>备注</td>
            <td>{note}</td>
          </tr>
        </tbody>
      </table>
      <section className="action-section">
        <button className="delete" onClick={deleteRecord}>
          <Icon name="icon-trash" />
          <span style={{ marginLeft: 8 }}>删除</span>
        </button>
        <Divider gap={0} />
        <button onClick={onEdit}>
          <Icon name="icon-edit" />
          <span style={{ marginLeft: 8 }}>编辑</span>
        </button>
      </section>
    </div>
  );
};

export default RecordDetails;
