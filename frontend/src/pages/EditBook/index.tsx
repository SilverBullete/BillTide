import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../../components/Icon";
import Drawer from "../../components/Drawer";
import { useState } from "react";
import useAxios from "../../hooks/useAxios";
import { Form, Toast } from "antd-mobile";
import TitleEdit from "../../components/EditBookPage/TitleEdit";
import PartnerEdit from "../../components/EditBookPage/PartnerEdit";
import "./index.scss";
interface BookInfo {
  id: number;
  name: string;
  creator: string;
  partner: string;
  owner: boolean;
}

const DefaultBookInfo = {
  id: 0,
  name: "",
  creator: "",
  partner: "",
  owner: false,
};

const EditBook: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [bookInfo, setBookInfo] = useState<BookInfo>(DefaultBookInfo);
  const [titleEditVisible, setTitleEditVisible] = useState(false);
  const [partnerEditVisible, setPartnerEditVisible] = useState(false);
  const { data: getBookData, refetch: getBookRefetch } = useAxios(
    {
      url: "/api/get_book_by_id",
      method: "POST",
      data: {
        user_id: "123456789",
        book_id: id,
      },
    },
    { trigger: false }
  );
  const { data: deleteBookData, refetch: deleteBookRefetch } = useAxios(
    {
      url: "/api/delete_book_by_id",
      method: "POST",
      data: {
        user_id: "123456789",
        book_id: id,
      },
    },
    { trigger: false }
  );

  useEffect(() => {
    getBookRefetch();
  }, []);

  useEffect(() => {
    if (getBookData) {
      if (getBookData.data.result) {
        setBookInfo(getBookData.data.data);
      } else {
        setBookInfo(DefaultBookInfo);
      }
    }
  }, [getBookData]);

  useEffect(() => {
    if (deleteBookData) {
      if (deleteBookData.data.code === 200) {
        navigate("/ledger");
        Toast.show({
          icon: "success",
          content: "删除成功",
        });
      }
    }
  }, [deleteBookData]);

  const onDelete = () => {
    deleteBookRefetch({
      url: "/api/delete_book_by_id",
      data: {
        user_id: "123456789",
        book_id: id,
      },
    });
  };

  const closeTitleEdit = () => {
    setTitleEditVisible(false);
    getBookRefetch();
  };
  const closePartnerEdit = () => {
    setPartnerEditVisible(false);
    getBookRefetch();
  };

  return (
    <div className="edit-book">
      <header className="header">
        <Icon name="icon-left" onClick={() => navigate(-1)} size={24} />
        <div className="title">账本编辑</div>
      </header>
      <section className="main">
        <Form>
          <Form.Header>&nbsp;</Form.Header>
          <Form.Item
            label="账本名称"
            trigger="onConfirm"
            onClick={() => {
              setTitleEditVisible(true);
            }}
          >
            {bookInfo.name}
          </Form.Item>
          {bookInfo.owner && (
            <Form.Item
              label="账本成员"
              trigger="onConfirm"
              onClick={() => {
                setPartnerEditVisible(true);
              }}
            >
              {bookInfo.partner ? bookInfo.partner : "暂无账本成员"}
            </Form.Item>
          )}
        </Form>
      </section>
      <div className="delete" onClick={onDelete}>
        删除账本
      </div>

      {titleEditVisible && (
        <Drawer closeDrawer={closeTitleEdit}>
          <TitleEdit closeDrawer={closeTitleEdit} bookTitle={bookInfo.name} />
        </Drawer>
      )}
      {partnerEditVisible && (
        <Drawer closeDrawer={closePartnerEdit}>
          <PartnerEdit
            closeDrawer={closePartnerEdit}
            partnerId={bookInfo.partner}
          />
        </Drawer>
      )}
    </div>
  );
};

export default EditBook;
