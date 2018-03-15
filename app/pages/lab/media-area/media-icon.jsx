import PropTypes from 'prop-types';
import React from 'react';
import TriggeredModalForm from 'modal-form/triggered';
import Thumbnail from '../../../components/thumbnail';

export default class MediaIcon extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deleting: false,
    };

    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    console.log(`Deleting media resource ${this.props.resource.id}`);
    this.setState({ deleting: true });
    this.props.resource.delete().then(() => {
      this.setState({ deleting: false });
      this.props.onDelete(this.props.resource);
    });
  }

  render() {
    const mediaIconStyle = this.state.deleting ? { opacity: 0.5 } : null;
    const { content_type } = this.props.resource;
    const format = content_type.split('/')[0];
    let mediaElement;
    switch (format) {
      case 'audio':
        mediaElement = <audio controls src={this.props.resource.src} />;
        break;
      case 'video':
        mediaElement = <video controls src={this.props.resource.src} style={{ maxHeight: '80vh', maxWidth: '60vw' }} />;
        break;
      default:
        mediaElement = 
          <TriggeredModalForm trigger={
            <Thumbnail
              className="media-icon-thumbnail"
              format={format}
              src={this.props.resource.src}
              height={this.props.height}
              style={{ position: 'relative' }}
            />
          }>
            <div className="content-container">
              <img alt="" src={this.props.resource.src} style={{ maxHeight: '80vh', maxWidth: '60vw' }} />
            </div>
          </TriggeredModalForm>;
    }

    return (
      <div className="media-icon" style={mediaIconStyle}>
        <div className="media-icon-thumbnail-container">
          {mediaElement}
          <button type="button" className="media-icon-delete-button" disabled={this.state.deleting} onClick={this.handleDelete}>&times;</button>
        </div>
        {this.props.resource.metadata &&
          <div>
            <span className="media-icon-label" style={{ position: 'relative' }}>{this.props.resource.metadata.filename}</span>
            <textarea
              className="media-icon-markdown"
              value={`![${this.props.resource.metadata.filename}](${this.props.resource.src})`}
              readOnly
              style={{ position: 'relative' }}
              onFocus={(e) => { e.target.setSelectionRange(0, e.target.value.length); }}
            />
          </div>}
      </div>
    );
  }
}

MediaIcon.defaultProps = {
  height: 80,
  onDelete: () => {},
  resource: null,
};

MediaIcon.propTypes = {
  height: PropTypes.number,
  onDelete: PropTypes.func,
  resource: PropTypes.shape({
    delete: PropTypes.func,
    id: PropTypes.string,
    metadata: PropTypes.object,
    src: PropTypes.string,
  }),
};