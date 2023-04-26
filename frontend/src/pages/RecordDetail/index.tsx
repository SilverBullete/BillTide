import * as React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../../components/Icon";
import { TRawRecord } from "../../type";
import RecordDetails from "../../components/RecordDetailPage/RecordDetails";
import Drawer from "../../components/Drawer";
import Money from "../../components/SummaryPage/Money";
import { useState } from "react";
import useAxios from "../../hooks/useAxios";
import { Toast } from "antd-mobile";
import "./index.scss";

const Details = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [showMoney, toggleMoney] = useState(false);
  const [rawRecord, setRawRecord] = useState<TRawRecord | null>(null);
  const {
    data: getRecordData,
    error: getRecordError,
    refetch: getRecordRefetch,
  } = useAxios(
    {
      url: "/api/get_record_by_id",
      method: "POST",
      data: {
        user_id: "123456789",
        record_id: id,
      },
    },
    { trigger: false }
  );
  const {
    data: deleteRecordData,
    error: deleteRecordError,
    refetch: deleteRecordRefetch,
  } = useAxios(
    {
      url: "/api/delete_record_by_id",
      method: "POST",
      data: {
        user_id: "123456789",
        record_id: id,
      },
    },
    { trigger: false }
  );

  useEffect(() => {
    getRecordRefetch();
  }, []);

  useEffect(() => {
    if (getRecordData) {
      if (getRecordData.data.result) {
        setRawRecord(getRecordData.data.data);
      } else {
        setRawRecord(null);
      }
    }
  }, [getRecordData]);

  useEffect(() => {
    if (deleteRecordData) {
      if (deleteRecordData.data.result) {
        navigate(-1);
        Toast.show({
          icon: "success",
          content: "删除成功",
        });
      }
    }
  }, [deleteRecordData]);

  const onDelete = (id: number) => {
    deleteRecordRefetch({
      url: "/delete_record_by_id",
      data: {
        user_id: "123456789",
        record_id: id,
      },
    });
  };

  const closeMoney = () => {
    getRecordRefetch({
      url: "/get_record_by_id",
      data: {
        user_id: "123456789",
        record_id: id,
      },
    });
    toggleMoney(false);
  };

  return (
    <div className="detail">
      <header className="header">
        <Icon name="icon-left" onClick={() => navigate(-1)} size={24} />
      </header>

      <section className="main">
        {rawRecord ? (
          <RecordDetails
            onDelete={onDelete}
            onEdit={() => toggleMoney(true)}
            rawRecord={rawRecord}
          />
        ) : (
          <></>
        )}
      </section>

      {/*记账*/}
      {showMoney && (
        <Drawer closeDrawer={closeMoney}>
          <Money closeDrawer={closeMoney} value={rawRecord} />
        </Drawer>
      )}
    </div>
  );
};

export default Details;
