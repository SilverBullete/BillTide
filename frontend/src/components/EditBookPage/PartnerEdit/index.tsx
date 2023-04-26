import * as React from "react";
import { useEffect, useState } from "react";
import { Input, Button, Toast, Dialog } from "antd-mobile";
import useAxios from "../../../hooks/useAxios";
import { useParams } from "react-router-dom";

interface PartnerEditProps {
  closeDrawer: () => void;
  partnerId: string;
}

const PartnerEdit = (props: PartnerEditProps) => {
  const { id } = useParams();
  const { closeDrawer, partnerId } = props;
  const [value, setValue] = useState(partnerId);
  const maxWords = 11;
  const { data: checkUserExistData, refetch: checkUserExistRefetch } = useAxios(
    { url: "/api/check_user_exist", method: "POST" },
    { trigger: false }
  );
  const { data: updateData, refetch: updateRefetch } = useAxios(
    { url: "/api/update_book_partner", method: "POST" },
    { trigger: false }
  );

  const submit = () => {
    checkUserExistRefetch({
      url: "/api/check_user_exist",
      data: {
        user_id: value,
      },
    });
  };

  useEffect(() => {
    if (checkUserExistData) {
      if (
        checkUserExistData.data.code === 200 &&
        checkUserExistData.data.data
      ) {
        updateRefetch({
          url: "/api/update_book_partner",
          data: {
            user_id: "123456789",
            book_id: id,
            partner: value,
          },
        });
      } else if (
        checkUserExistData.data.code === 200 &&
        !checkUserExistData.data.data
      ) {
        Dialog.alert({
          content: "用户手机号不存在",
          closeOnMaskClick: true,
        });
      }
    }
  }, [checkUserExistData]);
  useEffect(() => {
    if (updateData) {
      if (updateData.data.code === 200) {
        Toast.show({
          icon: "success",
          content: "添加成功",
          position: "center",
        });
      } else {
        Dialog.alert({
          content: "添加失败",
          closeOnMaskClick: true,
        });
      }
    }
  }, [updateData]);
  return (
    <div className="title-pannel">
      <div className="title-input">
        <Input
          placeholder="请输入账本成员手机号"
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

export default PartnerEdit;
