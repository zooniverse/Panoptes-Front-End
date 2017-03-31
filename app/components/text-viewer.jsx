import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const SUPPORTED_TYPES = ['text'];
const SUPPORTED_FORMATS = ['plain'];

class TextViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
    this.onLoadForText = this.onLoadForText.bind(this);
  }

  componentWillMount() {
    fetch(this.props.src, { mode: 'cors' })
    .then((response) => {
      return response.text();
    })
    .then((content) => {
      this.setState({ content });
    })
    .catch((e) => {
      const content = e.message;
      this.setState({ content });
    });
  }

  render() {
    let { content } = this.state;
    if (content === "") {
      return null;
    }
    if (SUPPORTED_TYPES.indexOf(this.props.type) === -1) {
      content = `Unsupported type: ${this.props.type}`;
    }
    if (SUPPORTED_FORMATS.indexOf(this.props.format) === -1) {
      content = `Unsupported format: ${this.props.format}`;
    }
    return (
      <div ref={(element) => {this.onLoadForText(element);}} className="text-viewer" >
        { content }
      </div>
    );
  }

  onLoadForText(element) {
    // mock event for frame-viewer's #handleLoad() method
    if (!element === null) {
      let e = {
        target: {
          naturalWidth: 0,
          naturalHeight: 0
        }
      };
      e.target.naturalWidth = element.getBoundingClientRect().width;
      e.target.naturalHeight = element.getBoundingClientRect().height;
      this.props.onLoad(e);
    }
  }
}

TextViewer.propTypes = {
  src: React.PropTypes.string.isRequired,
  type: React.PropTypes.string,
  format: React.PropTypes.string,
  onLoad: React.PropTypes.func,
};

TextViewer.defaultProps = {
  type: 'text',
  format: 'plain',
  onLoad: (e) => { console.log('text loaded', e); },
};

export default TextViewer;
