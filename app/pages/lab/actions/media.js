import apiClient from 'panoptes-client/lib/api-client';
import putFile from '../../../lib/put-file.js';

// warn on uploads bigger than 500k
const MAX_FILE_SIZE = 500 * 1024;
const ALLOWED_TYPES = ['image', 'audio', 'video'];

const mediaActions = {
  fetchMedia(props = this.props, page = 1) {
    this.setState({ media: null, page });

    const page_size = props.pageSize;

    return props.resource.get(props.link, { page, page_size })
      .then((media) => {
        const meta = media.length ? media[0].getMeta() : {}; // Derive the paging metadata for all the media, from the first media item.
        const filteredMedia = media.filter(medium => Object.keys(medium.metadata).length > 0);

        return {
          page_count: meta.page_count || 1,
          media: filteredMedia
        };
      }).catch((error) => {
        console.error(error);
        return {
          page_count: 1,
          media: []
        };
      }).then((data) => {
        this.setState(data);
      });
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
    files.filter((file) => {
      const [type, format] = file.type.split('/');
      return ALLOWED_TYPES.includes(type);
    }).forEach(this.addFile);
  },

  addFile(file) {
    console.log(`Adding media ${file.name}`);
    const pendingFiles = this.state.pendingFiles;
    const uploadSize = parseInt(file.size / 1024);
    const maxSize = parseInt(MAX_FILE_SIZE / 1024);
    const shouldUpload = (file.size < MAX_FILE_SIZE) || window.confirm(`This file is ${uploadSize}kB. Large files will make your project slow to load for volunteers. We recommend keeping your files smaller than ${maxSize}kB. Continue to upload ${file.name}?`);
    if (shouldUpload) {
      pendingFiles.push(file);
      this.setState({ pendingFiles });
      return this.createLinkedResource(file)
        .then(this.uploadMedia.bind(this, file))
        .then(this.handleSuccess)
        .catch(this.handleError.bind(this, file))
        .then(this.removeFromPending.bind(this, file))
        .then(this.fetchMedia);
    }
  },

  createLinkedResource(file, location = this.props.resource._getURL(this.props.link)) {
    console.log(`Creating resource for ${file.name}, ${(file.type)}`);
    const content_type = file.type === 'audio/mp3' ? 'audio/mpeg' : file.type;
    const payload = {
      media: {
        content_type,
        metadata: Object.assign({ filename: file.name, size: file.size }, this.props.metadata)
      }
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
    const content_type = file.type === 'audio/mp3' ? 'audio/mpeg' : file.type;
    return putFile(medium.src, file, { 'Content-Type': content_type })
      .then(() => ( // Another weird array.
                  medium.refresh().then((media) => ( ([].concat(media)[0]))
              )
                                                                                 )
                                         )
            )).catch(error => ( medium.delete()
        .then(() => ( {
          throw error;
        }));
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

export default mediaActions;
