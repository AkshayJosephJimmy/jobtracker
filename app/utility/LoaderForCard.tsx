import "./Loader.css";

type LoaderProps = {
  text?: string;
};

export default function Loader({ text = "Loading" }: LoaderProps) {
  return (
    <div className="loader-wrap">
      <div className="loader" role="status" aria-label="Loading" />
      <span>{text}</span>
    </div>
  );
}
