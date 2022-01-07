import React from 'react'

function ClassificationEntry({
  name,
  value
}) {
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