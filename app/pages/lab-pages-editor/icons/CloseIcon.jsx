export default function CloseIcon({ alt }) {
  return (
    <span className="icon fa fa-close" aria-label={alt} role={!!alt ? 'img' : undefined} />
  );
}
