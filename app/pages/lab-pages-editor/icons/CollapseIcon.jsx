export default function CollapseIcon({ alt }) {
  return (
    <span className="icon fa fa-angle-up" aria-label={alt} role={!!alt ? 'img' : undefined} />
  );
}
