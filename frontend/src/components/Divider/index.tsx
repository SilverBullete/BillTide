import "./index.scss";

type TDirection = "vertical" | "horizontal";

interface DividerProps {
  direction?: TDirection;
  gap?: number;
  color?: string;
}

const Divider = (props: DividerProps) => {
  const { direction } = props;

  return direction === "horizontal" ? (
    <div
      className="divider"
      style={{ margin: `${props.gap}px 0`, borderColor: props.color }}
    ></div>
  ) : (
    <span
      className="divider"
      style={{ margin: `0 ${props.gap}px`, borderColor: props.color }}
    ></span>
  );
};

Divider.defaultProps = {
  direction: "vertical",
  gap: 16,
  color: "#eee",
};

export default Divider;
