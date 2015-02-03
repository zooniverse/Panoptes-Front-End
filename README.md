# Panoptes (front end)

## Development

Requires Node.js.

Run `npm install` to get started.

`npm start` runs **./bin/serve.sh**, which watches the main CoffeeScript and Stylus files and runs a little server out of **./public** on port 3735 (looks like EYES).

`npm run stage` runs **./bin/build.sh** which builds and optimizes the site, and then deploys it to <http://demo.zooniverse.org/panoptes-front-end>.

All the good stuff is in **./app**. Start at **./app/main.cjsx**

## Use in custom projects

If you're writing a custom project against the Panoptes API, you can use this module to handle authentication and data access.

```coffee
panoptes = require 'panoptes'

panoptes.auth.register {login, password, email}
panoptes.auth.signOut()
panoptes.auth.signIn {login, password}

panoptes.api.type('projects').get(SOME_PROJECT_ID).then (project) ->
  project.update display_name: 'A great project'
  project.save()
  project.link('workflows').then (workflows) ->
    workflows[1].delete()
```

More at the Panoptes API docs: <http://docs.panoptes.apiary.io/>.
