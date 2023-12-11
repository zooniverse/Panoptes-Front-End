export default function ReturnIcon({ alt }) {
  return (
    <span className="icon fa fa-chevron-left" aria-label={alt} role={!!alt ? 'img' : undefined} />
  );
}
