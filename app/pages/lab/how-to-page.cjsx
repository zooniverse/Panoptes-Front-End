React = require 'react'
counterpart = require 'counterpart'
{Markdown} = (require 'markdownz').default

counterpart.registerTranslations 'en',
  howToPage:
    content: '''

      # Index
        * [Getting Started - the Quick Guide](#the-quick-guide)
        * [Overview - Everything on your Nav Bar](#overview-everything-on-your-nav-bar)
          * [Project](#project)
          * [Workflows](#workflows)
          * [Subjects](#subjects)
        * [The Detailed Guide](#the-detailed-guide)
            * [Project Details](#project-details)
            * [About](#about)
            * [Collaborators](#collaborators)
            * [Tutorials](#tutorials)
            * [Media](#media)
            * [Visibility](#visibility)
            * [Workflows](#workflows)
              * [Orientation](#orientation)
              * [Create Tasks](#create-tasks)
              * [Wiring Tasks Together](#wiring-tasks-together)
            * [Task Content](#task-content)
              * [Questions](#questions)
              * [Marking](#marking)
            * [Subject Sets](#subject-sets)


      There are five sections to this guide. The first section, [Getting Started - The Quick Guide](#getting-started) is an overview of the steps you need to complete in order to set up a project, in case you want a brief guide or reminder of all the steps.

      For those of you who'd like a bit more guidance, the [Nav Bar Overview](#overview) section summarises in a bit more detail what the different nav bar headers on the Project Builder page are for. The following section section, [The Nav Bar - More Details](#details) is a more in-depth guide which goes into all of the subsections of the navbar and the finer details of how to set up a project. If you'd like to see a walkthrough of setting a project up, click here for the documentation on building 'Kitteh Zoo'.

      ## The Quick Guide

      A brief overview of all the steps you need to do to how to set up a project - for more details on how to use each section on the navbar, click [here](#details)and for a detailed walk-through of setting up a project, check out the 'Detailed Guide' section [here](#building).

      1. Make sure you are logged in to your Zooniverse account.
      2. Click on "Build a Project" or head over to www.zooniverse.org/lab and click "Create a New Project"
      3. Define your project. A popup will appear. Once you've filled this out, you'll be taken to a more detailed "Project Details" page where you can further define basic information (you can change all this later on from the same page). Then, go through each of the other blue tabs on the left-hand side. There is guidance information for each component listed on the page itself, and more detail further down in this guide too.
      4. The next step is to create your workflow. Click on "New Workflow" in the Navigation Bar on the left-hand side of the page underneath the blue tabs. Run through this as many times as necessary to set up your workflow.
      5. Link your workflow to subjects: Under "Associated Subject Sets" select "use default subject set" which will link your project to ridiculous photos of cats. Alternatively, you can upload your own subjects under the "Subjects" menu on the left-hand Nav bar (detailed instructions [here](#subjects) ):
      6. Test your workflow: Hit the "Test this Workflow" button to actually see how it comes together!
      7. Lather, rinse, repeat: Explore your project, figuring out what works and what doesn't. Make changes, then refresh your project page to test out the changes. Guidelines on project design for maximizing engagement and data quality are **here** (link to policies page)
      8. Lastly, once you are happy with all of these components, make your project Public on the 'Visibility Page' and submit it for review to the Zooniverse team.

      ## Overview: Everything on your Nav Bar

      On the left-hand side, you've got your main menus: Project, Workflow, and Subjects. These are terms you'll see a lot, and they have specific meanings in the Zooniverse. Project is pretty self-explanatory; Galaxy Zoo, Penguin Watch, and of course, Kitteh Zoo, are all examples of Zooniverse projects that you could build using the project builder. A workflow is the sequence of tasks that you ask volunteers to do, and subjects are the things (usually images) that volunteers do those tasks on.

      For more details on how to use these individual sections, click [here](#details).

      ### Project
      This holds all your project level details. The project name, the people involved, and all the extra content (e.g. text and pictures) you want to share, are all here.

      - **Project Details:** This is your project's "behind the scenes" home page. Start off by naming and describing your project, add a logo and background image.

      - **About:** You can add all sorts of additional pages, including *Research, Team, Results, Education,* and *FAQ*

      - **Collaborators:** Add people to your team and specify what their roles are so that they have the right access to the tools they need (including access to the project before it's public).

      - **Tutorial:** This is where you create tutorials to show your users how to use your project.

      - **Media:** Add any images you need for your project pages (not the images you want people to classify!)

      - **Visibility:** Set your project's "state" - private or public, live or in development, and apply for review to become approved by the Zooniverse. You can also activate or deactivate specific workflows on this page.

      - **Talk:** Create and manage the discussion boards for your project.

      - **Data Exports:** Access your raw and aggregated classification data, subject data, and comments from Talk.

      ### Workflows
      A workflow is the sequence of tasks that you're asking volunteers to perform. For example, you might want to ask volunteers to answer questions about your images, or to mark features in your data, or both. The workflow is where you define those tasks and set out the order in which the volunteers will do them. Your project might have multiple workflows (if you want to set different tasks for different image sets). See the Workflow Details section for more on workflows.

      ### Subjects
      A subject is a unit of data to be analyzed. A subject can include one or more images that will be analyzed at the same time by volunteers. A subject set consists of a list of subjects (the "manifest") defining their properties, and the images themselves. Feel free to group subjects into sets in the way that is most useful for your research. Many projects will find it's best to just have all their subjects in 1 set, but not all. See the Subject Details section for more on subjects.


      ## The Detailed Guide
      Detailed instructors on how to use the pages described above.

      ### Project Details
      * **Name**: The project name is the first thing people will see and it will show up in the project URL. Try to keep it short and sweet.

      * **Avatar**: Pick an avatar image for your project. This will represent your project on the Zooniverse home page. It can also be used as your project's brand. It's best if it's recognizable even as a small icon. To add an image, either drag and drop or click to open your file viewer. For best results, use a square image of not more than 50KB, but at minimum 100x100 pixels.

      * **Background**: This image will be the background for all of your project pages, including your project's front page, which newcomers will see first. It should be relatively high resolution and you should be able to read text written across it. To add an image, either drag and drop or click to open your file viewer. For best results, use images of at least 1 megapixel, no larger than 256 KB. Most people's screens are not much bigger than 1300 pixels across and 750 pixels high, so if your image is a lot bigger than this you may find it doesn't look the way you expect. Feel free to experiment with different sizes on a "typical" desktop, laptop or mobile screen.

      * **Description**: This should be a one-line call to action for your project. This will display on your landing page and, if approved, on the Zooniverse home page. Some volunteers will decide whether to try your project based on reading this, so try to write short text that will make people actively want to join your project.

      * **Introduction**: Add a brief introduction to get people interested in your project. This will display on your project's front page. Note this field (renders markdown)[http://markdownlivepreview.com/], so you can format the text. You can make this longer than the Description, but it's still probably best to save much longer text for areas like the Research Case or FAQ tabs.

      * **Checkbox:** Volunteers choose workflow: A workflow is a set of tasks a volunteer completes to create a classification. Your project might have multiple workflows (if you want to set different tasks for different image sets). Check this to let volunteers select which workflow they want to work on; otherwise, they'll be served workflow-subject pairs randomly.

      * **Checkbox:** Private project:
      On "private" projects, only users with specified project roles can see or classify on the project. We strongly recommend you keep your project private while you're still working out its details. Share it with your team to get feedback by adding them in the Collaborators area (linked at the left). Team members you add can see your project even if it's private. Once your project is public, anyone with the link can view and classify on it.


      ### About
      Contains pages for Research, Team, FAQ, Results, and Education: These pages are where you really get to share all the cool things about your project. All of these pages use Markdown (see link above) to format text and display images.

      * **Research:** Explain your research to your audience here in as much detail as you'd like. This page displays no matter what, since explaining your motivation to volunteers is critical for the success of your project!

      * **Results:** Once your project has hit its stride, share the results of your project with your volunteers here. This page will only display if you add content to it.

      * **FAQ:** Add details here about your research, how to classify, and what you plan to do with the classifications. This page can evolve as your project does so that your active community members have a resource to point new users to. This page will only display if you add content to it.

      * **Education:** If you are a researcher open to collaborating with educators you can state that here, include educational content, and describe how you'd like to help educators use your project. Also, if your project is primarily for educational purposes you can describe that here. This page will only display if you add content to it.


      ### Collaborators
      Add people to your team and specify what their roles are so that they have the right access to the tools they need (including access to the project before it's public).

      * **Owner:** The owner is the original project creator. There can be only one.

      * **Collaborator:** Collaborators have full access to edit workflows and project content, including deleting some or all of the project.

      * **Expert:** Experts can enter “gold mode” to make authoritative gold standard classifications that will be used to validate data quality.

      * **Researcher:** Members of the research team will be marked as researchers on “Talk"

      * **Moderator:** Moderators have extra privileges in the community discussion area to moderate discussions. They will also be marked as moderators on “Talk".

      * **Tester:** Testers can view and classify on your project to give feedback while it’s still private. They cannot access the project builder.

      * **Translator:** Translators will have access to the project builder as well as the translation site, so they can translate all of your project text into a different language.


      ### Tutorials
      **Needs writing**


      ### Media
      You can upload your own media to your project (such as example images for your help pages) so you can link to it without an external host. To start uploading, drop an image into the box (or click it to bring up your file browser and select a file).

      Once the image has uploaded, it will appear above the "Add an image" box. You can then copy the markdown text beneath the image into your project, or add another image.

      ### Visibility
      This page is where you decide whether your project is public and whether it's ready to go live. Also set workflows to "active" vs. "inactive" -- you can edit inactive workflows on a live project and link different subject sets to different workflows.

      For more information on the different project stages, see our project builder policies.


      ### Workflows

      #### Orientation
      Note that a workflow with fewer tasks will be easier for volunteers to complete. We know from surveys of our volunteers that many people classify in their limited spare time, and sometimes they only have a few minutes. Longer, more complex workflows mean each classification takes longer, so if your workflow is very long you may lose volunteers.

      * **Workflow Name:** Give your workflow a short, but descriptive name. If you have multiple workflows and give volunteers the option of choosing which they want to work on, this name will appear on a button instead of "Get started!"

      * **Version:** Version indicates which version of the workflow you are on. Every time you save changes to a workflow, you create a new version. Big changes, like adding or deleting questions, will change the version by a whole number: 1.0 to 2.0, etc. Smaller changes, like modifying the help text, will change the version by a decimal, e.g. 2.0 to 2.1. The version is tracked with each classification in case you need it when analyzing your data.

      * **Tasks:** There are two main types of tasks: questions and drawing. For question tasks, the volunteer chooses from a list of answers but does not mark or draw on the image. In drawing tasks, the volunteer marks or draws directly on the image using tools that you specify. They can also give sub-classifications for each mark. Note that you can set the first task from the drop-down menu.

      * **Main Text:** Describe the task, or ask the question, in a way that is clear to a non-expert. The wording here is very important, because you will in general get what you ask for. Solicit opinions from team members and testers before you make the project public: it often takes a few tries to reach the combination of simplicity and clarity that will guide your volunteers to give you the inputs you need. You can use markdown in the main text.

      * **Help Text:** Add text and images for a pop-up help window. This is shown next to the main text of the task in the main classification interface, when the volunteer clicks a button asking for help. You can use markdown in this text, and link to other images to help illustrate your description. The help text can be as long as you need, but you should try to keep it simple and avoid jargon. One thing that is useful in the help text is a concise description of why you are asking for this particular information.


      #### Create Tasks
      Create tasks with the "Add New Task" Button. Delete tasks with the little "Delete this task" button on the bottom right hand side. *Note: When you create a new workflow, a question task is automatically created. You'll need to delete it if you don't want to ask your volunteers questions.

      #### Wiring tasks together
      After you've created all your tasks, you need to wire them together. Set your first task using the "First Task" dropdown menu below the "Add Task" button. Then for each task, you have to specify *what comes next*. In question tasks, you can specify different "Next Tasks" for different answers (provided users can only select one answer)

      Subject retirement: Decide how many people you want to see each photo. You'll use the beta test to refine this number. We suggest starting out kinda high, like 10-20.

      Multi-Image options: If you have more than one subject in your subject set (like on www.snapshotserengeti.org), decide how users will see them.

      ### Task Content
      Tasks can be Questions or Markings. Both types have "Main Text" boxes where you can ask your questions or tell users what to draw, as well as provide additional support for answering the question in the "Help Text" box.

      #### Questions:
      Choices: This section contains all your answers. The key features of this section are:
      - **Required:** if you select this, the user will HAVE to answer the question before moving on.
      - **Multiple:** if you select this, the user can select more than one answer -- use this for "select all that apply" type questions.
      - **Next Task:** The “Next task” selection (which appears below the text box for each answer) describes what task you want the volunteer to perform next after they give a particular answer. You can choose from among the tasks you’ve already defined. If you want to link a task to another you haven’t built yet, you can come back and do it later (don’t forget to save your changes).

      #### Marking:
      Choices: This section contains all the different things people can mark. We call each separate option a "Tool" and you can specify a label, colour, and tool type for each option. Check out the Aggregation docs to understand how multiple volunteer answers are turned into final shapes for your data analysis!

      Tool types are:
      - **point:** X marks the spot.
      - **line:** a straight line at any angle.
      - **polygon:** an arbitrary shape made of point-to-point lines.
      - **rectangle:** a box of any size and length-width ratio; this tool *cannot* be rotated.
      - **circle:** a point and a radius.
      - **ellipse:** an oval of any size and axis ratio; this tool *can* be rotated.

      ### Subject Sets
      Need to generate this content from the 'how-to' page

    '''

module.exports = React.createClass
  displayName: 'howToPage'

  render: ->
    <div className="secondary-page centered-grid">
      <Markdown>{counterpart "howToPage.content"}</Markdown>
    </div>
