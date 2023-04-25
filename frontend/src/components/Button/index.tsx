import * as React from "react";
import theme from "../../theme";
import "./index.scss";

interface ButtonProps {
  recordType?: "success" | "warning" | "none" | "normal";
  size?: "small" | "normal";
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const BUTTON_COLOR = {
  success: {
    background: "rgba(64,180,117,0.2)",
    borderColor: "rgba(64,180,117,0.2)",
    color: "rgb(64,180,117)",
  },
  warning: {
    background: "rgba(240,183,57,0.2)",
    borderColor: "rgba(240,183,57,0.2)",
    color: "rgb(240,183,57)",
  },
  normal: {
    background: "rgba(119,135,169,0.2)",
    borderColor: "rgba(119,135,169,0.2)",
    color: "rgb(119,135,169)",
  },
  none: {
    background: "#F1F1F1",
    borderColor: "#F1F1F1",
    color: theme.$subText,
  },
};

const BUTTON_SIZE = {
  small: {
    padding: "2px 8px",
    fontSize: theme.$smallTextSize,
  },
  normal: {
    padding: "4px 12px",
  },
};

const Button = (props: ButtonProps) => {
  const { recordType, size, style, onClick } = props;

  return (
    <button
      className="button"
      style={{
        ...BUTTON_COLOR[recordType!],
        ...BUTTON_SIZE[size!],
        ...style,
      }}
      onClick={onClick}
    >
      {props.children}
    </button>
  );
};

Button.defaultProps = {
  recordType: "none",
  size: "normal",
};

export default Button;
