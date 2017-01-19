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
  }

  componentWillMount() {
    fetch(this.props.src)
    .then((response) => {
      return response.text();
    })
    .then((content) => {
      this.setState({ content });
      ReactDOM.findDOMNode(this).dispatchEvent(new Event('load'));
    })
    .catch((e) => {
      const content = e.message;
      this.setState({ content });
    });
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this).addEventListener('load', this.props.onLoad);
  }

  componentWillUnmount() {
    ReactDOM.findDOMNode(this).removeEventListener('load', this.props.onLoad);
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
      <div className="text-viewer" >
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
};

TextViewer.defaultProps = {
  type: 'text',
  format: 'plain',
  onLoad: (e) => { console.log('text loaded', e); },
};

export default TextViewer;
