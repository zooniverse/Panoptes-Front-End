## FEM-Compatible Project Builder (Lab)

This folder contains code for a modified Project Builder interface. This Project
Builder is used to build projects that are compatible with the
[Front-End-Monorepo](https://github.com/zooniverse/front-end-monorepo) classifier.

This is how the FEM-Compatible Project Builder works:
- The Project Builder now _automatically switches_ between PFE-compatible pages
  and FEM-compatible pages, _depending on the project._
- e.g. https://master.pfe-preview.zooniverse.org/lab/1873/workflows/3532 will
  give you the FEM-compatible workflow editor, IF project 1873 is configured to
  use FEM. Otherwise, you'll get the PFE-compatible workflow editor.
- The lynchpin for this behaviour is `FEMLabRouter`, which checks for FEM
  compatibility and performs the component switching.
- Any code that's not the FEMLabRouter is based on the original Project Builder
  in the adjacent `./lab` folder. Compare the modifications by running, e.g.
  `diff app/pages/lab/workflow.cjsx app/pages/lab-fem/workflow.cjsx`

At the moment, this is how the FEMLabRouter determine if we should use a
FEM-compatible pages:
- Use FEM Lab if ANY one or more of the following conditions are met:
  - Project is already using the FEM Classifier (i.e. has its slug registered in
    the monorepo routes)
  - Project has `experimental_tools.femLab = true`
  - `?femLab=true` query param is set
- Use PFE Lab in all other cases, OR if `?pfeLab=true` query param is set.

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
