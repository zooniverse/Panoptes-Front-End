import { number, object } from 'prop-types'
import { pointColor } from './../helpers/pointColor.js'
import { Slider } from './Slider'
import styled, { css } from 'styled-components'
import { useEffect, useRef, useState } from 'react'

const BACKGROUND_COLOR = '#000'
const CANVAS_WIDTH = 330
const SLIDER_WIDTH = 60

const StyledBox = styled.div`
  ${props => props.theme.dark
    ? css`background-color: #404040;`
    : css`background-color: #EFF2F5;`
  }

  border-radius: 16px;
  margin-bottom: 20px;
  width: 390px;

  button {
    border: 0 !important;
    border-radius: 16px !important;
    display: flex;
    width: 100%;
    outline: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Set explicit colors for all button states */
  button,
  button:hover,
  button:active,
  button:focus,
  button:visited {
    ${props => props.theme.dark
      ? css`color: #E2E5E9 !important;`
      : css`color: #5C5C5C !important;`
    }
  }

  &.expanded {
    border-bottom-right-radius: 0px;
  }

  &.plane-container-0 {
    border: 1px solid #E45950;
  }

  &.plane-container-1 {
    border: 1px solid #06FE76;
  }

  &.plane-container-2 {
    border: 1px solid #235DFF;
  }
  
  .plane-title {
    ${props => props.theme.dark
      ? css`background: linear-gradient(#5C5C5C, #404040);`
      : css`background: linear-gradient(#FFFFFF, #EFF2F5);`
    }
    width: 100%;
    align-items: center;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    display: flex;
    flex-direction: row;
    font-size: 24px;
    height: ${SLIDER_WIDTH}px;

    &.collapsed {
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
    }

    .plane-title-dimension {
      color: ${BACKGROUND_COLOR} !important;
      text-align: center;
      text-transform: uppercase;
      width: ${SLIDER_WIDTH}px;
    }

    .plane-title-frame {
      color: ${BACKGROUND_COLOR} !important;
      text-align: left !important;
      flex: 1;
      font-size: 16px !important;
      line-height: 18.7px;
    }

    .plane-title-label {
      font-size: 12px;
      line-height: 12px;
    }

    .plane-title-toggle {
      align-items: center;
      cursor: pointer;
      display: flex;
      margin-right: 10px;
      padding: 6px;
    }
  }

  .plane-content {
    display: flex;
    flex-direction: row;

    .plane-canvas {
      height: ${CANVAS_WIDTH}px;
      transform: translateY(2px);
      width: ${CANVAS_WIDTH}px;
    }
  }
`
export const Plane = ({
  dimension,
  viewer
}) => {
  const [hideCoor, setHideCoor] = useState()
  const [expanded, setExpanded] = useState(false)
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const planeId = useState(() => {
    // Older version of react doesn't have useId()
    return Math.random().toString(36).substring(2, 10);
  });

  // Offscreen Canvas for fast rendering
  const frameCanvas = document.createElement('canvas')
  frameCanvas.width = viewer.base
  frameCanvas.height = viewer.base

  // State Change Management through useEffect()
  useEffect(() => {
    // Default open the X/0 frame
    setHideCoor(dimension !== 0)
    setExpanded(dimension === 0)
    drawFrame()

    // State Listeners to bypass React rerenders
    viewer.on(`change:dimension-${dimension}:frame`, drawFrame)
    viewer.on('change:threshold', drawFrame)

    return () => {
      viewer.off(`change:dimension-${dimension}:frame`, drawFrame)
      viewer.off('change:threshold', drawFrame)
    }
  }, [])

  useEffect(() => {
    if (expanded) drawFrame()
  }, [expanded])

  // Functions that do the actual work
  async function drawFrame (e) {
    // draw to offscreen canvas
    const context = frameCanvas.getContext('2d')
    const frame = viewer.getPlaneFrame({ dimension })
    frame.forEach((lines, x) => {
      lines.forEach((point, y) => {
        drawPoint({ context, point, x, y })
      })
    })

    // transfer to screen
    const data = await window.createImageBitmap(frameCanvas, {
      resizeWidth: CANVAS_WIDTH,
      resizeHeight: CANVAS_WIDTH,
      resizeQuality: 'pixelated'
    })

    canvasRef.current?.getContext('2d').drawImage(data, 0, 0)

    // update frame index
    setCurrentFrameIndex(viewer.getPlaneFrameIndex({ dimension }))
  }

  function drawPoint ({ context, point, x, y }) {
    const annotationIndex = viewer.getPointAnnotationIndex({ point })

    // Draw points that are not in threshold same color as background
    if (viewer.isPointInThreshold({ point }) || annotationIndex !== -1) {
      // isInactive makes all inactive marks less visible 
      const isInactive = false
  
      context.fillStyle = pointColor({
        annotationIndex,
        isInactive,
        pointValue: viewer.getPointValue({ point })
      })
    } else {
      context.fillStyle = BACKGROUND_COLOR
    }
    context.fillRect(x, y, 1, 1)
  }

  // Interaction Functions
  function toggleContentVisibility () {
    setHideCoor(false)
    setExpanded(!expanded)
  }

  function onClick (e) {
    e.preventDefault()
  }

  function onWheel (e) {
    const frameCurrent = viewer.getPlaneFrameIndex({ dimension })
    const frameNew =
      e.deltaY > 0 && frameCurrent > 0
        ? frameCurrent - 1
        : e.deltaY < 0 && frameCurrent < viewer.base - 1
          ? frameCurrent + 1
          : frameCurrent

    viewer.setPlaneFrameActive({ dimension, frame: frameNew })
  }

  return (
    <StyledBox className={`plane-container plane-container-${dimension} ${expanded ? 'expanded' : 'collapsed'} no-select`} ref={containerRef}>
      <button
        aria-controls={`section-${planeId}`}
        aria-expanded={expanded.toString()}
        aria-label={`Toggle ${viewer.dimensions[dimension]} Plane Visibility`}
        id={`accordion-${planeId}`}
        onClick={toggleContentVisibility}
        type="button"
      >
        <div className={`plane-title ${expanded ? 'expanded' : 'collapsed'}`}>
          <div className='plane-title-dimension'>{viewer.getDimensionLabel({ dimension })}</div>
          <div className={`plane-title-frame`}>{hideCoor ? '' : currentFrameIndex}</div>
          <div className='plane-title-label'>
            {expanded ? 'Collapse' : 'Expand'}
          </div>
          <div className='plane-title-toggle'>
            {expanded ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </div>
        </div>
      </button>
      {expanded &&
        <div
          aria-labelledby={`accordion-${planeId}`}
          className='plane-content'
          id={`section-${planeId}`}
          role="region"
        >
          <Slider
            dimension={dimension}
            viewer={viewer}
          />
          <div className='plane-canvas'>
            <canvas
              className={`plane-${dimension}`}
              data-testid={`plane-${dimension}`}
              height={CANVAS_WIDTH}
              onClick={onClick}
              onContextMenu={onClick}
              onWheel={onWheel}
              ref={canvasRef}
              width={CANVAS_WIDTH}
            />
          </div>
        </div>}
    </StyledBox>
  )
}

Plane.propTypes = {
  dimension: number,
  viewer: object
}
