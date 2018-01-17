import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import FeedbackPoint from './feedback-point';

function renderFeedbackPoints(feedback) {
  return (
    <g className="feedback-points">
      {feedback.map(point => <FeedbackPoint
        point={point}
        key={`feedback-point-${point.x}-${point.y}`}
      />)}
    </g>
  );
}

class FeedbackViewer extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.feedback.length !== this.props.feedback.length;
  }

  render() {
    const { feedback } = this.props;
    return (feedback.length) ? renderFeedbackPoints(feedback) : null;
  }
}

const mapStateToProps = state => ({
  feedback: state.feedback.filter(item => item.target === 'classifier')
});

FeedbackViewer.propTypes = {
  feedback: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string
  }))
};

export default connect(mapStateToProps)(FeedbackViewer);
export { FeedbackViewer };