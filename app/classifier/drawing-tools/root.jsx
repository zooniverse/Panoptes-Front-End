import React from 'react';
import PropTypes from 'prop-types';
import DetailsSubTaskForm from './components/DetailsSubTaskForm';

const STROKE_WIDTH = 1.5;
const SELECTED_STROKE_WIDTH = 2.5;

const SEMI_MODAL_FORM_STYLE = {
  pointerEvents: 'all'
};

const SEMI_MODAL_UNDERLAY_STYLE = {
  pointerEvents: 'none',
  backgroundColor: 'rgba(0, 0, 0, 0)'
};

export default class DrawingToolRoot extends React.Component {
  static defaultProps = {
    tool: null
  }

  static state = {
    destroying: false
  }

  static distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  componentDidMount() {
    this.focusDrawingTool();
  }

  focusDrawingTool() {
    const x = window.scrollX;
    const y = window.scrollY;
    const { root } = this;
    try {
      if (root && root.focus) {
        root.focus();
        window.scrollTo(x, y);
      }
    } catch (error) {
      console.info('Edge currently does not support focus on SVG elements:', error);
    }
  }

  render() {
    let startHandler = () => {};
    const toolProps = this.props.tool.props;
    const tasks = require('../tasks').default;

    const rootProps = {
      'data-disabled': toolProps.disabled || null,
      'data-selected': toolProps.selected || null,
      'data-destroying': (this.props.tool.state) ? this.props.tool.state.destroying : null,
      style: { color: toolProps.color }
    };

    const scale = (toolProps.scale.horizontal + toolProps.scale.vertical) / 2;

    const mainStyle = {
      fill: 'transparent',
      stroke: 'currentColor',
      strokeWidth: (toolProps.selected) ? (SELECTED_STROKE_WIDTH / scale) : (STROKE_WIDTH / scale)
    };

    const openDetails = toolProps.selected && !toolProps.mark._inProgress && (toolProps.details && toolProps.details.length !== 0);
    if (!toolProps.disabled) {
      startHandler = (e) => {
        if (!openDetails) {
          this.focusDrawingTool();
          return toolProps.onSelect(e);
        }
      }
    }

    return (
      <g className = "drawing-tool" {...rootProps } {...this.props }>
        <g
          className="drawing-tool-main"
          {...mainStyle}
          ref={(element) => { this.root = element; }}
          onMouseDown={startHandler}
          onPointerDown={startHandler}
          onTouchStart={startHandler}
          tabIndex="-1"
        >
          {this.props.children}
        </g>

        {openDetails &&
          <DetailsSubTaskForm
            onFormClose={this.focusDrawingTool}
            tasks={tasks}
            toolProps={toolProps}
            {...this.props}
          />}
      </g>
    );
  }
}
