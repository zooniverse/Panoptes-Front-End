export default function PlusIcon({ alt, ...rest }) {
  return (
    <span className="icon fa fa-plus" aria-label={alt} role={!!alt ? 'img' : undefined} {...rest} />
  );
}
