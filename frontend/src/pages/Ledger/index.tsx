import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Icon from "../../components/Icon";
import Divider from "../../components/Divider";
import Drawer from "../../components/Drawer";
import Book from "../../components/LedgerPage/Book";
import useAxios from "../../hooks/useAxios";
import { Link } from "react-router-dom";
import "./index.scss";

interface BookProps {
  id: number;
  name: string;
  cover: number;
  total_income: number;
  total_spend: number;
  creator: number;
  partner: number | null;
}

const Ledger = () => {
  const [showAddBook, setShowAddBook] = useState(false);
  const [books, setBooks] = useState<BookProps[]>([]);
  const { data, error, loading, refetch } = useAxios(
    {
      url: "/api/get_books",
      method: "POST",
      data: {
        user_id: "123456789",
      },
    },
    { trigger: false }
  );

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (!data) return;
    if (data.data.code === 200) {
      setBooks(data.data.data);
    }
  }, [data]);

  const closeShowAddBook = () => {
    setShowAddBook(false);
  };

  const onAddRecord = () => {
    refetch();
    setShowAddBook(false);
  };

  return (
    <Layout className="ledger">
      <header className="header">
        <p className="title">我的记账本</p>
      </header>
      <div className="book-list">
        {loading ? (
          <></>
        ) : (
          books.map((book: BookProps) => {
            return (
              <Link className="book-info" key={book.id} to={`/book/${book.id}`}>
                <div className="book-info-left">
                  <img
                    src={require(`../../assets/img/img${book.cover}.png`)}
                    alt=""
                  />
                </div>
                <div className="book-info-right">
                  <p>{book.name}</p>
                  <div className="book-info-summary">
                    <div>
                      <span>总支出</span>
                      <span>￥{book.total_spend.toFixed(2)}</span>
                    </div>
                    <Divider gap={32}></Divider>
                    <div>
                      <span>总收入</span>
                      <span>￥{book.total_income.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="book-info-foot">
                    {book.creator === 1 ? (
                      <Icon name="boy-two" size={18}></Icon>
                    ) : (
                      <Icon name="girl-two" size={18}></Icon>
                    )}
                    {book.partner === null ? (
                      <></>
                    ) : book.partner === 1 ? (
                      <Icon name="boy-two" size={18}></Icon>
                    ) : (
                      <Icon name="girl-two" size={18}></Icon>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        )}

        <p className="book-list-foot">没有更多账本了</p>
      </div>
      <button className="add-book-button" onClick={() => setShowAddBook(true)}>
        添加账本
      </button>
      {showAddBook ? (
        <Drawer closeDrawer={closeShowAddBook} title={"新增账本"}>
          <Book closeDrawer={closeShowAddBook} onSubmit={onAddRecord} />
        </Drawer>
      ) : (
        <></>
      )}
    </Layout>
  );
};

export default Ledger;
