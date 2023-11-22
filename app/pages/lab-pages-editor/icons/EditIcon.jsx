/* eslint-disable react/react-in-jsx-scope */

export default function EditIcon({ alt }) {
  return (
    <span className="icon fa fa-pencil" alt={alt} role={!!alt ? 'img' : undefined} />
  );
}
