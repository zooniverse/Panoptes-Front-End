import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import MediaAreaView from './media-area-view';
import putFile from '../../../lib/put-file';
import mediaActions from '../actions/media';

export default class MediaAreaController extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      media: null,
      pendingFiles: [],
      pendingMedia: []
    };

    this.fetchMedia = this.props.actions.fetchMedia.bind(this);
    this.handleDrop = this.props.actions.handleDrop.bind(this);
    this.handleDelete = this.props.actions.handleDelete.bind(this);
    this.handleFileSelection = this.props.actions.handleFileSelection.bind(this);
    this.addFiles = this.props.actions.addFiles.bind(this);
    this.addFile = this.props.actions.addFile.bind(this);
    this.createLinkedResource = this.props.actions.createLinkedResource.bind(this);
    this.uploadMedia = this.props.actions.uploadMedia.bind(this);
    this.handleSuccess = this.props.actions.handleSuccess.bind(this);
    this.handleError = this.props.actions.handleError.bind(this);
    this.removeFromPending = this.props.actions.removeFromPending.bind(this);
  }

  componentDidMount() {
    this.fetchMedia();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.resource !== nextProps.resource) {
      this.fetchMedia(nextProps);
    }
  }

  render() {
    return (
      <MediaAreaView
        className={this.props.className}
        errors={this.state.errors}
        media={this.state.media}
        onDelete={this.handleDelete}
        onDrop={this.handleDrop}
        onSelect={this.handleFileSelection}
        pendingFiles={this.state.pendingFiles}
        pendingMedia={this.state.pendingMedia}
        style={this.props.style}
      >
        {this.props.children}
      </MediaAreaView>
    );
  }
}

MediaAreaController.defaultProps = {
  children: null,
  className: '',
  link: 'attached_images',
  metadata: {},
  onAdd: () => {},
  onDelete: () => {},
  pageSize: 200,
  resource: null,
  style: {},
  actions: mediaActions
};

MediaAreaController.propTypes = {
  actions: React.PropTypes.shape({
    fetchMedia: React.PropTypes.func,
    handleDrop: React.PropTypes.func,
    handleDelete: React.PropTypes.func,
    handleFileSelection: React.PropTypes.func,
    addFiles: React.PropTypes.func,
    handleFile: React.PropTypes.func,
    addFile: React.PropTypes.func,
    createLinkedResource: React.PropTypes.func,
    uploadMedia: React.PropTypes.func,
    handleSuccess: React.PropTypes.func,
    handleError: React.PropTypes.func,
    removeFromPending: React.PropTypes.func
  }),
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  link: React.PropTypes.string,
  metadata: React.PropTypes.object,
  onAdd: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  pageSize: React.PropTypes.number,
  resource: React.PropTypes.shape({
    _getURL: React.PropTypes.func,
    get: React.PropTypes.func
  }).isRequired,
  style: React.PropTypes.object
};
