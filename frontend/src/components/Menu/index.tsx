import Icon from "../Icon";
import { Link, useLocation } from "react-router-dom";
import theme from "../../theme";
import "./index.scss";

const Menu = () => {
  const { pathname } = useLocation();

  return (
    <div className="clearfix menu">
      <Link
        to="/ledger"
        className={`menu-item${pathname === "/ledger" ? " selected" : ""}`}
      >
        {pathname === "/ledger" ? (
          <Icon name="icon-book" size={24} color={theme.$success} />
        ) : (
          <Icon name="icon-book" size={24} />
        )}
        <div>账本</div>
      </Link>
      <Link
        to="/book/1"
        className={`menu-item${
          pathname.search(/^\/book\/[0-9]+$/) === 0 ? " selected" : ""
        }`}
      >
        {pathname.search(/^\/book\/[0-9]+$/) === 0 ? (
          <Icon name="icon-solid-order" size={24} color={theme.$success} />
        ) : (
          <Icon name="icon-order" size={24} />
        )}
        <div>明细</div>
      </Link>
      <Link
        to="/analysis"
        className={`menu-item${pathname === "/analysis" ? " selected" : ""}`}
      >
        {pathname === "/analysis" ? (
          <Icon name="icon-solid-chart" size={24} color={theme.$success} />
        ) : (
          <Icon name="icon-chart" size={24} />
        )}
        <div>统计</div>
      </Link>
      <Link
        to="/settings"
        className={`menu-item${pathname === "/settings" ? " selected" : ""}`}
      >
        {pathname === "/settings" ? (
          <Icon name="icon-solid-settings" size={24} color={theme.$success} />
        ) : (
          <Icon name="icon-settings" size={24} />
        )}
        <div>设置</div>
      </Link>
    </div>
  );
};

export default Menu;
