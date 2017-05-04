import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Tooltip from './tooltip';

class SVGToolTipLayer extends React.Component {
  constructor(props) {
    super(props);
    this.renderTooltips = this.renderTooltips.bind(this);
  }

  render() {
    return (this.props.feedback.length) ? this.renderTooltips() : null;
  }

  renderTooltips() {
    const { feedback, screenCTM } = this.props;
    return (
      <div className="classifier-tooltips">
        {feedback.map(item =>
          <Tooltip
            item={item}
            key={`feedback-point-${item.x}-${item.y}`}
            screenCTM={screenCTM}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  feedback: state.feedback.filter(item => item.target === 'classifier'),
});

SVGToolTipLayer.propTypes = {
  feedback: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string,
  })),
  screenCTM: PropTypes.object,
};

export default connect(mapStateToProps)(SVGToolTipLayer);
export { SVGToolTipLayer };
