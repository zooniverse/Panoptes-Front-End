import React from 'react';
import { connect } from 'react-redux';

class ToolTipLayer extends React.Component {
  constructor(props) {
    super(props);
    this.renderTooltips = this.renderTooltips.bind(this);
    this.renderTooltip = this.renderTooltip.bind(this);
  }

  render() {
    return (this.props.feedback.length) ? this.renderTooltips() : null;
  }

  renderTooltip(item) {
    const matrix = this.props.screenCTM.translate(item.x, item.y);
    const position = {
      left: `${item.x}px`,
      bottom: `${parseInt(item.y, 10) + parseInt(item.tol, 10) + 15}px`,
    }
    return (
      <div
        className={`feedback-tooltip feedback-tooltip--${item.success ? 'success' : 'failure'}`}
        key={`feedback-tooltip-${item.x}-${item.y}`}
        style={position}>
        <div className="feedback-tooltip__content">
          {item.message}
        </div>
        <svg
          className="feedback-tooltip__triangle"
          version="1.1"
          viewBox="0 10 20 15"
          xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,0 20,0 10,15"/>
        </svg>
      </div>
    );
  }

  renderTooltips() {
    const feedbackItems = this.props.feedback.reduce((items, feedbackObj) => items.concat(feedbackObj.feedback), []);
    return (
      <div className="classifier-tooltips">
        {feedbackItems.map(this.renderTooltip)}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  feedback: state.feedback,
});

export default connect(mapStateToProps)(ToolTipLayer);
