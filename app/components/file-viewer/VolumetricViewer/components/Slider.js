import { number, object, string } from 'prop-types'
import styled, { css } from 'styled-components'

const COLORS = {
  active: '#265B68',
  black: '#000',
  hover: '#ADDDE0',
  white: '#FFF'
}

const svgSlider = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 32'>
  <rect width='100%' height='100%' rx='8' ry='8' style='fill: rgb(0,93,105);' />
  <path d='M16 10 l-7 6 l7 6;' style='stroke:rgb(173, 221, 224); stroke-width:2; fill: none;'/>
  <path d='M24 10 l7 6 l-7 6;' style='stroke:rgb(173, 221, 224); stroke-width:2; fill: none;'/>
</svg>`

const svgSliderStyles = `
  appearance: none;
  background-image: url("data:image/svg+xml;base64,${btoa(svgSlider)}");
  background-size: cover;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  height: 32px;
  width: 40px;
`

const StyledSlider = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 60px;
  width: 60px;

  input[type="range"] {
    ${props =>
    props.theme.dark
      ? css`background: ${COLORS.white};`
      : css`background: ${COLORS.black};`
  }
    -webkit-appearance: none;
    border-radius: 5px;
    height: 4px;
    transform: rotate(90deg) translateX(125px);
    width: 250px;

    &::-moz-range-thumb {
      ${svgSliderStyles}
    }
    &::-webkit-slider-thumb {
      ${svgSliderStyles}
    }
  }
  
  .plane-slider-forward {
    /* Force reset of button styles */
    all: unset !important;
    box-sizing: border-box !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;

    /* Fixed dimensions */
    width: 40px !important;
    height: 40px !important;
    border-radius: 50% !important;
    margin-bottom: 10px !important;

    /* Default state */
    background: transparent !important;
    ${props => props.theme.dark
      ? css`stroke: ${COLORS.white} !important;`
      : css`stroke: ${COLORS.black} !important;`
    }

    /* SVG sizing */
    svg {
      width: 20px !important;
      height: 20px !important;
    }

    /* Hover state */
    &:hover {
      background: ${COLORS.hover} !important;
      stroke: ${COLORS.white} !important;
    }

    /* Active state */
    &:active {
      background: ${COLORS.active} !important;
      stroke: ${COLORS.white} !important;
    }
  }
`

export const Slider = ({ dimension, viewer }) => {
  const currentFrame = viewer.base - 1 - viewer.getPlaneFrameIndex({ dimension });

  function inChange(e) {
    const nextFrame = viewer.base - 1 - +e.target.value;
    viewer.setPlaneFrameActive({ dimension, frame: nextFrame })
  }

  function advanceFrame() {
    viewer.setPlaneFrameActive({
      dimension,
      frame: (viewer.getPlaneFrameIndex({ dimension }) - 10 + viewer.base) % viewer.base
    })
  }

  return (
    <StyledSlider>
      <button
        className='plane-slider-forward no-select'
        onClick={advanceFrame}
        aria-label="Forward Ten"
      >
        <svg
          aria-label="ForwardTen"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M20.889 7.556C19.33 4.267 15.93 2 12 2 6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10m0-8v4h-4m-9 8V9l-2 .533M17 12c0-2-1-3.5-2.5-3.5S12 10 12 12s1 3.5 2.5 3.5S17 14 17 12zm-2.5-3.5C16.925 8.5 17 11 17 12s0 3.5-2.5 3.5S12 13 12 12s.059-3.5 2.5-3.5z"
          />
        </svg>
      </button>
      <input
        aria-label={`Plane ${dimension} Slider`}
        max={viewer.base - 1}
        min='0'
        onChange={inChange}
        type='range'
        value={currentFrame}
      />
    </StyledSlider>
  )
}

Slider.propTypes = {
  dimension: number,
  frame: string,
  viewer: object
}
