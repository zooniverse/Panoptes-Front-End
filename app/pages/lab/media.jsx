import React from 'react';
import MediaArea from './media-area';

export default class EditMediaPage extends React.Component {
  constructor(props) {
    super(props);

    this.renderValidExtensions = this.renderValidExtensions.bind(this);
  }

  renderValidExtensions() {
    return this.props.validSubjectExtensions.map((ext, i) => {
      const codeMarkup = <code key={ext}>{ext}</code>;
      if (this.props.validSubjectExtensions[i + 1]) {
        return <span key={ext}><code>{ext}</code>,{' '}</span>;
      }

      return codeMarkup;
    });
  }

  render() {
    return (
      <div className="edit-media-page">
        <div className="content-container">
          <p>
            <strong>You can add images here to use in your project’s content.</strong><br />
            Just copy and paste the image’s Markdown code: <code>![title](url)</code>. Images can be any of: {this.renderValidExtensions()} </p>
          <MediaArea resource={this.props.project} />
        </div>
      </div>
    );
  }
}

EditMediaPage.defaultProps = {
  project: {},
  validSubjectExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.svg'],
};

EditMediaPage.propTypes = {
  project: React.PropTypes.object,
  validSubjectExtensions: React.PropTypes.arrayOf(React.PropTypes.string),
};
