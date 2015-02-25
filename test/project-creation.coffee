test = require 'blue-tape'
auth = require '../app/api/auth'
apiClient = require '../app/api/client'

# We need to be logged in to test this stuff.
USER_DATA = {}
USER_DATA.display_name = 'TEST_' + (new Date).toISOString().replace /\W/g, '_'
USER_DATA.email = USER_DATA.display_name.toLowerCase() + '@zooniverse.org'
USER_DATA.password = 'p@$$word'

LANGUAGE = 'en-us'

PROJECT_DATA =
  primary_language: LANGUAGE
  display_name: "Project Awesome: #{(new Date).toLocaleString()}"
  introduction: 'Projects. Are they awesome?'
  description: 'Everyone knows projects are awesome. Does the science back it up? Help us test our hypothesis blah blah blah...'
  science_case: 'We hope to prove once and for all the awesomeness of projects. We’ll publish a paper in blah blah blah...'
  private: true

SUBJECT_SET_DATA =
  display_name: "Subject set for #{PROJECT_DATA.display_name}"

SUBJECT_DATA =
  locations: ['image/jpeg']

  metadata:
    latitude: 41.87
    longitude: -87.63

WORKFLOW_DATA =
  display_name: "Workflow for #{PROJECT_DATA.display_name}"
  first_task: 'hot_or_not'
  tasks:
    hot_or_not:
      type: 'single'
      question: 'Hot or not?'
      answers: [
        {value: true, label: 'OMG so hot!'}
        {value: false, label: 'Not very hot at all.'}
      ]
  primary_language: LANGUAGE

projects = apiClient.type 'projects'
workflows = apiClient.type 'workflows'
subjects = apiClient.type 'subjects'
subjectSets = apiClient.type 'subject_sets'

# Save resources in an accessible scope.
resources = {}

clone = (object) ->
  JSON.parse JSON.stringify object

test 'Create a temporary user', ->
  auth.register USER_DATA

test 'Create a project', (t) ->
  projects.create(PROJECT_DATA).save().then (project) ->
    resources.project = project
    t.ok project?, 'Responded with a project resource'
    t.ok project?.id, 'Project got an ID'

test 'Create a subject set',  (t) ->
  subjectSetData = clone SUBJECT_SET_DATA
  subjectSetData.links =
    project: resources.project.id

  subjectSets.create(subjectSetData).save().then (subjectSet) ->
    resources.subjectSet = subjectSet
    t.ok subjectSet?, 'Responded with a subject set resource'
    t.ok subjectSet?.id, 'Subject set got an ID'

    subjectSet.link('project').then (subjectSetProject) ->
      t.ok subjectSetProject?, 'Subject set is linked to a project'
      t.equal subjectSetProject?.id, resources.project.id, 'Subject set project is the one specified'

test 'Create a subject', (t) ->
  subjectData = clone SUBJECT_DATA
  subjectData.links =
    project: resources.project.id

  subjects.create(subjectData).save().then (subject) ->
    resources.subject = subject
    t.ok subject?, 'Responded with a subject'
    t.ok subject?.id?, 'Subject got an ID'
    t.ok subject?.locations[0]['image/jpeg'].indexOf('http') isnt -1, 'Subject got a place to PUT its JPEG'

test 'Create a workflow', (t) ->
  workflowData = clone WORKFLOW_DATA
  workflowData.links =
    project: resources.project.id
    subject_sets: [resources.subjectSet.id]

  workflows.create(workflowData).save().then (workflow) ->
    resources.workflow = workflow
    t.ok workflow?, 'Responded with a workflow resource'
    t.ok workflow?.id, 'Workflow got an ID'

    workflow.link('project').then (workflowProject) ->
      t.ok workflowProject?, 'Workflow is linked to a project'
      t.equal workflowProject?.id, resources.project.id, 'Workflow project is the one specified'

    workflow.link('subject_sets').then (workflowSubjectSets) ->
      subjectSetIDs = (id for {id} in workflowSubjectSets)
      t.ok resources.subjectSet.id in subjectSetIDs, 'The workflow knows about the subject set we created'

test 'Delete temporary user', ->
  auth.disableAccount()
