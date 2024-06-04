export default function LoadingIcon({ alt, ...rest }) {
  return (
    <span className="icon fa fa-spinner fa-spin" aria-label={alt} role={!!alt ? 'img' : undefined} {...rest} />
  );
}
