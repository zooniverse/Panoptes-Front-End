import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Tooltip from './tooltip';

class SVGToolTipLayer extends React.Component {
  constructor(props) {
    super(props);
    this.renderTooltips = this.renderTooltips.bind(this);
  }

  renderTooltips() {
    const { feedback } = this.props;
    return (
      <div className="classifier-tooltips">
        {feedback.map(item =>
          <Tooltip
            item={item}
            key={`feedback-point-${item.x}-${item.y}`}
          />
        )}
      </div>
    );
  }

  render() {
    return (this.props.feedback.length) ? this.renderTooltips() : null;
  }
}

const mapStateToProps = state => ({
  feedback: state.feedback.filter(item => item.target === 'classifier')
});

SVGToolTipLayer.propTypes = {
  feedback: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string
  }))
};

export default connect(mapStateToProps)(SVGToolTipLayer);
export { SVGToolTipLayer };