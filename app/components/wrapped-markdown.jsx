import React from 'react';
import markdownz from 'markdownz';
import { browserHistory } from 'react-router';
const Markdown = markdownz.Markdown;

const WrappedMarkdown = React.createClass({
  propTypes: {
    content: React.PropTypes.string,
    project: React.PropTypes.object,
    header: React.PropTypes.string,
  },

  onClick(e) {
    if (e.target.origin === window.location.origin) {
      const newURL = e.target.pathname + e.target.search + e.target.hash;
      browserHistory.push(newURL);
      e.preventDefault();
    }
  },

  render() {
    return (
      <div onClick={this.onClick}>
        <Markdown
          content={this.props.content}
          project={this.props.project}
          header={this.props.header}
        />
      </div>
    );
  },
});

export default WrappedMarkdown;
