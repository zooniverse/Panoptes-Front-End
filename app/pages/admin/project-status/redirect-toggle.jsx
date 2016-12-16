import React, { Component } from 'react';
import AutoSave from '../../../components/auto-save';
import handleInputChange from '../../../lib/handle-input-change';

class RedirectToggle extends Component {
  constructor(props) {
    super(props);
    this.validUrlMessage = this.validUrlMessage.bind(this);
    this.updateRedirect = this.updateRedirect.bind(this);
    this.state = {
      error: null
    };
  }

  validUrlMessage() {
    if (this.state.error === this.props.invalidUrl) {
      return 'Invalid URL - must be in https?://format';
    }
    return '';
  }

  updateRedirect(e) {
    const redirectUrl = this.redirectUrl.value;
    const isValidUrl = redirectUrl && redirectUrl.match(this.props.validUrlRegex);

    if (isValidUrl || redirectUrl === '') {
      this.setState({ error: null });
      handleInputChange.call(this.props.project, e);
    } else {
      this.setState({ error: this.props.invalidUrl });
    }
  }

  render() {
    return (
      <div className="project-status__section">
        <h4>Project Redirect</h4>
        <AutoSave resource={this.props.project}>
          <input
            type="text"
            name="redirect"
            ref={(c) => { this.redirectUrl = c; }}
            value={this.props.project.redirect}
            placeholder="External redirect"
            onBlur={this.updateRedirect}
            onChange={handleInputChange.bind(this.props.project)}
          />
          <span>{ this.validUrlMessage() }</span>
        </AutoSave>
      </div>
    );
  }
}

RedirectToggle.propTypes = {
  project: React.PropTypes.object.isRequired,
  invalidUrl: React.PropTypes.string,
  validUrlRegex: React.PropTypes.object // regex
};

RedirectToggle.defaultProps = {
  project: null,
  validUrlRegex: /https?:\/\/[\w-]+(\.[\w-]*)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/,
  invalidUrl: 'invalidUrl'
};

export default RedirectToggle;
