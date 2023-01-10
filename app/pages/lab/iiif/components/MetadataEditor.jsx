import { Markdown } from 'markdownz';
import { func, object, string } from 'prop-types';

export default function MetadataEditor({
  caption = '',
  metadata = {},
  onChange = () => true
}) {
  function onMetadataChange({ target }) {
    const { name: key } = target;
    let newKey;
    if (key.startsWith('#')) {
      newKey = key.slice(1);
    } else {
      newKey = `#${key}`;
    }
    const newMetadata = {};
    Object.entries(metadata).forEach(([oldKey, value]) => {
      if (oldKey === key) {
        newMetadata[newKey] = value;
      } else {
        newMetadata[oldKey] = value;
      }
    });
    onChange(newMetadata);
  }

  return (
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
          <th>Hidden</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(metadata).map(([key, value]) => (
          <tr key={key}>
            <td><strong>{key}</strong></td>
            <Markdown tag="td" content={value} inline={true} />
            <td><input type="checkbox" checked={key.startsWith('#')} name={key} value={value} onChange={onMetadataChange} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

MetadataEditor.propTypes = {
  caption: string,
  metadata: object,
  onChange: func
};
