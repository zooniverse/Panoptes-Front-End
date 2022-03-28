import { useEffect, useRef, useMemo, useState } from 'react'

import { parseManifestV2 } from './helpers'
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

function parseManifest(manifest) {
  // Right now, only v2 manifests are supported
  if (manifest?.['@context'] === 'http://iiif.io/api/presentation/2/context.json') {
    return parseManifestV2(manifest)
  }
  const error = new Error('Only version 2 manifests are supported at present.')
  return { error }
}

export default function IIIFSubjectSet({ project }) {
  let error

  const [metadata, setMetadata] = useState(null)
  const manifestUrl = useRef()
  const [url, setUrl] = useState('')
  const manifestData = useManifest(url)
  const { manifest } = manifestData
  const parsedManifest = useMemo(() => manifest ? parseManifest(manifest) : {}, [manifest])
  const { label, metadata : newMetadata, subjects, thumb } = parsedManifest
  useEffect(() => {
    setMetadata(newMetadata)
  }, [newMetadata])

  if (parsedManifest.error) {
    error = parsedManifest.error
  }

  if (manifestData.error) {
    error = manifestData.error
  }

  function fetchManifest(event) {
    event?.preventDefault()
    const { value } = manifestUrl?.current
    if (value) {
      setUrl(value)
    }
  }

  return (
    <>
      <h1>Create a new subject set</h1>
      <form onSubmit={fetchManifest}>
        <label className="form-label" htmlFor="iiifUrl">Enter a manifest URL</label>
        <input className="standard-input full" id="iiifUrl" ref={manifestUrl} size="100" type="search" defaultValue="https://api.bl.uk/metadata/iiif/ark:/81055/vdc_100022589096.0x000002/manifest.json" />
        <button type="submit" className="standard-button">Fetch manifest</button>
      </form>
      {error && <p><b>{error.status}: {error.message}</b></p>}
      {manifest && metadata && <MetadataEditor caption={manifest.label} metadata={metadata} onChange={setMetadata} />}
      {subjects && <p>{subjects.slice(0,10).map(subject => <IIIFThumbnail key={subject.canvasID} subject={subject} />)}</p>}
      {subjects && <UploadButton manifest={manifest} metadata={metadata} project={project} subjects={subjects} />}
    </>
  )
}