/* eslint-disable react/react-in-jsx-scope */

export default function DeleteIcon({ alt }) {
  return (
    <span className="icon fa fa-trash" aria-label={alt} role={!!alt ? 'img' : undefined} />
  );
}
