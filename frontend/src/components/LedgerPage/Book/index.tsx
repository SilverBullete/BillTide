import { useEffect, useState } from "react";
import Icon from "../../Icon";
import useAxios from "../../../hooks/useAxios";
import { Dialog, Toast } from "antd-mobile";
import "./index.scss";

interface BookProps {
  closeDrawer: () => void;
  onSubmit: () => void;
}

const Book = (props: BookProps) => {
  const { closeDrawer, onSubmit } = props;
  const touchData: { [key: string]: any } = { touching: false, trace: [] };
  const [select, setSelect] = useState(1);
  const imgs = [1, 2, 3, 4, 5];
  const {
    data: checkUserExistData,
    error: checkUserExistError,
    refetch: checkUserExistRefetch,
  } = useAxios(
    {
      method: "POST",
      url: "/api/check_user_exist",
      data: {
        user_id: "123456789",
      },
    },
    { trigger: false }
  );
  const {
    data: addBookData,
    error: addBookError,
    refetch: addBookRefetch,
  } = useAxios(
    {
      method: "POST",
      url: "/api/add_book",
      data: {
        user_id: "123456789",
        cover: select,
        name: "",
        partner: "",
      },
    },
    { trigger: false }
  );

  useEffect(() => {
    if (!checkUserExistData) return;
    if (checkUserExistData.data.code === 200) {
      if (checkUserExistData.data.data) {
        let name = (document.getElementById("input-name") as HTMLInputElement)
          .value;
        let partner = (
          document.getElementById("input-partner") as HTMLInputElement
        ).value;
        addBookRefetch({
          url: "/api/add_book",
          data: {
            user_id: "123456789",
            cover: select,
            name: name,
            partner: partner,
          },
        });
      } else {
        Dialog.alert({
          content: "用户手机号不存在",
          closeOnMaskClick: true,
        });
      }
    } else {
      Dialog.alert({
        content: "服务器错误，请联系管理员",
        closeOnMaskClick: true,
      });
    }
  }, [addBookRefetch, checkUserExistData, select]);

  useEffect(() => {
    if (addBookError || checkUserExistError) {
      Dialog.alert({
        content: "服务器错误，请联系管理员",
        closeOnMaskClick: true,
      });
    }
  }, [addBookError, checkUserExistError]);

  useEffect(() => {
    if (!addBookData) return;
    if (addBookData.data.code === 200) {
      Toast.show({
        icon: "success",
        content: "添加成功",
        position: "center",
      });
      onSubmit();
    } else {
      Dialog.alert({
        content: addBookData.message,
        closeOnMaskClick: true,
      });
    }
  }, [addBookData, onSubmit]);

  const onTouchStart = (evt: any) => {
    if (evt.touches.length !== 1) {
      touchData.touching = false;
      touchData.trace = [];
      return;
    }
    touchData.touching = true;
    touchData.trace = [
      { x: evt.touches[0].screenX, y: evt.touches[0].screenY },
    ];
  };
  const onTouchMove = (evt: any) => {
    if (!touchData.touching) return;
    touchData.trace.push({
      x: evt.touches[0].screenX,
      y: evt.touches[0].screenY,
    });
  };
  const onTouchEnd = () => {
    if (!touchData.touching) return;
    let trace = touchData.trace;
    touchData.touching = false;
    touchData.trace = [];
    handleTouch(trace);
  };
  const handleTouch = (trace: any) => {
    let start = trace[0];
    let end = trace[trace.length - 1];
    let modules = Array.from(document.getElementsByClassName("module"));
    if (end.x - start.x > 50) {
      console.log(select);

      let newSelect = select - 1;
      if (newSelect > 0) {
        (modules[newSelect] as HTMLElement).style.animation =
          "enterFromLeftToCenter 0.25s linear";
        (modules[select] as HTMLElement).style.animation =
          "quitFromCenterToRight 0.25s linear";
        if (select + 1 <= imgs[imgs.length - 1]) {
          (modules[select + 1] as HTMLElement).style.animation =
            "quitFromRightToInvisible 0.25s linear";
        }
        if (newSelect - 1 > 0) {
          (modules[newSelect - 1] as HTMLElement).style.animation =
            "enterFromInvisibleToLeft 0.25s linear";
        }
      }
      setSelect(Math.max(1, select - 1));
    } else if (start.x - end.x > 50) {
      let newSelect = select + 1;
      if (newSelect <= imgs[imgs.length - 1]) {
        (modules[newSelect] as HTMLElement).style.animation =
          "enterFromRightToCenter 0.25s linear";
        (modules[select] as HTMLElement).style.animation =
          "quitFromCenterToLeft 0.25s linear";
        if (newSelect + 1 <= imgs[imgs.length - 1]) {
          (modules[newSelect + 1] as HTMLElement).style.animation =
            "enterFromInvisibleToRight 0.25s linear";
        }
        if (select - 1 > 0) {
          (modules[select - 1] as HTMLElement).style.animation =
            "quitFromLeftToInvisible 0.25s linear";
        }
      }
      setSelect(Math.min(select + 1, imgs[imgs.length - 1]));
    }
  };
  const clickHandle = () => {
    let name = (document.getElementById("input-name") as HTMLInputElement)
      .value;
    let partner = (document.getElementById("input-partner") as HTMLInputElement)
      .value;
    if (partner !== "") {
      checkUserExistRefetch({
        url: "/api/check_user_exist",
        data: {
          user_id: partner,
        },
      });
    } else {
      addBookRefetch({
        url: "/api/add_book",
        data: {
          user_id: "123456789",
          cover: select,
          name: name,
          partner: partner,
        },
      });
    }
  };

  return (
    <div className="book">
      <p className="title">请选择账本封面</p>
      <div
        className="module"
        onTouchEnd={onTouchEnd}
        onTouchMove={onTouchMove}
        onTouchStart={onTouchStart}
      >
        {imgs.map((idx: number) => {
          return (
            <div
              className={`item${select === idx ? " selected" : ""}`}
              key={idx}
              style={{
                // left: `calc(${(idx - select + 1) * 50}vw - ${
                //   select === idx ? 116.8 : 73
                // }px)`,
                left: `calc(${(idx - select + 1) * 50}vw)`,
              }}
            >
              <img
                className="module"
                src={require(`../../../assets/img/img${idx}.png`)}
                alt={`账本封面${idx}`}
              />
              {idx === select && (
                <div className="checked" id="check">
                  <Icon name="icon-check" color="#fff" size={15}></Icon>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <form id="add-form">
        <div className="form-input">
          <label>账本名称</label>
          <input
            id="input-name"
            name="input-name"
            placeholder="给账本起个名字吧"
            type="text"
          />
        </div>
        <div className="form-input">
          <label>账本成员</label>
          <input
            id="input-partner"
            name="input-partner"
            placeholder="请输入账本成员手机号，可不填"
            type="text"
          />
        </div>
      </form>
      <button className="add-book-button" onClick={clickHandle}>
        新建账本
      </button>
    </div>
  );
};

export default Book;
