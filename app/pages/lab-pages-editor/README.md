# Pages Editor

The "Pages Editor" is a variant of the Workflow Editor used in the Project Builder.

This experiment started development in late August/early September 2023, and runs parallel to the [FEM Lab](../lab-fem)

### Usage

Certain test projects are hardcoded to use the Pages Editor to edit workflows. Notably:
- "FEM Workflow Editor Sandbox" - https://www.zooniverse.org/lab/23976/workflows

Otherwie, Project Owners can edit their workflows using the Pages Editor interface (instead of the default PFE Project Builder interface) via URL hacking:
- e.g. if the default **Project Builder** uses the URL `https://www.zooniverse.org/lab/19242/workflows/22164`...
- ...then that workflow 22164 can be edited in the **Pages Editor** at the URL `https://www.zooniverse.org/lab/19242/workflows/editor/22164`

Limitations as of June 2024:
- You CAN'T use the Pages Editor to edit a workflow created via Project Builder.
- You SHOULDN'T use the Project Builder to edit a workflow created via Pages Editor.

### Dev Notes: Changes to Other PFE Files

The Pages Editor aims to be standalone, with minimum changes to other parts of the PFE code base. However, some changes are necessary, so please note the changes on the following PFE files:

- `app/router.jsx`: modified to add PagesEditor route (`lab/{projectId}/workflows/editor/{workflowId}`)
- `css/lab-pages-editor.styl`: added style sheet.
- `css/main.styl`: modified to import PagesEditor stylesheet.
- `app/pages/lab/project.jsx`: modified to include "isPartOfPagesEditorExperiment" flag, which adds a special style to the PagesEditor's container.
- `app/pages/lab/workflows-table.jsx`: modified to include a list of TEST_PROJECTS_THAT_SHOULD_USE_PAGES_EDITOR

### Dev Notes: Future Migration Plans

The Pages Editor is always meant to be migrated into the new [FEM codebase.](https://github.com/zooniverse/front-end-monorepo). The current incarnation of the Pages Editor that you're viewing was built in the PFE codebase (in 2023-2024) only as a matter of expediency.

The following is a guide on what's needed to migrate the Pages Editor feature into the FEM codebase.

The plan:
- Set up a new [package](https://github.com/zooniverse/front-end-monorepo/tree/master/packages) in the FEM codebase, say `app-pages-editor` or `app-lab-pages` or whatever.
- Create a basic/skeleton React app.
- Copy everything in this folder (`lab-pages-editor`) into that package, then plug the `<PagesEditor />` component in there somewhere.
- Make changes to the Pages Editor code.

Changes we need to make to the Pages Editor code:
- ❗️ Stylesheet: this will probably be most of the work!
  - The `app-pages-editor` FEM package needs to compile a Stylus file, i.e. [`css/lab-pages-editor.styl`](../../../css/lab-pages-editor.styl)
  - If Stylus is out of date, rewrite the stylesheet in plain CSS or SASS or something.
  - A base style [(example 1)](../../../css/app.styl) [(example 2)](../../../css/main.styl) needs to be added to define some default values, e.g. base font size, standard font families, etc.
- ❗️ Alternative to Stylesheet: rewrite components to use Grommet.
  - But please don't use Styled Components, it's an unnecessary resource hog.
- Icons: icons in [`./icons`](./icons) currently use Font Awesome 4, as per PFE standard. These should be replaced with Grommet Icons, which are the FEM standard.

Required dependencies:
- `react` v17+ (note: Pages Editor was built as bare-bones as possible to avoid issues with bumping versions)
- `prop-types`
- `panoptes-client` (used in DataManager and AssociatedTutorial)
- Stylus (or SASS or whatever's hip with the design kid these days)

Changes we need to make to PFE:
- See section above, "Dev Notes: Changes to Other PFE Files", for what needs to be reverted.
