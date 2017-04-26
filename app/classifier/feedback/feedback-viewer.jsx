import React from 'react';
import { connect } from 'react-redux';

class FeedbackViewer extends React.Component {
  constructor(props) {
    super(props);
    this.renderFeedbackPoints = this.renderFeedbackPoints.bind(this);
    this.renderFeedbackPoint = this.renderFeedbackPoint.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.feedback.length !== this.props.feedback.length;
  }

  render() {
    const feedback = this.props.feedback.reduce((drawingFeedback, item) =>
      (item.type === 'drawing') ? drawingFeedback.concat(item.feedback) : drawingFeedback, []);
    return (feedback.length) ? this.renderFeedbackPoints(feedback) : null;
  }

  renderFeedbackPoint(point) {
    const statusClass = (point.success) ? 'feedback-points__point--success' : 'feedback-points__point--failure';
    const props = {
      className: `feedback-points__point ${statusClass}`,
      cx: point.x,
      cy: point.y,
      r: point.tol,
      key: `feedback-point-${point.x}-${point.y}`,
    };
    return (<circle {...props} />);
  }

  renderFeedbackPoints(feedback) {
    return (
      <g className="feedback-points">
        {feedback.map(this.renderFeedbackPoint)}
      </g>
    );
  }
}

FeedbackViewer.contextTypes = {
  feedback: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  feedback: state.feedback,
});

export default connect(mapStateToProps)(FeedbackViewer);
