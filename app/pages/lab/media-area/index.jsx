import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import MediaAreaView from './media-area-view';
import putFile from '../../../lib/put-file';

export default class MediaAreaController extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      media: null,
      pendingFiles: [],
      pendingMedia: [],
    };

    this.fetchMedia = this.fetchMedia.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleFileSelection = this.handleFileSelection.bind(this);
    this.addFiles = this.addFiles.bind(this);
    this.addFile = this.addFile.bind(this);
    this.createLinkedResource = this.createLinkedResource.bind(this);
    this.uploadMedia = this.uploadMedia.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleError = this.handleError.bind(this);
    this.removeFromPending = this.removeFromPending.bind(this);
  }

  componentDidMount() {
    this.fetchMedia();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.resource !== nextProps.resource) {
      this.fetchMedia(nextProps);
    }
  }

  fetchMedia(props = this.props) {
    this.setState({ media: null });

    return props.resource.get(this.props.link, { page_size: this.props.pageSize })
      .then((media) => {
        return media.filter((medium) => {
          return Object.keys(medium.metadata).length > 0;
        });
      })
      .then((filteredMedia) => {
        this.setState({ media: filteredMedia });
      }).catch((error) => { return []; });
  }

  handleDrop(event) {
    this.addFiles(Array.prototype.slice.call(event.dataTransfer.files));
  }

  handleDelete() {
    console.log('Refreshing media area');
    this.props.onDelete(...arguments);
    this.fetchMedia();
  }

  handleFileSelection(event) {
    console.log(`Handling ${event.target.files.length} selected files`);
    this.addFiles(Array.prototype.slice.call(event.target.files));
  }

  addFiles(files) {
    console.log(`Adding ${files.length} files`);
    this.setState({ errors: [] });
    files.forEach(this.addFile);
  }

  addFile(file) {
    console.log(`Adding media ${file.name}`);
    const pendingFiles = this.state.pendingFiles;
    pendingFiles.push(file);
    this.setState({ pendingFiles });

    return this.createLinkedResource(file)
      .then(this.uploadMedia.bind(this, file))
      .then(this.handleSuccess)
      .catch(this.handleError.bind(this, file))
      .then(this.removeFromPending.bind(this, file))
      .then(this.fetchMedia);
  }

  createLinkedResource(file) {
    console.log(`Creating resource for ${file.name}, ${(file.type)}`);
    const payload = {
      media: {
        content_type: file.type,
        metadata: Object.assign({ filename: file.name }, this.props.metadata),
      },
    };

    return apiClient.post(this.props.resource._getURL(this.props.link), payload)
      .then((media) => {
        // We get an array here for some reason. Pull the resource out.
        // TODO: Look into this.
        const medium = [].concat(media)[0];
        const pendingMedia = this.state.pendingMedia;
        pendingMedia.push(medium);
        this.setState({ pendingMedia });
        return medium;
      });
  }

  uploadMedia(file, medium) {
    console.log(`Uploading ${file.name} => ${medium.src}`);
    return putFile(medium.src, file, { 'Content-Type': file.type })
      .then(() => {
        return medium.refresh().then((media) => {
          // Another weird array.
          return ([].concat(media)[0]);
        });
      }).catch((error) => {
        return medium.delete()
          .then(() => {
            throw error;
          });
      });
  }

  handleSuccess(medium) {
    console.log(`Success! ${medium.metadata.filename}`);
    const pendingMedia = this.state.pendingMedia;
    const pendingMediaIndex = pendingMedia.indexOf(medium);
    pendingMedia.splice(pendingMediaIndex, 1);
    this.setState({ pendingMedia });
    this.props.onAdd(medium);
    return medium;
  }

  handleError(file, error) {
    console.log(`Got error ${error.message} for ${file.name}`);
    const errors = this.state.errors;
    errors.push({ file, error });
    this.setState({ errors });
  }

  removeFromPending(file) {
    console.log(`No longer pendingFiles: ${file.name}`);
    const pendingFiles = this.state.pendingFiles;
    const pendingFileIndex = pendingFiles.indexOf(file);
    pendingFiles.splice(pendingFileIndex, 1);
    this.setState({ pendingFiles });
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
};

MediaAreaController.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  link: React.PropTypes.string,
  metadata: React.PropTypes.object,
  onAdd: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  pageSize: React.PropTypes.number,
  resource: React.PropTypes.shape({
    _getURL: React.PropTypes.func,
    get: React.PropTypes.func,
  }).isRequired,
  style: React.PropTypes.object,
};
