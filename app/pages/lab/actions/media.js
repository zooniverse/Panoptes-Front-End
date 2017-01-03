const apiClient = require('panoptes-client/lib/api-client');
const putFile = require('../../../lib/put-file');

const mediaActions = {
  fetchMedia(props = this.props) {
    console.log(props);
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
  },

  handleDrop(event) {
    this.addFiles(Array.prototype.slice.call(event.dataTransfer.files));
  },

  handleDelete() {
    console.log('Refreshing media area');
    this.props.onDelete(...arguments);
    this.fetchMedia();
  },

  handleFileSelection(event) {
    console.log(`Handling ${event.target.files.length} selected files`);
    this.addFiles(Array.prototype.slice.call(event.target.files));
  },

  addFiles(files) {
    console.log(`Adding ${files.length} files`);
    this.setState({ errors: [] });
    files.forEach(this.addFile);
  },

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
  },

  createLinkedResource(file, location = this.props.resource._getURL(this.props.link)) {
    console.log(`Creating resource for ${file.name}, ${(file.type)}`);
    const payload = {
      media: {
        content_type: file.type,
        metadata: Object.assign({ filename: file.name }, this.props.metadata),
      },
    };

    return apiClient.post(location, payload)
      .then((media) => {
        // We get an array here for some reason. Pull the resource out.
        // TODO: Look into this.
        const medium = [].concat(media)[0];
        const pendingMedia = this.state.pendingMedia;
        pendingMedia.push(medium);
        this.setState({ pendingMedia });
        return medium;
      });
  },

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
  },

  handleSuccess(medium) {
    console.log(`Success! ${medium.metadata.filename}`);
    const pendingMedia = this.state.pendingMedia;
    const pendingMediaIndex = pendingMedia.indexOf(medium);
    pendingMedia.splice(pendingMediaIndex, 1);
    this.setState({ pendingMedia });
    this.props.onAdd(medium);
    return medium;
  },

  handleError(file, error) {
    console.log(`Got error ${error.message} for ${file.name}`);
    const errors = this.state.errors;
    errors.push({ file, error });
    this.setState({ errors });
  },

  removeFromPending(file) {
    console.log(`No longer pendingFiles: ${file.name}`);
    const pendingFiles = this.state.pendingFiles;
    const pendingFileIndex = pendingFiles.indexOf(file);
    pendingFiles.splice(pendingFileIndex, 1);
    this.setState({ pendingFiles });
  }
};

module.exports = mediaActions;
