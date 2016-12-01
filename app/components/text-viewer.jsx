import React, { Component } from 'react';

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
    })
    .catch((e) => {
      const content = e.message;
      this.setState({ content });
    });
  }

  render() {
    return (
      <div>
        {this.state.content}
      </div>
    );
  }
}

TextViewer.propTypes = {
  src: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  format: React.PropTypes.string.isRequired,
  onLoad: React.PropTypes.func.isRequired,
};

export default TextViewer;
