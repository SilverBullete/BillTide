import Menu from "../Menu";
import "./index.scss";

interface LayoutProps {
  children: React.ReactNode;
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
