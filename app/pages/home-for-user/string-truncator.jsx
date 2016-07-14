import React from 'react';

const StringTruncator = React.createClass({
  propTypes: {
    tag: React.PropTypes.node,
    className: React.PropTypes.string,
    children: React.PropTypes.string,
    splitter: React.PropTypes.any,
    ellipsis: React.PropTypes.node,
  },

  getDefaultProps() {
    return {
      tag: 'div',
      className: '',
      children: '',
      splitter: /(\W)/g,
      ellipsis: <span className="string-trucator__ellipsis">…</span>,
    };
  },

  getInitialState() {
    return {
      modifiedString: '',
    };
  },

  componentDidMount() {
    this.findTruncatedString(this.props.children);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.children !== this.props.children) {
      this.findTruncatedString(nextProps.children);
    }
  },

  findTruncatedString(string, _lastWord = -1) {
    const allWords = string.split(this.props.splitter);

    if (_lastWord === -1) {
      _lastWord = allWords.length;
    }

    const wordsThatMightFit = allWords.slice(0, _lastWord);

    this.setState({
      modifiedString: wordsThatMightFit.join('').trim(),
    }, () => {
      if (!!this.container && (this.container.offsetHeight < this.container.scrollHeight)) {
        this.findTruncatedString(string, wordsThatMightFit.length - 5);
      }
    });
  },

  render() {
    let possibleEllipsis = null;
    if (this.state.modifiedString !== this.props.children) {
      possibleEllipsis = this.props.ellipsis;
    }

    return React.createElement(this.props.tag, Object.assign({
      ref: (element) => {
        if (!!element) {
          this.container = element.parentNode;
        }
      },
    }, this.props, {
      className: ['string-trucator', this.props.className].join(' ').trim(),
    }), this.state.modifiedString, possibleEllipsis);
  },
});

export default StringTruncator;
