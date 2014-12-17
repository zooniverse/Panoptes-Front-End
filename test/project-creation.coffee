test = require 'blue-tape'
auth = require '../app/api/auth'
apiClient = require '../app/api/client'

# We need to be logged in to test this stuff.
USER_DATA = {}
USER_DATA.login = 'TEST_' + (new Date).toISOString().replace /\W/g, '_'
USER_DATA.email = USER_DATA.login.toLowerCase() + '@zooniverse.org'
USER_DATA.password = 'p@$$word'

LANGUAGE = 'en-us'

PROJECT_DATA =
  primary_language: LANGUAGE
  display_name: "Project Awesome: #{(new Date).toLocaleString()}"
  introduction: 'Projects. Are they awesome?'
  description: 'Everyone knows projects are awesome. Does the science back it up? Help us test our hypothesis blah blah blah...'
  science_case: 'We hope to prove once and for all the awesomeness of projects. We’ll publish a paper in blah blah blah...'

SUBJECT_SET_DATA =
  display_name: "Subject set for #{PROJECT_DATA.display_name}"

SUBJECT_DATA =
  locations: ['image/jpeg']

  metadata:
    latitude: 41.87
    longitude: -87.63

WORKFLOW_DATA =
  display_name: "Workflow for #{PROJECT_DATA.display_name}"
  tasks:
    hot_or_not:
      type: 'single'
      question: 'Hot or not?'
      answers: [
        {value: true, label: 'OMG so hot!'}
        {value: false, label: 'Not very hot at all.'}
      ]
  primary_language: LANGUAGE

projects = apiClient.createType 'projects'
workflows = apiClient.createType 'workflows'
subjects = apiClient.createType 'subjects'
subjectSets = apiClient.createType 'subject_sets'

# Save resources in an accessible scope.
resources = {}

test 'Create a temporary user', ->
  auth.register(USER_DATA).then (user) ->
    resources.user = user

test 'Create a project', (t) ->
  projects.createResource(PROJECT_DATA).save().then (project) ->
    resources.project = project
    t.ok project?, 'Responded with a project resource'
    t.ok project?.id, 'Project got an ID'

    project.update

test 'Create a subject set',  (t) ->
  subjectSetData = Object.create SUBJECT_SET_DATA
  subjectSetData.links =
    project: resources.project.id

  subjectSets.createResource(subjectSetData).save().then (subjectSet) ->
    resources.subjectSet = subjectSet
    t.ok subjectSet?, 'Responded with a subject set resource'
    t.ok subjectSet?.id, 'Subject set got an ID'

    subjectSet.attr('project').then (subjectSetProject) ->
      t.ok subjectSetProject?, 'Subject set is linked to a project'
      t.equal subjectSetProject?.id, resources.project.id, 'Subject set project is the one specified'

test 'Create a subject', (t) ->
  subjectData = Object.create SUBJECT_DATA
  subjectData.links =
    project: resources.project.id

  subjects.createResource(subjectData).save().then (subject) ->
    resources.subject = subject
    t.ok subject?, 'Responded with a subject'
    t.ok subject?.id?, 'Subject got an ID'
    t.ok subject?.locations[0]['image/jpeg'].indexOf('http') isnt -1, 'Subject got a place to PUT its JPEG'

test 'Create a workflow', (t) ->
  workflowData = Object.create WORKFLOW_DATA
  workflowData.links =
    project: resources.project.id
    subject_sets: [resources.subjectSet.id]

  workflows.createResource(workflowData).save().then (workflow) ->
    resources.workflow = workflow
    t.ok workflow?, 'Responded with a workflow resource'
    t.ok workflow?.id, 'Workflow got an ID'

    workflow.attr('project').then (workflowProject) ->
      t.ok workflowProject?, 'Workflow is linked to a project'
      t.equal workflowProject?.id, resources.project.id, 'Workflow project is the one specified'

    workflow.attr('subject_sets').then (workflowSubjectSets) ->
      t.equal workflowSubjectSets?.length, 1, 'Workflow is linked to one subject set'
      t.equal workflowSubjectSets?[0]?.id, resources.subjectSet.id, 'Workflow subject set is the one specified'

test 'Delete temporary user', ->
  resources.user.delete()
