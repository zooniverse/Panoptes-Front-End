# FEM Shared Code

This folder contains a number of shared functions and components that are used by PFE-FEM hybrid/transitional/liminal features.

Such features include:
- Project Builder => Pages Editor (aka FEM Workflow Editor) (app/pages/lab-pages-editor)

During the migration/transition phase between zooniverse.org using the PFE codebase and the FEM codebase, we had features built for FEM that resided in the PFE code. (e.g. an editor designed to build workflows for the FEM Classifier.) The long-term intent is that this "FEM in PFE" code should (1) be standalone enough as to not mess too much with the existing PFE code, and (2) eventually be migrated into their own FEM package.

As the scope of "FEM in PFE" features grew, we decided that a repository of shared FEM functions & components would be necessary to manage the sprawl of code. We hope that you, future readers of this document, don't find our implementation too messy, and that you're able easily migrate these hybrid/transitional/liminal features fully into the FEM codebase.

Good luck.

Last reviewed August 2025