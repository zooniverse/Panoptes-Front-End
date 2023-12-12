export default function ExternalLinkIcon({ alt }) {
  return (
    <span className="icon fa fa-external-link" aria-label={alt} role={!!alt ? 'img' : undefined} />
  );
}
