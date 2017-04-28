import React from 'react';
import { connect } from 'react-redux';

class FeedbackViewer extends React.Component {
  constructor(props) {
    super(props);
    this.renderFeedbackPoints = this.renderFeedbackPoints.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.feedback.length !== this.props.feedback.length;
  }

  render() {
    const feedback = this.props.feedback.reduce((drawingFeedback, item) =>
      (item.type === 'drawing') ? drawingFeedback.concat(item.feedback) : drawingFeedback, []);
    return (feedback.length) ? this.renderFeedbackPoints(feedback) : null;
  }

  renderFeedbackPoints(feedback) {
    return (
      <g className="feedback-points">
        {feedback.map(point => <FeedbackPoint point={point} />)}
      </g>
    );
  }
}

const mapStateToProps = (state) => ({
  feedback: state.feedback,
});

export default connect(mapStateToProps)(FeedbackViewer);

class FeedbackPoint extends React.Component {
  constructor(props) {
    super(props);
    this.createPoint = this.createPoint.bind(this);
    this.createTooltip = this.createTooltip.bind(this);
  }

  render() {
    const point = this.createPoint();
    this.createTooltip(point);
    return point;
  }

  createPoint() {
    const { point } = this.props;
    const statusClass = (point.success) ? 'feedback-points__point--success' : 'feedback-points__point--failure';
    const pointProps = {
      className: `feedback-points__point ${statusClass}`,
      cx: point.x,
      cy: point.y,
      r: point.tol,
      key: `feedback-point-${point.x}-${point.y}`,
    };
    return <circle {...pointProps} />;
  }

  createTooltip(point) {
    console.info('point', point)
  }
}
