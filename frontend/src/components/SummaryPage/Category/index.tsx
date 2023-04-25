import Icon from "../../Icon";
import { TRecordType } from "../../../type";
import { CATEGORY_COLOR } from "../../../theme/Category";
import "./index.scss";

export type TCategory = {
  id: number;
  name: string;
  iconName: string;
};

interface CategoryProps {
  category: TCategory;
  recordType: TRecordType | "none";
  size?: number;
}

const Category = (props: CategoryProps) => {
  const { category, recordType, size } = props;

  const color = CATEGORY_COLOR[recordType];

  return (
    <span className="category" style={{ background: color.background }}>
      <div></div>
      <Icon name={category.iconName} size={size} color={color.fill} />
    </span>
  );
};

Category.defaultProps = {
  size: 24,
};

export default Category;
