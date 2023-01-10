const apiClient = require('panoptes-client/lib/api-client');
const counterpart = require('counterpart');

const projects = apiClient.type('projects');

const projectActions = {
  createProject(projectData) {
    const allProjectData = Object.assign({
      primary_language: counterpart.getLocale(),
      private: true
    }, projectData);

    return projects.create(allProjectData).save();
  }
};

module.exports = projectActions;
