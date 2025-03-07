# Pages Editor (aka Workflow Editor)

The "Pages Editor" is a variant of the Workflow Editor used in the Project Builder.

This experiment started development in late August/early September 2023, and runs parallel to the [FEM Lab](../lab-fem)

Quick notes:
- A "Page" is an alias for a "Step" in a Workflow. (`workflow.steps[n]`)
- The "Pages Editor" may be called the "Workflow Editor" in other non-PFE documentation.

### Dev Notes: Naming

A note about the naming:
- When this project started in late 2023, the new UI for editing workflows was called "Pages Editor", because it was a workflow editor that organised workflows into discrete pages (steps).
- In late 2024, the project name was changed to "Workflow Editor". This is the equivalent of renaming your third cat, who was originally called "Kitty" to differentiate her from older siblings "Feline" and "Feline 2", to simply "Cat".
- To (hopefully?) minimise confusion, the code itself will continue to use "Pages Editor" naming scheme, e.g. `lab-pages-editor.styl`

### Dev Notes: Changes to Other PFE Files

The Pages Editor aims to be standalone, with minimum changes to other parts of the PFE code base. However, some changes are necessary, so please note the changes on the following PFE files:

- `app/router.jsx`: modified to add PagesEditor route (`lab/{projectId}/workflows/editor/{workflowId}`)
- `css/lab-pages-editor.syl`: added style sheet.
- `css/main.styl`: modified to import PagesEditor stylesheet.
- `app/pages/lab/project.jsx`: modified to include "isPartOfPagesEditorExperiment" flag, which adds a special style to the PagesEditor's container.

### Dev Notes: Migrating to FEM

Eventually, we want to move the Pages Editor from the PFE codebase into the FEM codebase. Here's the guide to performing that migration:

- Create a new package in the FEM, called, uh, `packages/app-project-editor` or something.
  - ❗️ Decide whether this app package will be for editing the whole project, or just the workflow. If the former, get ready for lots of additional work!
- Cut out the entire /app/pages/lab-pages-editor folder, put it into the new FEM package.
  - Change `.jsx files` to `.js`
  - Update the `imports`.
- Modify the following files:
  - `helpers/createTask.js`: create our own definitions of default task data, instead of relying on PFE's .getDefaultTask()
  - `icons/*`: replace any FontAwesome icons. Icons should use standard Grommet icons or custom SVGs; check with our designer as to what's appropriate.
  - TODO
- ❗️⚠️ TODO: figure out how we're going to get the CSS across into FEM.
- Cleanup:
  - Undo the changes to other PFE files, as noted in "Dev Notes: Changes to Other PFE Files"

Historical note: the reason we didn't initially build in FEM first is because it's faster to develop for PFE. e.g. before you can edit your workflow, you first need to access the admin for your projects, so users might expect being able to edit the rest of their project, etc.

(Last checked Feb 2025)
