import { TRecordType } from "../../../type";
import theme from "../../../theme";
import "./index.scss";

interface CategoryFilterProps {
  categories: { id: number; name: string; categoryType: string }[];
  recordType: TRecordType;
  value: number;
  closeDrawer: () => void;
  onSubmit: (id: number, type: TRecordType) => void;
}

const BACKGROUND = {
  expense: theme.$success,
  income: theme.$warning,
  other: "#7588A9",
};

const CategoryFilter = (props: CategoryFilterProps) => {
  const { categories, value, recordType, closeDrawer, onSubmit } = props;

  const submit = (id: number, type: TRecordType) => {
    onSubmit(id, type);
    closeDrawer();
  };

  return (
    <section className="category-filter">
      <div
        className="category-item"
        style={{
          background: value === 0 ? BACKGROUND["expense"] : "white",
          color: value === 0 ? "white" : theme.$normalText,
        }}
        onClick={() => submit(0, "expense")}
      >
        全部类型
      </div>

      <p className="tag">支出</p>
      <section className="filter-section">
        {categories
          .filter((value) => {
            return value.categoryType === "expense";
          })
          .map((c) => (
            <div
              className="category-item"
              style={{
                background:
                  recordType === "expense" && value === c.id
                    ? BACKGROUND["expense"]
                    : "white",
                color:
                  recordType === "expense" && value === c.id
                    ? "white"
                    : theme.$normalText,
              }}
              key={c.id}
              onClick={() => submit(c.id, "expense")}
            >
              {c.name}
            </div>
          ))}
      </section>

      <p className="tag">收入</p>
      <section className="filter-section">
        {categories
          .filter((value) => {
            return value.categoryType === "income";
          })
          .map((c) => (
            <div
              className="category-item"
              style={{
                background:
                  recordType === "income" && value === c.id
                    ? BACKGROUND["income"]
                    : "white",
                color:
                  recordType === "income" && value === c.id
                    ? "white"
                    : theme.$normalText,
              }}
              key={c.id}
              onClick={() => submit(c.id, "income")}
            >
              {c.name}
            </div>
          ))}
      </section>
      <p className="tag">不计入收支</p>
      <section className="filter-section">
        {categories
          .filter((value) => {
            return value.categoryType === "other";
          })
          .map((c) => (
            <div
              className="category-item"
              style={{
                background:
                  recordType === "other" && value === c.id
                    ? BACKGROUND["other"]
                    : "white",
                color:
                  recordType === "other" && value === c.id
                    ? "white"
                    : theme.$normalText,
              }}
              key={c.id}
              onClick={() => submit(c.id, "other")}
            >
              {c.name}
            </div>
          ))}
      </section>
    </section>
  );
};

export default CategoryFilter;
