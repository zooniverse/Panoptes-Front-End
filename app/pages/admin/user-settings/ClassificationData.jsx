import React from 'react'

function ClassificationEntry({
  name,
  value
}) {
  if (name === 'annotations') {
    return (
      <details>
        <summary>
          <b>annotations:</b>
        </summary>
        <ol>
          {value.map(annotation => <li>{JSON.stringify(annotation)}<br/></li>)}
        </ol>
      </details>
    )
  }
  if (name === 'metadata') {
    const entries = Object.entries(value)
    return (
      <details>
        <summary>
          <b>metadata:</b>
        </summary>
        <ul>
          {entries.map(([key, value]) => <li><b>{key}:</b>{JSON.stringify(value)}<br/></li>)}
        </ul>
      </details>
    )
  }
  return (
    <>
      <b>{name}:</b> {JSON.stringify(value)}<br/>
    </>
  )
}

export default function Classification({
  classification = {}
}) {
  const entries = Object.entries(classification).filter(([key, value]) => !key.startsWith('_'))
  return (
    <code>
      {entries.map(([key, value]) => <ClassificationEntry key={key} name={key} value={value} />)}
    </code>
  )
}