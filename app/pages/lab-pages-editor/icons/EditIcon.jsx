export default function EditIcon({ alt }) {
  return (
    <span className="icon fa fa-pencil" aria-label={alt} role={!!alt ? 'img' : undefined} />
  );
}
