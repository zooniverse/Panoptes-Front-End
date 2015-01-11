# The Panoptes Front End

##Introduction
[Panoptes](https://github.com/zooniverse/Panoptes/) is the new [Zooniverse](https://www.zooniverse.org/) Application Programming Interface (API) to support user-created Citizen Science projects. The aim is to enable researchers to define their own _Projects_ - consisting of _workflows_ (classification questions) and _collections_ of _subjects_ (images in the _project_'s dataset) - so that the Zooniverse's legion of volunteers can help carry out real science and classify their data.

The [Panoptes-Front-End](https://github.com/zooniverse/Panoptes-Front-End) (FE) is the web interface for creating, editing and deleting projects. Ultimately, users will be able to provide information about their project (including scientific goals, expected outcomes, and team details), define and edit the _workflows_, manage _subject_ sets, and much, much more.

You can find a live version of the Panoptes FE here:

* <https://demo.zooniverse.org/panoptes-front-end/>, 

where you can register as a user and start to create projects - though, of course, it is still under active development. As ever, any feedback is much appreciated - good luck!

##For developers

###Installation
After getting via code - either directly or by [forking the repo](https://guides.github.com/activities/forking/) - you can get started by installing the necessary software. Dependencies are managed with [npm](https://www.npmjs.com/) (you'll need [node.js](http://nodejs.org/) too), so to get going simply type;

```bash
$ cd $PFE_WORKING_DIR
$ npm install
```

(where `$PFE_WORKING_DIR` is an environment variable specifying the path of where you've just cloned the repo to). **npm** should do the rest.

###Running the FE locally with the "staging" Panoptes instance
Out of the box, the FE will actually work with the `staging` Panoptes instance. This means that the user and project management is all done elsewhere (and will be the same as what you find [here](https://demo.zooniverse.org/panoptes-front-end/)). You can run a local FE with:

```bash
$ npm start
```
This runs **./bin/serve.sh**, which watches the main CoffeeScript and Stylus files and runs a little server out of **./public** on port 3735 (looks like EYES). You can see the results in your browser at:

* <http://127.0.0.1:3735>

###Running the FE locally with a local Panoptes instance
If you have a local version of [Panoptes](https://github.com/zooniverse/Panoptes/) running on, say, <http://localhost:3000>, you can access this with the FE by changing the `DEFAULT_ENV` variable in `app/api/config.coffee` to `development`:

```
#DEFAULT_ENV = 'staging'
DEFAULT_ENV = 'development'
```

You'll need to make sure your [Panoptes](https://github.com/zooniverse/Panoptes/) is properly configured, of course - which is beyond the scope of this guide.


###For Devs
 _For advanced users only!_

```bash
npm run stage
```

runs **./bin/build.sh**, which builds and optimizes the site before deploying it to <https://demo.zooniverse.org/panoptes-front-end>.


## Planning

**./sitemap.md** should describe the layout of the site in detail.


## Architecture

### React

Everything that renders on the page is a React component. They're fairly organized:

* **Components** are generic content holders. They have no content of their own;
* **Pages** are individual pages on the site.


##Useful links

* [The Zooniverse](https://www.zooniverse.org/) - where it all began/begins!
* [The Panoptes Front End](https://demo.zooniverse.org/panoptes-front-end/) (the `staging` deployment - so may not reflect the code here...);
* [Panoptes](https://github.com/zooniverse/Panoptes/) on [GitHub](http://github.com).
