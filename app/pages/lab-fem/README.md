## FEM-Compatible Project Builder (Lab)

This folder contains code for a modified Project Builder interface. This Project
Builder is used to build projects that are compatible with the
[Front-End-Monorepo](https://github.com/zooniverse/front-end-monorepo) classifier.

- The FEM-compatible Project Builder is accessible from the `/fem-lab` route.
  Double-check the router.cjsx file to be sure.
- Code is based on the original Project Builder in the adjacent `./lab` folder.

Context: in 2019(-ish?), the Zooniverse started to migrate its front end
website/classifier from the Panoptes-Front-End (PFE) codebase to the newer
Front-End-Monorepo (FEM) codebase. As of 2021, the migration is still ongoing.

As we want to transition fully from PFE to FEM, we need to encourage project
owners to build projects that are compatible with FEM. To do so, we need to
give them a Project Builder that's compatible with FEM.

**This is the short-term solution:** a modified _PFE Project Builder_ that
simply strips out (and in some minor cases, modifies) Tasks and features that
are incompatible with FEM projects.

Long-term, we really want to create a new Project Builder interface in the
FEM codebase, so we can retire the PFE codebase altogether. But that's outside
the scope of this readme.
