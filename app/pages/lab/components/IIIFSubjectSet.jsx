import { useRef, useMemo, useState } from 'react'

import { parseManifest } from './helpers'
import { useManifest } from './hooks'
import { MetadataEditor, UploadButton } from './'

const imgStyle = {
  display: 'inline-block'
}

function IIIFThumbnail({ subject }) {
  return (
    <img
      style={imgStyle}
      alt={subject.alt}
      src={subject.thumb}
      width={50}
    />
  )
}

export default function IIIFSubjectSet({ project }) {
  const manifestUrl = useRef()
  const [metadata, setMetadata] = useState(null)
  const [url, setUrl] = useState('')
  const { manifest, error } = useManifest(url)
  const { label, metadata: newMetadata, subjects, thumb } = useMemo(() => (manifest ? parseManifest(manifest) : {}), [manifest])

  if(newMetadata && !metadata) {
    setMetadata(newMetadata)
  }

  function onClick() {
    const { value } = manifestUrl?.current
    if (value) {
      setUrl(value)
    }
  }

  return (
    <>
      <label htmlFor="iiifUrl">Manifest URL</label>
      <input id="iiifUrl" ref={manifestUrl} size="100" type="text" defaultValue="https://api.bl.uk/metadata/iiif/ark:/81055/vdc_100022589096.0x000002/manifest.json" />
      <button onClick={onClick}>Fetch manifest</button>
      {error && <p><b>{error.status}: {error.message}</b></p>}
      {manifest && <MetadataEditor caption={manifest.label} metadata={metadata} onChange={setMetadata} />}
      {subjects && <p>{subjects.slice(0,20).map(subject => <IIIFThumbnail key={subject.id} subject={subject} />)}</p>}
      {subjects && <UploadButton manifest={manifest} metadata={metadata} project={project} subjects={subjects} />}
    </>
  )
}