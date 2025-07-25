# Data Exports: Batch Aggregations Exports

The Batch Aggregations Exports feature is an extension built into the standard Data Exports page, which lets project owners request a new kind of data export from Panoptes.

Most of the work is done in the backend; what you're seeing in this folder is just the UI code. This code is purposely separated from the base Data Exports page code (see [/lab/data-exports.jsx](../data-exports.jsx)).

Feature:
- Project owners will access this feature by going to Project Builder -> Project X -> Data Exports (example) -> Aggregate My Results
- This feature will be presented as a standalone modal UI separate from the rest of the Data Exports page.
- In this modal, project owners will be able to view all Workflows, plus each WF's last requested BA Export, if any exists.
- Once a WF is selected, project owners will be able to download the last requested BA Export, if any exists. (Note: not sure why this separated into two steps)
- Once a WF is selected, project owners can request a new BA Export.

Caveats:
- ⚠ For a Workflow to be eligible for a Batch Aggregation Data Export:
  - the workflow must already have a Classification Export, AND the project must already have a Workflows Export.
  - the workflow must use only a certain subset of Tasks: Question and/or Survey Tasks. (Note to self: not sure what happens if a non-valid Task is mixed in.)

Project Notes:
- Project lead: Cliff / Laura ; main dev: Shaun
- Target users: project owners.
- Initiated mid-June 2025.
- This is a permanent upgrade to PFE Project Builder.
  - Bonus scope: exportability. The Batch Aggregation functionality should be exportable, in some form, to a hypothetical future FEM Project Builder package.

Other Technical Notes:
- External dependencies: Batch Aggregation API (already in Panoptes ✔)

Also see https://github.com/zooniverse/Panoptes-Front-End/issues/7326
