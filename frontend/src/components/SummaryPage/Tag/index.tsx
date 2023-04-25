import "./index.scss";

interface TagProps {
  children: React.ReactNode;
}

const Tag = (props: TagProps) => {
  return <span className="tag">{props.children}</span>;
};

export default Tag;
