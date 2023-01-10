import apiClient from 'panoptes-client/lib/api-client';
import putFile from '../../../lib/put-file.js';

const projects = apiClient.type('projects');
const guides = apiClient.type('field_guides');

var actions = {
  createGuide(projectID) {
    const newGuide = {
      items: [],
      language: 'en',
      links: { project: projectID }
    };
    return guides.create(newGuide).save();
  },

  deleteGuide(guideID) {
    return guides.get(guideID, {}).then(guide => guide.delete());
  },

  replaceItems(guideID, items) {
    return guides.get(guideID, {}).then((guide) => {
      guide.update({
        _busy: true,
        items
      });
      return guide.save();
    }).then((guide) => {
      guide.update({
        _busy: false
      });
    });
  },

  updateItem(guideID, itemIndex, changes) {
    return guides.get(guideID, {}).then((guide) => {
      Object.assign(guide.items[itemIndex], changes);
      guide.update({
        _busy: true,
        items: guide.items
      });
      return guide.save();
    }).then((guide) => {
      guide.update({
        _busy: false
      });
      return guide;
    });
  },

  removeItemIcon(guideID, itemIndex) {
    return guides.get(guideID, {}).then((guide) => {
      guide.update({
        _busy: true
      });

      guide.get('attached_images').then((images) => {
        const matchedImage = images.filter(image => image.id === guide.items[itemIndex].icon)[0];

        const changes = {};
        changes[`items.${itemIndex}.icon`] = '';
        guide.update(changes);

        return Promise.all([
          matchedImage.delete(),
          guide.save()
        ]).then(() => {
          guide.update({
            _busy: false
          });
        });
      });
    });
  },

  setItemIcon(guideID, itemIndex, iconFile) {
    return guides.get(guideID, {}).then((guide) => {
      guide.update({
        _busy: true
      });

      let awaitPossibleRemoval;
      if (guide.items[itemIndex].icon) {
        awaitPossibleRemoval = actions.removeItemIcon(guideID, itemIndex);
      } else {
        awaitPossibleRemoval = Promise.resolve();
      }

      const attachedImagesURL = guide._getURL('attached_images');

      const payload = {
        media: {
          content_type: iconFile.type,
          metadata: {
            filename: iconFile.name
          }
        }
      };

      return awaitPossibleRemoval.then(() => {
        apiClient.post(attachedImagesURL, payload).then((media) => {
          media = [].concat(media)[0];
          return putFile(media.src, iconFile, { 'Content-Type': iconFile.type }).then(() => {
            const changes = {};
            changes[`items.${itemIndex}.icon`] = media.id;
            guide.update(changes);

            return guide.save().then(() => {
              guide.update({
                _busy: false
              });
              return guide;
            });
          });
        });
      });
    });
  },

  appendItem(guideID) {
    const newItem = {};
    return guides.get(guideID, {}).then((guide) => {
      guide.items.push(newItem);
      guide.update({
        _busy: true,
        items: guide.items
      });
      return guide.save();
    }).then((guide) => {
      guide.update({
        _busy: false
      });
      return guide;
    });
  },

  removeItem(guideID, itemIndex) {
    return guides.get(guideID, {}).then((guide) => {
      guide.items.splice(itemIndex, 1);
      guide.update({
        _busy: true,
        items: guide.items
      });
      return guide.save();
    }).then((guide) => {
      guide.update({
        _busy: false
      });
      return guide;
    });
  }
};

module.exports = actions;
