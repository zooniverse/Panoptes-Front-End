import PropTypes from 'prop-types';
import React from 'react';
import { Markdown } from 'markdownz';
import { browserHistory } from 'react-router';

class WrappedMarkdown extends React.Component {
  static propTypes = {
    content: PropTypes.string,
    project: PropTypes.object,
    header: PropTypes.string,
  };

  onClick = (e) => {
    const rightButtonPressed = (!!e.button && e.button > 0);
    const modifierKey = (e.ctrlKey || e.metaKey);
    const hasNamedTarget = e.target.target;
    if (e.target.origin === window.location.origin &&
      e.target.pathname !== window.location.pathname &&
      !rightButtonPressed &&
      !modifierKey &&
      !hasNamedTarget) {
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