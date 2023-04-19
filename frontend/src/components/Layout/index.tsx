import Menu from "../Menu";
import "./index.scss";

interface LayoutProps {
  children: string | JSX.Element | JSX.Element[];
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className={`layout${className ? " " + className : ""}`}>
      {children}
      <Menu />
    </div>
  );
};

export default Layout;
