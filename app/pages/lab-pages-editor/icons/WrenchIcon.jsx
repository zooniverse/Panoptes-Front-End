export default function WrenchIcon({ alt, ...rest }) {
  return (
    <span className="icon fa fa-wrench" aria-label={alt} role={!!alt ? 'img' : undefined} {...rest} />
  );
}
