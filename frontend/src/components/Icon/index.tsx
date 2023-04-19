import { SVGAttributes } from "react";
import theme from "../../theme";

type TProps = SVGAttributes<SVGElement> & {
  name: string;
  color?: string;
  size?: number;
};

const Icon = (props: TProps) => {
  const { name, color, size, ...attributes } = props;

  return (
    <svg
      height={size}
      width={size}
      fill={color}
      color={color}
      className="icon"
      aria-hidden="true"
      {...attributes}
    >
      <use xlinkHref={`#${name}`} />
    </svg>
  );
};

Icon.defaultProps = {
  size: 16,
  color: theme.$normalText,
};

export default Icon;
