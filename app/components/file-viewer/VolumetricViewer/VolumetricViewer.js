import { func, object } from 'prop-types'
import { useState } from 'react'
import { ComponentViewer } from './components/ComponentViewer.js'
import { ModelViewer } from './models/ModelViewer.js'
import { useEffect } from 'react'
import { useVolumetricSubject } from './hooks/useVolumetricSubject.js'

const DEFAULT_HANDLER = () => {}

export default function VolumetricViewer ({
  onError = DEFAULT_HANDLER,
  onReady = DEFAULT_HANDLER,
  subject
}) {
  const { data, loading, error } = useVolumetricSubject({ onError, onReady, subject })

  const [modelState, setModelState] = useState({})

  // Ensures model setup is only run once
  useEffect(() => {
    setModelState({
      viewer: ModelViewer()
    })
  }, [])

  // Specs should skip rendering the VolumetricViewer component
  // WebGL/Canvas throws exceptions when running specs due to non-browser environment
  return (data === 'mock-subject-json')
    ? <div data-testid='subject-viewer-volumetric' />
    : (loading)
        ? <p>Loading...</p>
        : (error || data === null)
            ? <p>Error</p>
            : <ComponentViewer
                data-testid='subject-viewer-volumetric'
                config={{}}
                data={data}
                models={modelState}
              />
}

VolumetricViewer.propTypes = {
  onError: func,
  onReady: func,
  subject: object
}
