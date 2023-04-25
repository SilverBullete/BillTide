import theme from "../../../theme";
import "./index.scss";

type TProps = {
  value: number;
  height?: number;
  width?: number;
  color?: string;
};

const ProgressBar: React.FC<TProps> = (props) => {
  const { value, width, height, color } = props;

  return (
    <span className="progress-bar">
      <div
        className="bar"
        style={{ height: height + "px", width: width + "px" }}
      >
        <div
          className="progress"
          style={{ width: width + "px", background: color }}
        />
      </div>
    </span>
  );
};

ProgressBar.defaultProps = {
  value: 0.0,
  color: theme.$success,
  width: 200,
  height: 8,
};

export default ProgressBar;
