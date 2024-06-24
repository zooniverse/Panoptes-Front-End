export default function ExpandIcon({ alt }) {
  return (
    <span className="icon fa fa-angle-down" aria-label={alt} role={!!alt ? 'img' : undefined} />
  );
}
