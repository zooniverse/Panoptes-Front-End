import React, { Component } from 'react';

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
    return (
      <div ref={(element) => { this.element = element; }} className={isLoading ? 'text-viewer-loading' : 'text-viewer'} style={this.props.style}>
        { content }
      </div>
    );
  }
}

TextViewer.propTypes = {
  src: React.PropTypes.string.isRequired,
  type: React.PropTypes.string,
  format: React.PropTypes.string,
  onLoad: React.PropTypes.func,
  style: React.PropTypes.object
};

TextViewer.defaultProps = {
  type: 'text',
  format: 'plain',
  onLoad: (e) => { console.log('text loaded', e); }
};

export default TextViewer;
