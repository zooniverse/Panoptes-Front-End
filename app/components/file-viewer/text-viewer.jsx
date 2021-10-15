import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';

const SUPPORTED_TYPES = ['text'];
const SUPPORTED_FORMATS = ['plain'];

const cache = {};

class TextViewer extends Component {
  constructor(props) {
    super(props);
    this.element = null;
    this.state = {
      content: ''
    };
  }

  componentDidMount() {
    this.element.addEventListener('load', this.props.onLoad);
    this.loadText(this.props.src);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.src !== this.props.src) {
      this.loadText(newProps.src);
    }
  }

  componentWillUnmount() {
    this.element.removeEventListener('load', this.props.onLoad);
  }

  loadText(src) {
    const cachedContent = cache[src];
    if (cachedContent) {
      this.setState({ content: cachedContent });
      const e = new Event('load');
      e.data = cachedContent;
      this.element.dispatchEvent(e);
    } else {
      this.setState({ content: 'Loading…' });
      fetch(src + '?=')
      .then((response) => {
        return response.text();
      })
      .then((content) => {
        cache[src] = content;
        this.setState({ content });
        const e = new Event('load');
        e.data = content;
        this.element.dispatchEvent(e);
      })
      .catch((e) => {
        const content = e.message;
        this.setState({ content });
      });
    }
  }

  render() {
    let { content } = this.state;
    const isLoading = (this.state.content === 'Loading…');
    if (SUPPORTED_TYPES.indexOf(this.props.type) === -1) {
      content = `Unsupported type: ${this.props.type}`;
    }
    if (SUPPORTED_FORMATS.indexOf(this.props.format) === -1) {
      content = `Unsupported format: ${this.props.format}`;
    }
    const className = classnames(this.props.className, {
      'text-viewer-loading': isLoading,
      'text-viewer': !isLoading
    });
    return (
      <div ref={(element) => { this.element = element; }} className={className} style={this.props.style}>
        { content }
      </div>
    );
  }
}

TextViewer.propTypes = {
  src: PropTypes.string.isRequired,
  type: PropTypes.string,
  format: PropTypes.string,
  onLoad: PropTypes.func,
  style: PropTypes.object
};

TextViewer.defaultProps = {
  type: 'text',
  format: 'plain',
  onLoad: (e) => { console.log('text loaded', e); }
};

export default TextViewer;