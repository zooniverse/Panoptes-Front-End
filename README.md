# Panoptes (front end)

## Development

Requires Node.js.

Run `npm install` to get started.

`npm start` runs **./bin/serve.sh**, which watches the main CoffeeScript and Stylus files and runs a little server out of **./public** on port 3735 (looks like EYES).

`npm run stage` runs **./bin/build.sh** which builds and optimizes the site, and then deploys it to <http://demo.zooniverse.org/panoptes-front-end>.

All the good stuff is in **./app**. Start at **./app/main.cjsx**

### Conventions

React requires each component in an array to have a sibling-unique `key`. When rendering arrays of things that do not have IDs (annotations, answers), provide a random `_key` property if it doesn't exist. Ensure underscore-prefixed properties aren't persisted. That's automatic with the `JSONAPIClient.Model` class.

```coffee
<ul>
  {for item in things
    item._key ?= Math.random()
    <li key={item._key}>{item.label}</li>}
</ul>
```

### Async helper components

There are some nice components to help with async values. They take a function as `@props.children`, which looks a little horsey but works rather nicely. Most promised values we're dealing with are cached, so these are usually pretty safe, but if you notice the same request being made several times these are a good place to look. Here's an example of re-rendering for `auth` changes, which is pretty common.

```coffee
<ChangeListener target={auth}>{=>
  <PromiseRenderer promise={auth.checkCurrent()}>{(user) =>
    if user?
      <p>User is {user.display_name}</p>
    else
      <p>Nobody's signed in.</p>
  }</PromiseRenderer>
}</ChangeListener>
```

### CSS conventions

Include any CSS required to makes things work inline in the component, otherwise keep it in a separate file, one per component. For a given component, pick a unique top-level class name for that component and nest child classes under it. Keep common base styles and variables in **common.styl**. Stylus formatting: Yes colons, no semicolons, no braces. `@extends` up top, then properties (alphabetically), then descendant selectors. Prefer use of `display: flex` and `flex-wrap: wrap` to explicit media queries wherever possible.

```styl
// <special-button.styl>
.special-button
  background: red
  color: white

// <special-container.styl>
.special-container
  margin: 1em 1vw

  .special-button
    border: 1px solid
```

## Use in custom projects

If you're writing a custom project against the Panoptes API, you can use this module to handle authentication and data access. Install it with `npm install panoptes`.

```coffee
panoptes = require 'panoptes'

panoptes.auth.register {login, password, email}
panoptes.auth.signOut()
panoptes.auth.signIn {login, password}

panoptes.api.type('projects').get(SOME_PROJECT_ID).then (project) ->
  project.update display_name: 'A great project'
  project.link('workflows').then (workflows) ->
    workflows[1].delete()
    project.save()
```

More at the Panoptes API docs: <http://docs.panoptes.apiary.io/>.
