import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import animatedScrollTo from 'animated-scrollto';

export default class StepThrough extends Component {
  constructor(props) {
    super(props);
    this.goPrevious = this.goPrevious.bind(this);
    this.goNext = this.goNext.bind(this);
    this.goTo = this.goTo.bind(this);
    this.handleStep = this.handleStep.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.renderControls = this.renderControls.bind(this);
    this.state = {
      render: false,
      step: props.defaultStep
    };
  }

  static defaultProps = {
    className: '',
    defaultStep: 0
  }

  static propTypes = {
    className: PropTypes.string,
    defaultStep: PropTypes.number
  }

  componentDidMount() {
    addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    removeEventListener('keydown', this.handleKeyDown);
  }

  goPrevious(total) {
    const previousStep = this.state.step - 1;
    if (previousStep < 0) this.handleStep(total, previousStep);
  }

  goNext(total) {
    const nextStep = this.state.step + 1;
    if (nextStep > (total - 1)) this.handleStep(total, nextStep);
  }

  goTo(index) {
    this.handleStep(index)
  }

  handleStep(total, index) {
    this.setState({
      step: ((index % total) + total) % total
    }, this.handleScroll);
  }

  handleKeyDown(e) {
    const total = React.Children.count(this.props.children);
    switch (e.which) {
      // left
      case 37:
        e.preventDefault();
        this.goPrevious(total);
        break;
      // right
      case 39:
        e.preventDefault();
        this.goNext(total);
        break;
    }
  }

  handleScroll() {
    const reactSwipeNode = ReactDOM.findDOMNode(this.swiper);
    setTimeout(animatedScrollTo(reactSwipeNode, reactSwipeNode.offsetTop, 0), 500);
  }

  renderControls(childrenCount) {
    if (childrenCount === 1) {
      return null;
    } else {
      const allSteps = Array.from(Array(childrenCount).keys());
      return (
        <div className="step-through-controls" style={{ position: 'relative' }}>
          <button
            type="button"
            className="step-through-direction step-through-previous"
            aria-label="Previous step"
            title="Previous"
            disabled={this.state.step === 0}
            onClick={this.goPrevious.bind(this, childrenCount)}
          >
            ◀
      </button>

          <span className="step-through-pips">
            {allSteps.map(thisStep =>
              <label key={thisStep} className="step-through-pip" title={`Step ${thisStep + 1}`}>
                <input
                  type="radio"
                  className="step-through-pip-input"
                  aria-label={`Step ${thisStep + 1} of ${childrenCount}`}
                  checked={thisStep === this.state.step}
                  autoFocus={thisStep === this.state.step}
                  onChange={this.goTo.bind(this, thisStep)}
                />
                <span className="step-through-pip-number">{thisStep + 1}</span>
              </label>
            )}
          </span>

          <button
            type="button"
            className="step-through-direction step-through-next"
            aria-label="Next step" title="Next"
            disabled={this.state.step === childrenCount - 1}
            onClick={this.goNext.bind(this, childrenCount)}
          >
            ▶
      </button>

        </div>
      );
    }
  }

  render() {
    const childrenCount = React.Children.count(this.props.children);
    const tutorialProps = Object.assign({}, this.props, {
      currentStep: this.state.step,
      goToNextStep: this.goNext.bind(this, childrenCount),
      goToPreviousStep: this.goPrevous.bind(this, childrenCount)
    })
    return (
      <div ref={(node) => { this.swiper = node; }} className={`step-through ${this.props.className}`} style={this.props.style}>
        {React.cloneElement(this.props.children, tutorialProps)}
        {this.renderControls(childrenCount)}
      </div>
    );
  }
}

