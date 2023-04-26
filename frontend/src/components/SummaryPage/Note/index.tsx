import { useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import { Input, Tag, Button } from "antd-mobile";
import "./index.scss";

interface NoteProps {
  closeDrawer: () => void;
  onSubmit: (value: any) => void;
  note: string;
}

const Note = (props: NoteProps) => {
  const [value, setValue] = useState(props.note);
  const [tags, setTags] = useState<{ id: number; content: string }[]>([]);
  const maxWords = 30;
  const { data, refetch, error, loading } = useAxios(
    {
      url: "/api/get_notes",
      method: "POST",
      data: {
        user_id: "123456789",
      },
    },
    { trigger: false }
  );
  useEffect(() => {
    if (data) {
      if (data.result) {
        setTags(data.data);
      } else {
        setTags([]);
      }
    }
  }, [loading, data]);

  const submit = () => {
    refetch({
      url: "/api/add_note",
      data: {
        user_id: "123456789",
        content: value,
      },
    });
    props.onSubmit(value);
  };

  return (
    <div className="note-pannel">
      <div className="note-input">
        <Input
          placeholder="请输入备注内容"
          value={value}
          onChange={(val) => {
            setValue(val.substring(0, maxWords));
          }}
        />
      </div>
      <span className="word-count">
        {value.length}/{maxWords}
      </span>
      <div className="tags">
        {tags.map((tag) => {
          return (
            <Tag
              key={tag.id}
              round
              color="#f7f7f7"
              onClick={() => {
                setValue(tag.content);
              }}
            >
              {tag.content}
            </Tag>
          );
        })}
      </div>
      <div className="submit-button">
        <Button
          color="primary"
          size="middle"
          disabled={value.length === 0}
          onClick={() => submit()}
        >
          确定
        </Button>
      </div>
    </div>
  );
};

export default Note;
