export default function MinusIcon({ alt, ...rest }) {
  return (
    <span className="icon fa fa-minus" aria-label={alt} role={!!alt ? 'img' : undefined} {...rest} />
  );
}
