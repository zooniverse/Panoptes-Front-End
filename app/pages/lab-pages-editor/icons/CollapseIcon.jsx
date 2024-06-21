export default function CollapseIcon({ alt }) {
  return (
    <span className="icon fa fa-caret-up" aria-label={alt} role={!!alt ? 'img' : undefined} />
  );
}
