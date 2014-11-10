# Panoptes front end

## Planning

**./sitemap.md** should describe the layout of the site in detail.

## Dev

Dependencies are managed with npm; run `npm install` to get started.

`npm start` runs **./bin/serve.sh**, which watches the main CoffeeScript and Stylus files and runs a little server out of **./public** on port 3735 (looks like EYES).

`npm run stage` runs **./bin/build.sh** which builds and optimizes the site, and then deploys it to <https://demo.zooniverse.org/panoptes-front-end>.

## Architecture

### React

Everything that renders on the page is a React component. They're fairly organized:

**Components** are generic content holders. They have no content of their own.

**Pages** are individual pages on the site.
