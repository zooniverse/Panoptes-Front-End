/* eslint-disable react/react-in-jsx-scope */

export default function ReturnIcon({ alt }) {
  return (
    <span className="icon fa fa-chevron-left" alt={alt} role={!!alt ? 'img' : undefined} />
  );
}
