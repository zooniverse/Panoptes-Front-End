# Pages Editor

The "Pages Editor" is a variant of the Workflow Editor used in the Project Builder.

This experiment started development in late August/early September 2023, and runs parallel to the [FEM Lab](../lab-fem)

### Dev Notes: Changes to Other PFE Files

The Pages Editor aims to be standalone, with minimum changes to other parts of the PFE code base. However, some changes are necessary, so please note the changes on the following PFE files:

- `app/router.jsx`: modified to add PagesEditor route (`lab/{projectId}/workflows/editor/{workflowId}`)
- `css/lab-pages-editor.syl`: added style sheet.
- `css/main.styl`: modified to import PagesEditor stylesheet.
- `app/pages/lab/project.jsx`: modified to include "isPartOfPagesEditorExperiment" flag, which adds a special style to the PagesEditor's container.
 