# (New) Accounts Page

This folder contains everything related to the Accounts Page, i.e. https://www.zooniverse.org/accounts

Dev notes (Jul 2025):
- Previously, the /accounts page was managed by [`/app/pages/sign-in.jsx`](https://github.com/zooniverse/Panoptes-Front-End/blob/a8412d3d43986f8d381d18a592150b22c6eefd0e/app/pages/sign-in.jsx) (the container), [`/app/partials/sign-in-form.cjsx`](https://github.com/zooniverse/Panoptes-Front-End/blob/a8412d3d43986f8d381d18a592150b22c6eefd0e/app/partials/sign-in-form.cjsx), and ['/app/partials/register-form.cjsx'](https://github.com/zooniverse/Panoptes-Front-End/blob/a8412d3d43986f8d381d18a592150b22c6eefd0e/app/partials/register-form.cjsx)
- In Jun 2025, the Rubin Landing Page project (see [PFE issue 7310](https://github.com/zooniverse/Panoptes-Front-End/issues/7310)) rewrote _and fixed_ the code from the PFE accounts page _in a standalone module_ which _copied but didn't overwrite_ the original Sign In & Register code. (see [`/app/rubin-2025`](https://github.com/zooniverse/Panoptes-Front-End/tree/a8412d3d43986f8d381d18a592150b22c6eefd0e/app/rubin-2025)).
  - Major fixes were necessary because the zooniverse.org/accounts page actually had a lot of problems, ranging from accessibility issues to outright broken functionality.
  - While we fixed a _lot_ of issues, we didn't address _all_ potential improvements. Basically, we purposely avoided _a full rewrite of the Sign In & Register code_ because changes to PFE are meant to be lightweight, since PFE is meant to be phased out. Long-term improvements to sign-in and register functionality should be performed on the [FEM codebase](https://github.com/zooniverse/front-end-monorepo/).
- Now that the Rubin Landing Page code has proven that it works, its fixes and improvements have finally been backported in to this (New) Accounts Page, which properly overwrites the original Sign In & Register code.
