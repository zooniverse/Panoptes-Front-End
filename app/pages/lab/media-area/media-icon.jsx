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

    return (
      <div className="media-icon" style={mediaIconStyle}>
        <div className="media-icon-thumbnail-container">
          <TriggeredModalForm trigger={
            <Thumbnail className="media-icon-thumbnail" src={this.props.resource.src} height={this.props.height} style={{ position: 'relative' }} />
          }>
            <div className="content-container">
              <img alt="" src={this.props.resource.src} style={{ maxHeight: '80vh', maxWidth: '60vw' }} />
            </div>
          </TriggeredModalForm>
          <button type="button" className="media-icon-delete-button" disabled={this.state.deleting} onClick={this.handleDelete}>&times;</button>
        </div>
        <div className="media-icon-label" style={{ position: 'relative' }}>{this.props.resource.metadata.filename}</div>
        {this.props.resource.metadata &&
          <textarea
            className="media-icon-markdown"
            value={`![${this.props.resource.metadata.filename}(${this.props.resource.src})`}
            readOnly
            style={{ position: 'relative' }}
            onFocus={(e) => { return (e.target.setSelectionRange(0, e.target.value.length)); }}
          />}
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
  height: React.PropTypes.number,
  onDelete: React.PropTypes.func,
  resource: React.PropTypes.shape({
    delete: React.PropTypes.func,
    id: React.PropTypes.string,
    metadata: React.PropTypes.object,
    src: React.PropTypes.string,
  }),
};
