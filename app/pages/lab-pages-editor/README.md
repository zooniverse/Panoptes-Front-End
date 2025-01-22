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
- To (hopefully?) minimuse confusion, the code itself will continue to use "Pages Editor" naming scheme, e.g. `lab-pages-editor.styl`

### Dev Notes: Changes to Other PFE Files

The Pages Editor aims to be standalone, with minimum changes to other parts of the PFE code base. However, some changes are necessary, so please note the changes on the following PFE files:

- `app/router.jsx`: modified to add PagesEditor route (`lab/{projectId}/workflows/editor/{workflowId}`)
- `css/lab-pages-editor.syl`: added style sheet.
- `css/main.styl`: modified to import PagesEditor stylesheet.
- `app/pages/lab/project.jsx`: modified to include "isPartOfPagesEditorExperiment" flag, which adds a special style to the PagesEditor's container.
 