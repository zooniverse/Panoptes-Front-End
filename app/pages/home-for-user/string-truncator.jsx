import PropTypes from 'prop-types';
import React from 'react';

class StringTruncator extends React.Component {
  static propTypes = {
    tag: PropTypes.node,
    className: PropTypes.string,
    children: PropTypes.string.isRequired,
    splitter: PropTypes.instanceOf(RegExp),
    chop: PropTypes.number,
    ellipsis: PropTypes.element,
  };

  static defaultProps = {
    tag: 'div',
    className: '',
    children: '',
    splitter: /(\W*\s)/,
    reduceBy: 4,
    ellipsis: <span>…</span>,
  };

  state = {
    truncatedString: '',
  };

  componentDidMount() {
    this.truncate(this.props);
    addEventListener('resize', this.handleResize);
  }

  componentWillReceiveProps(nextProps) {
    this.truncate(nextProps);
  }

  componentWillUnmount() {
    removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.truncate(this.props);
  };

  truncate = (props, _lastWord = -1) => {
    if (this.container === null) {
      return;
    }

    const allWords = props.children.split(props.splitter);

    let lastWord = _lastWord;
    if (lastWord === -1) {
      lastWord = allWords.length;
    }

    const wordsThatMightFit = allWords.slice(0, lastWord);

    this.setState({
      truncatedString: wordsThatMightFit.join('').trim(),
    }, () => {
      if (this.container.offsetHeight < this.container.scrollHeight) {
        // TODO: Binary-search this to iterate as few times as necessary.
        this.truncate(props, wordsThatMightFit.length - props.reduceBy);
      }
    });
  };

  render() {
    let possibleEllipsis;
    if (this.state.truncatedString !== this.props.children) {
      possibleEllipsis = React.cloneElement(this.props.ellipsis, {
        className: ['string-truncator__ellipsis', this.props.ellipsis.props.className].join(' ').trim(),
      });
    }

    return React.createElement(this.props.tag, Object.assign({
      ref: (element) => {
        if (element !== null) {
          this.container = element.parentNode;
        } else {
          this.container = null;
        }
      },
    }, this.props, {
      className: ['string-truncator', this.props.className].join(' ').trim(),
    }), this.state.truncatedString, possibleEllipsis);
  }
}

export default StringTruncator;