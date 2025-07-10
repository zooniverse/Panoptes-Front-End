import { Cube } from './Cube.js'
import { Histogram } from './Histogram.js'
import { object, string } from 'prop-types'
import { Plane } from './Plane.js'
import styled, { css } from 'styled-components'

const StyledBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;

  .volumetric-viewer-container {
    display: flex;
    flex-direction: row;
    border-radius: 16px;
    width: 100%;
    margin-bottom: 20px;

    ${props => props.theme.dark
      ? css`
        background-color: none;
        color: #FFFFFF;
      `
      : css`
        background-color: #FFFFFF;
        border: .5px solid #A6A7A9;
        color: #000000;
      `
    }
  }
  
  .volume-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    background-color: #000000;
    border-bottom-left-radius: 16px;
    position: relative;

    .volume-cube {
      width: 100%;
    }
  }
  
  .volume-controls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  @media (width > 1200px) {
    .volumetric-viewer-container {
      max-width: 975px;
    }

    .planes-container {
      margin: 20px;
    }

    .volume-container {
      height: 575px;
      min-width: 330px;
      padding: 20px;
      border-top-right-radius: 16px;

      .volume-cube {
        max-width: 460px;
      }

      .volume-controls {
        margin-top: 0;
        max-height: 60px;
        width: 100%;
      }
    }
  }
  
  @media (width <= 1200px) {
    .volumetric-viewer-container {
      background: none;
      border: none;
      flex-direction: column-reverse;
      max-width: 410px;
    }

    .planes-container {
      margin: 20px 0 20px 20px;
    }

    .volume-container {
      border-radius: 16px;
      margin: 0 0 0 20px;
      width: 390px;

      .volume-cube {
        max-width: 325px;
        width: 100%;
      }

      .volume-controls {
        margin: 20px 0;
        width: 90%;
      }
    }
  }

  .no-select {
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    pointer-events: auto;
    touch-action: none;
    user-drag: none;
    user-select: none;
  }
`

export const ComponentViewer = ({
  data,
  models
}) => {
  models.viewer.initialize({
    annotations: models.annotations,
    data,
    tool: models.tool
  })

  return (
    <StyledBox>
      <div className="volumetric-viewer-container">
        <div className='planes-container'>
          {models.viewer.dimensions.map((dimensionName, dimension) => {
            return (
              <Plane
                annotations={models.annotations}
                dimension={dimension}
                key={`dimension-${dimensionName}`}
                tool={models.tool}
                viewer={models.viewer}
              />
            )
          })}
        </div>
        <div className='volume-container'>
          <div className='volume-cube'>
            <Cube
              annotations={models.annotations}
              tool={models.tool}
              viewer={models.viewer}
            />
          </div>
          <div className='volume-controls'>
            <div style={{ 'flex': 1 }}></div>

            <Histogram
              annotations={models.annotations}
              tool={models.tool}
              viewer={models.viewer}
            />
          </div>
        </div>
      </div>
    </StyledBox>
  )
}

ComponentViewer.propTypes = {
  data: string,
  models: object
}
