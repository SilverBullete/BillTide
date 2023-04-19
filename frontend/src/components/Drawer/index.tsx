import Icon from "../Icon";
import "./index.scss";

interface DrawerProps {
  closeDrawer: () => void;
  children: string | JSX.Element | JSX.Element[];
  title?: string;
  iconName?: string;
}

const Drawer = (props: DrawerProps) => {
  const { title, closeDrawer, iconName } = props;

  return (
    <div className="shadow" onClick={closeDrawer}>
      <div className="main" onClick={(e) => e.stopPropagation()}>
        <header className="header">
          <Icon
            onClick={closeDrawer}
            name={iconName !== undefined ? iconName : "icon-close"}
            size={18}
          />
          <span>{title}</span>
          <Icon name="icon-close" color="transparent" />
        </header>

        {props.children}
      </div>
    </div>
  );
};

Drawer.defaultProps = {
  title: "",
  iconName: "icon-close",
};

export default Drawer;
