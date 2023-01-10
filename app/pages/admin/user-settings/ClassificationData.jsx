import React from 'react';

function ClassificationEntry({
  name,
  value
}) {
  if (name === 'annotations') {
    return (
      <>
        <b>annotations:</b>
        <ol>
          {value.map(annotation => (
            <li>
              {JSON.stringify(annotation)}
              <br />
            </li>
          ))}
        </ol>
      </>
    );
  }
  if (name === 'metadata') {
    const entries = Object.entries(value);
    return (
      <>
        <b>metadata:</b>
        <ul>
          {entries.map(([key, value]) => (
            <li>
              <b>
                {key}
:
              </b>
              {JSON.stringify(value)}
              <br />
            </li>
          ))}
        </ul>
      </>
    );
  }
  return (
    <>
      <b>
        {name}
:
      </b>
      {' '}
      {JSON.stringify(value)}
      <br />
    </>
  );
}

export default function Classification({
  classification = {}
}) {
  const entries = Object.entries(classification).filter(([key, value]) => !key.startsWith('_'));
  return (
    <code>
      {entries.map(([key, value]) => <ClassificationEntry key={key} name={key} value={value} />)}
    </code>
  );
}
