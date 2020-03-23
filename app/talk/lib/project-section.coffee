# takes in a project id and returns a correctly formatted talk section for that project

module.exports = (project) -> 
  type = project._type._name
  switch type
    when 'organizations' then "org-#{project.id}"
    when 'projects' then "project-#{project.id}"
