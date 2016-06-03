# Panoptes (front end)

## Development

Requires Node.js.

`npm install` installs dependencies.

`npm start` builds and runs the site locally.

`npm run stage` builds and optimizes the site, and then deploys it to <https://current-git-branch-name.pfe-preview.zooniverse.org>.

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

See the **panoptes-client** library: <https://www.npmjs.com/package/panoptes-client>.

## Format of annotation values

The format of an annotation's value depends on the task used to generate it.

- **single:** The index of the chosen answer.

- **multiple:** An array of the indices of the chosen answers (in the order they were chosen).

- **drawing:** An array of drawing tool marks (descriptions of which follow below).

- **survey:** An array of identifications as objects. Each identification a `choice` (the ID of the identified animal) and `answers`, an object. Each key in `answers` is the ID of a question. If that question allows multiple answers, the value will be an array of answer IDs, otherwise just a single answer ID.

- **crop:** An object containing the `x`, `y`, `width`, and `height` of the cropped region.

- **text:** A string.

- **combo:** A sub-array of annotations.

- **dropdown:** An array of objects where the string `value` refers to the answer to the corresponding question and the boolean `option` indicates that the answer was in the list of options.

### Drawing tool marks

All coordinates are relative to the top-left of the image.

All marks have a `tool`, which is the index of the tool (e.g. `workflow.tasks.T0.tools[0]`) used to make the mark.

All marks contain a `frame`, which is the index of the subject frame (e.g. `subject.locations[0]`) the mark was made on.

If `details` tasks are defined for a tool, its marks will have a `details` array of sub-classifications (each with a `value`, following the descriptions above).

Drawing annotation value are as follows:

- **point:** The `x` and `y` coordinates.

- **line:** The start (`x1`, `y1`) and end (`x2`, `y2`) coordinates.

- **polygon:** An array of objects, each containing the `x` and `y` coordinate of a vertex. If the mark was not explicitly closed by the user, `auto_closed` is `true`.

- **rectangle:** The `x`, `y` coordinate of the top-left point of the rectangle along with its `width` and `height`.

- **circle:** The `x` and `y` coordinate of the center of the circle and its radius `r`.

- **ellipse:** The `x` and `y` coordinate of the center of the ellipse, its radii `rx` and `ry`, and the `angle` of `rx` relative to the x axis in degrees (counterclockwise from 3:00).

- **bezier:** The same as polygon, but every odd-indexed point is the coordinate of the control point of a quadratic bezier curve.

- **column:** The left-most `x` pixel and the `width` of the column selection.
