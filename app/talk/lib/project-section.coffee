# takes in a project id and returns a correctly formatted talk section for that project

module.exports = (project) -> "project-#{project.id}"
