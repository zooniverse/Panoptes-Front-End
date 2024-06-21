export default function ExpandIcon({ alt }) {
  return (
    <span className="icon fa fa-caret-down" aria-label={alt} role={!!alt ? 'img' : undefined} />
  );
}
