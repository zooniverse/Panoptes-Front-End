import React, { Component } from 'react';

const SUPPORTED_TYPES = ['text'];
const SUPPORTED_FORMATS = ['plain'];

class TextViewer extends Component {
  constructor(props) {
    super(props);
    this.element = null;
    this.state = {
      content: 'Loading…'
    };
  }

  componentDidMount() {
    this.element.addEventListener('load', this.props.onLoad);
    fetch(this.props.src, { mode: 'cors' })
    .then((response) => {
      return response.text();
    })
    .then((content) => {
      this.setState({ content });
      this.element.dispatchEvent(new Event('load'));
    })
    .catch((e) => {
      const content = e.message;
      this.setState({ content });
    });
  }

  componentWillUnmount() {
    this.element.removeEventListener('load', this.props.onLoad);
  }

  render() {
    let { content } = this.state;
    if (SUPPORTED_TYPES.indexOf(this.props.type) === -1) {
      content = `Unsupported type: ${this.props.type}`;
    }
    if (SUPPORTED_FORMATS.indexOf(this.props.format) === -1) {
      content = `Unsupported format: ${this.props.format}`;
    }
    return (
      <div ref={(element) => { this.element = element; }} className="text-viewer" >
        { content }
      </div>
    );
  }
}

TextViewer.propTypes = {
  src: React.PropTypes.string.isRequired,
  type: React.PropTypes.string,
  format: React.PropTypes.string,
  onLoad: React.PropTypes.func
};

TextViewer.defaultProps = {
  type: 'text',
  format: 'plain',
  onLoad: (e) => { console.log('text loaded', e); }
};

export default TextViewer;
