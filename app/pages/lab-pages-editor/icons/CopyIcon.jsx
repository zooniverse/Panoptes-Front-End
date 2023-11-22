/* eslint-disable react/react-in-jsx-scope */

export default function CopyIcon({ alt }) {
  return (
    <span className="icon fa fa-copy" alt={alt} role={!!alt ? 'img' : undefined} />
  );
}
