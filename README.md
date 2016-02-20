# Panoptes (front end)

## Development

Requires Node.js.

Run `npm install` to install dependencies.

`npm start` runs **./bin/serve.sh**, which watches the main CoffeeScript and Stylus files and runs a little server out of **./public** on port 3735 (looks like EYES).

`npm run stage-branch` runs **./bin/build.sh** which builds and optimizes the site, and then deploys it to <http://demo.zooniverse.org/panoptes-front-end/current-git-branch-name>.

All the good stuff is in **./app**. Start at **./app/main.cjsx**

### Conventions

React requires each component in an array to have a sibling-unique `key`. When rendering arrays of things that do not have IDs (annotations, answers), provide a random `_key` property if it doesn't exist. Ensure underscore-prefixed properties aren't persisted. That's automatic with the `JSONAPIClient.Model` class.

```cjsx
<ul>
  {for item in things
    item._key ?= Math.random()
    <li key={item._key}>{item.label}</li>}
</ul>
```

### Async helper components

There are some ~~nice~~ **unfortunate** (in hindsight) components to help with async values. They take a function as `@props.children`, which looks a little horsey but works rather nicely. Most requested data is cached locally, so these are usually safe, but if you notice the same request being made multiple times in a row, these are a good place to start looking for the redundant calls. Here's an example of re-rendering when a project changes, which results in checking the projects owners.

```cjsx
<ChangeListener target={@props.project}>{=>
  <PromiseRenderer promise={@props.project.get('owners')}>{([owner]) =>
    if owner is @props.user
      <p>This project is yours.</p>
    else
      <p>This project belongs to {owner.display_name}.</p>
  }</PromiseRenderer>
}</ChangeListener>
```

**Do not write new code using `ChangeListener` or `PromiseRenderer`.**

**If it's reasonable, replace `ChangeListener` and `PromiseRenderer` instances with component state in code you work on.** It's more verbose, but it's more readable, and it'll get us closer to rendering on the server in the future.

### CSS conventions

Include any CSS **required for a component's functionality** inline in with component, otherwise keep it in a separate file, one per component. For a given component, pick a unique top-level class name for that component and nest child classes under it. Keep common base styles and variables in **common.styl**. Stylus formatting: Yes colons, no semicolons, no braces. `@extends` up top, then properties (alphabetically), then descendant selectors. Prefer use of `display: flex` and `flex-wrap: wrap` to explicit media queries wherever possible.

```styl
// <special-button.styl>
.special-button
  background: red
  color: white

.special-button-icon
  width: 1em;

// <special-container.styl>
.special-container
  margin: 1em 1vw

  .special-button
    border: 1px solid
```

## Custom projects

See [panoptes-client](https://www.npmjs.com/package/panoptes-client).
