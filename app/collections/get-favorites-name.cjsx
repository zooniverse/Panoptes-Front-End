# Get the name of the favorites collection for a project
module?.exports = (project) ->
  #--> Naming Convention: "Favorites for #{project_id}"
  #    Prevents global uniqueness validation conflict under project scope
  name = "Favorites"
  name += " (#{project.slug})" if project?
  name
