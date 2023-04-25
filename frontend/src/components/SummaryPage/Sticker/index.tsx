import "./index.scss";

interface StickerProps {
  children: React.ReactNode;
  onClick: () => void;
}

const Sticker = (props: StickerProps) => {
  const { onClick } = props;

  return (
    <div className="sticker" onClick={onClick}>
      {props.children}
    </div>
  );
};

export default Sticker;
