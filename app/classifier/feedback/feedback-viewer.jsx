import React from 'react';

export default class FeedbackViewer extends React.Component {
  constructor(props) {
    super(props);
    this.renderFeedbackPoints = this.renderFeedbackPoints.bind(this);
    this.renderFeedbackPoint = this.renderFeedbackPoint.bind(this);
  }

  render() {
    const feedback = this.props.feedback.items;
    return (feedback.length)
      ? this.renderFeedbackPoints(feedback)
      : null;
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

