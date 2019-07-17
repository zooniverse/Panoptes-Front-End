var apiClient = require('panoptes-client/lib/api-client');
var counterpart = require('counterpart');

var projects = apiClient.type('projects');

var projectActions = {
  createProject: function(projectData) {
    var allProjectData = Object.assign({
      primary_language: counterpart.getLocale(),
      private: true
    }, projectData);

    return projects.create(allProjectData)
      .save()
      .then(function (projectResource) {
        apiClient.post(projectResource._getURL('pages'), {
          project_pages: {
            language: projectResource.primary_language,
            title: 'Volunteers',
            url_key: 'volunteers',
          }
        })
        .catch(function(error) {
          console.error(error)
        })
        return projectResource
      })

  }
}

module.exports = projectActions;
