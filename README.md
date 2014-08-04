# Panoptes front end

## Planning

**./sitemap.md** should describe the layout of the site in detail.

## Dev

Dependencies are managed with npm; run `npm install` to get started.

`npm start` runs **./bin/serve.sh**, which watches the main CoffeeScript and Stylus files and runs a little server out of **./public** on port 3735 (looks like EYES).

`npm run stage` runs **./bin/build.sh** which builds and optimizes the site, and then deploys it to <https://demo.zooniverse.org/panoptes-front-end>.

## Architecture

This is still somewhat in _flux_, rofl.

### React

Everything that renders on the page is a React component. They're fairly organized:

**Components** are generic content holders. They have no content of their own.

**Partials** are more specific than components. They might be reusable across the site, but display their own content.

**Pages** are individual pages on the site.

### Flux

Stores automatically register with the dispatcher when instantiated. Special methods matching action names (generally formatted `object:action`) will be called by the dispatcher.

Event handlers in views can `dispatch` an action with a payload.

Given an action (a string) and a payload (whatever you want), the dispatcher goes through its registered stores and calls the handler functions corresponding to the action with the payload, then emits a "change" signal on the store to let any views that are listening know it's changed. If the handler returns a promise, the dispatcher waits to emit the "change" signal.
