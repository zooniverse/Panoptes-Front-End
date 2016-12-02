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
      const e = new Event('load');
      e.target = ReactDOM.findDOMNode(this);
      this.props.onLoad(e);
    })
    .catch((e) => {
      const content = e.message;
      this.setState({ content });
    });
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
      <div>
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
  onLoad: () => { return new Event('load'); },
};

export default TextViewer;
