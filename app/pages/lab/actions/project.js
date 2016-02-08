var apiClient = require('panoptes-client/lib/api-client');
var counterpart = require('counterpart');

var projects = apiClient.type('projects');

var projectActions = {
  createProject: function(projectData) {
    var allProjectData = Object.assign({
      primary_language: counterpart.getLocale(),
      private: true
    }, projectData);

    return projects.create(allProjectData).save();
  }
}

module.exports = projectActions;
