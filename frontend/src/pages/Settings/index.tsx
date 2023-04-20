import * as React from "react";
import { useState } from "react";
import Layout from "../../components/Layout";
import Icon from "../../components/Icon";
import Drawer from "../../components/Drawer";
import "./index.scss";

const Settings: React.FC = () => {
  const [showQrCode, toggleQrcode] = useState(false);
  const [showContact, toggleContact] = useState(false);

  const github = "https://github.com/Haixiang6123/weixin-cash";

  return (
    <Layout className="settings">
      <div className="main">
        <div
          className="item"
          style={{ marginBottom: 8 }}
          onClick={() => toggleQrcode(true)}
        >
          <Icon size={22} name="icon-qrcode" color="#ff9800" />
          <span>把记账本推荐给朋友</span>
        </div>

        <div className="item" onClick={() => window.open(github, "_blank")}>
          <Icon size={22} name="icon-github" color="black" />
          <span style={{ borderBottom: "1px solid #eee" }}>
            点个Star支持一下
          </span>
        </div>

        <div className="item" onClick={() => toggleContact(true)}>
          <Icon size={22} name="icon-message" color="#03a9f4" />
          <span>联系我</span>
        </div>
      </div>

      {/* {showQrCode ? (
        <Drawer closeDrawer={() => toggleQrcode(false)}>
          <div className="qr-code">
            <p>扫一下面二维码以分享该记账本</p>
            <img src={require("../assets/img/qrcode.png")} alt="网站二维码" />
          </div>
        </Drawer>
      ) : (
        <></>
      )} */}

      {showContact ? (
        <Drawer closeDrawer={() => toggleContact(false)}>
          <div className="contact">
            <span style={{ marginRight: 8 }}>我的邮箱：</span>
            <a
              href="mailto:silver_bullete@163.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              silver_bullete@163.com
            </a>
          </div>
        </Drawer>
      ) : (
        <></>
      )}
    </Layout>
  );
};

export default Settings;
