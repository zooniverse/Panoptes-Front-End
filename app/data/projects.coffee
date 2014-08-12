Store = require './store'
{dispatch} = require '../lib/dispatcher'

EXAMPLE_PROJECT =
  id: 'GZ_PROJECT'
  name: 'Galaxy Zoo'
  owner_name: 'Zooniverse'
  avatar: 'https://pbs.twimg.com/profile_images/2597266958/image.jpg'
  background_image: 'http://upload.wikimedia.org/wikipedia/commons/thumb/4/43/ESO-VLT-Laser-phot-33a-07.jpg/1280px-ESO-VLT-Laser-phot-33a-07.jpg'
  description: 'Help further our understanding of galaxy formation.'
  introduction: new Array(5).join '''
    This is an _introduction_ with some **Markdown**.
    This paragraph has some <code>HTML</code> that should be escaped.
  ''' + '\n\n'
  science_case: '''
    Here's the science case for this project...
  '''
  team_members: []

module.exports = window.projectsStore = new Store
  root: '/projects'
  examples: [EXAMPLE_PROJECT]
