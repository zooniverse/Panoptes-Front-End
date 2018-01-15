import PropTypes from 'prop-types';
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
  actions: PropTypes.shape({
    fetchMedia: PropTypes.func,
    handleDrop: PropTypes.func,
    handleDelete: PropTypes.func,
    handleFileSelection: PropTypes.func,
    addFiles: PropTypes.func,
    handleFile: PropTypes.func,
    addFile: PropTypes.func,
    createLinkedResource: PropTypes.func,
    uploadMedia: PropTypes.func,
    handleSuccess: PropTypes.func,
    handleError: PropTypes.func,
    removeFromPending: PropTypes.func
  }),
  children: PropTypes.node,
  className: PropTypes.string,
  link: PropTypes.string,
  metadata: PropTypes.object,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  pageSize: PropTypes.number,
  resource: PropTypes.shape({
    _getURL: PropTypes.func,
    get: PropTypes.func
  }).isRequired,
  style: PropTypes.object
};