/* eslint-disable react/react-in-jsx-scope */

export default function CloseIcon({ alt }) {
  return (
    <span className="icon fa fa-close" aria-label={alt} role={!!alt ? 'img' : undefined} />
  );
}
