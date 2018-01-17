import React from 'react';
import { Markdown } from 'markdownz';
import { browserHistory } from 'react-router';

class WrappedMarkdown extends React.Component {
  static propTypes = {
    content: React.PropTypes.string,
    project: React.PropTypes.object,
    header: React.PropTypes.string,
  };

  onClick = (e) => {
    const rightButtonPressed = (!!e.button && e.button > 0);
    const modifierKey = (e.ctrlKey || e.metaKey);
    if (e.target.origin === window.location.origin &&
      e.target.pathname !== window.location.pathname &&
      !rightButtonPressed &&
      !modifierKey) {
      const newURL = e.target.pathname + e.target.search + e.target.hash;
      browserHistory.push(newURL);
      e.preventDefault();
    }
  };

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
  }
}

export default WrappedMarkdown;
