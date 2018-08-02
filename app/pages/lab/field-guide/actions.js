var apiClient = require('panoptes-client/lib/api-client');
var putFile = require('../../../lib/put-file');

var projects = apiClient.type('projects');
var guides = apiClient.type('field_guides');

var actions = {
  createGuide: function(projectID) {
    var newGuide = {
      items: [],
      language: 'en',
      links: {project: projectID}
    };
    return guides.create(newGuide).save();
  },

  deleteGuide: function(guideID) {
    return guides.get(guideID, {}).then(function(guide) {
      return guide.delete();
    });
  },

  replaceItems: function(guideID, items) {
    return guides.get(guideID, {}).then(function(guide) {
      guide.update({
        _busy: true,
        items: items
      });
      return guide.save();
    }).then(function(guide) {
      guide.update({
        _busy: false
      });
    });
  },

  updateItem: function(guideID, itemIndex, changes) {
    return guides.get(guideID, {}).then(function(guide) {
      Object.assign(guide.items[itemIndex], changes);
      guide.update({
        _busy: true,
        items: guide.items
      });
      return guide.save();
    }).then(function(guide) {
      guide.update({
        _busy: false
      });
      return guide;
    });
  },

  removeItemIcon: function(guideID, itemIndex) {
    return guides.get(guideID, {}).then(function(guide) {
      guide.update({
        _busy: true
      });

      guide.get('attached_images').then(function(images) {
        var matchedImage = images.filter(function(image) {
          return image.id === guide.items[itemIndex].icon;
        })[0];

        var changes = {};
        changes['items.' + itemIndex + '.icon'] = ''
        guide.update(changes);

        return Promise.all([
          matchedImage.delete(),
          guide.save()
        ]).then(function() {
          guide.update({
            _busy: false
          });
        });
      });
    });
  },

  setItemIcon: function(guideID, itemIndex, iconFile) {
    return guides.get(guideID, {}).then(function(guide) {
      guide.update({
        _busy: true
      });

      var awaitPossibleRemoval;
      if (guide.items[itemIndex].icon) {
        awaitPossibleRemoval = actions.removeItemIcon(guideID, itemIndex);
      } else {
        awaitPossibleRemoval = Promise.resolve();
      }

      var attachedImagesURL = guide._getURL('attached_images');

      var payload = {
        media: {
          content_type: iconFile.type,
          metadata: {
            filename: iconFile.name
          }
        }
      };

      return awaitPossibleRemoval.then(function() {
        apiClient.post(attachedImagesURL, payload).then(function(media) {
          media = [].concat(media)[0];
          return putFile(media.src, iconFile, {'Content-Type': iconFile.type}).then(function() {
            var changes = {}
            changes['items.' + itemIndex + '.icon'] = media.id;
            guide.update(changes);

            return guide.save().then(function() {
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

  appendItem: function(guideID) {
    var newItem = {};
    return guides.get(guideID, {}).then(function(guide) {
      guide.items.push(newItem);
      guide.update({
        _busy: true,
        items: guide.items
      });
      return guide.save();
    }).then(function(guide) {
      guide.update({
        _busy: false
      });
      return guide;
    });
  },

  removeItem: function(guideID, itemIndex) {
    return guides.get(guideID, {}).then(function(guide) {
      guide.items.splice(itemIndex, 1);
      guide.update({
        _busy: true,
        items: guide.items
      });
      return guide.save();
    }).then(function(guide) {
      guide.update({
        _busy: false
      });
      return guide;
    });
  }
};

module.exports = actions;
