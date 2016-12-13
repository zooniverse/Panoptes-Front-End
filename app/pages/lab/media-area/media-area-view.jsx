import React from 'react';
import DragAndDropTarget from './drag-and-drop-target';
import FileButton from '../../../components/file-button';
import MediaIcon from './media-icon';

export default class MediaAreaView extends React.Component {
  constructor(props) {
    super(props);

    this.renderMediaList = this.renderMediaList.bind(this);
  }

  renderMediaList() {
    return this.props.media.map((medium) => {
      if (this.props.pendingMedia.includes(medium)) {
        return null;
      }

      return (
        <li key={medium.id} className="media-area-item">
          <MediaIcon resource={medium} onDelete={this.props.onDelete} />
        </li>
      );
    });
  }

  render() {
    const addButtonStyle = {
      height: '80px',
      lineHeight: '100px',
      width: '100px',
    };

    return (
      <div
        className={`media-area ${this.props.className}`.trim()}
        style={Object.assign({ position: 'relative' }, this.props.style)}
      >
        <DragAndDropTarget
          style={{
            bottom: '3px',
            left: '3px',
            position: 'absolute',
            right: '3px',
            top: '3px',
          }}
          onDrop={this.props.onDrop}
        />

        {(this.props.media && this.props.media.length === 0) ? <small><em>No media</em></small> : null}

        <ul className="media-area-list">
          {this.props.media && this.renderMediaList()}

          <li className="media-area-item" style={{ alignSelf: 'stretch' }}>
            <div className="media-icon">
              <FileButton
                className="media-area-add-button"
                accept="image/*"
                multiple
                style={addButtonStyle}
                onSelect={this.props.onSelect}
              >
                <i className="fa fa-plus fa-3x" />
              </FileButton>
              <div className="media-icon-label">Select files</div>
            </div>
          </li>
        </ul>

        {this.props.children && <hr />}
        {this.props.children}

        {(this.props.pendingFiles.length !== 0) ? <hr /> : null}
        {this.props.pendingFiles.map((file) => {
          return (
            <div key={file.name}>
              <small>
                <i className="fa fa-spinner fa-spin" />{' '}
                <strong>{file.name}</strong>
              </small>
            </div>
          );
        })}

        {this.props.errors.length !== 0 && <hr />}
        {this.props.errors.map(({ file, error }) => {
          return (<div key={file.name}>{error.toString()} ({file.name})</div>);
        })}
      </div>
    );
  }
}

MediaAreaView.defaultProps = {
  children: null,
  className: '',
  errors: [],
  media: [],
  onDelete: () => {},
  onDrop: () => {},
  onSelect: () => {},
  pendingFiles: [],
  pendingMedia: [],
  style: {},
};

MediaAreaView.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  errors: React.PropTypes.array,
  media: React.PropTypes.arrayOf(React.PropTypes.object),
  onDelete: React.PropTypes.func,
  onDrop: React.PropTypes.func,
  onSelect: React.PropTypes.func,
  pendingFiles: React.PropTypes.array,
  pendingMedia: React.PropTypes.array,
  style: React.PropTypes.object,
};