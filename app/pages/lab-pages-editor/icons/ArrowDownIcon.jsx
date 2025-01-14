export default function ArrowDownIcon({ alt, className }) {
  return (
    <span className={`icon fa fa-angle-down ${className}`} aria-label={alt} role={!!alt ? 'img' : undefined} />
  );
}
