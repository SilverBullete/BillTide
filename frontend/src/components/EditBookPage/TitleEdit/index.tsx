import { useEffect, useState } from "react";
import { Input, Button } from "antd-mobile";
import useAxios from "../../../hooks/useAxios";
import { useParams } from "react-router-dom";
import "./index.scss";

interface TitleEditProps {
  closeDrawer: () => void;
  bookTitle: string;
}

const TitleEdit = (props: TitleEditProps) => {
  const { id } = useParams();
  const { closeDrawer, bookTitle } = props;
  const [value, setValue] = useState(bookTitle);
  const maxWords = 12;
  const { data, refetch } = useAxios({ method: "POST" }, { trigger: false });

  const submit = () => {
    refetch({
      url: "/api/update_book_title",
      data: {
        user_id: "123456789",
        book_id: id,
        title: value,
      },
    });
    closeDrawer();
  };

  return (
    <div className="title-pannel">
      <div className="title-input">
        <Input
          placeholder="请输入账本名称"
          value={value}
          onChange={(val) => {
            setValue(val.substring(0, maxWords));
          }}
        />
      </div>
      <span className="word-count">
        {value.length}/{maxWords}
      </span>
      <div className="submit-button">
        <Button
          color="primary"
          size="middle"
          disabled={value.length === 0}
          onClick={submit}
        >
          确定
        </Button>
      </div>
    </div>
  );
};

export default TitleEdit;
