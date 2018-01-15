counterpart = require 'counterpart'
React = require 'react'
createReactClass = require 'create-react-class'
{Markdown} = require 'markdownz'

counterpart.registerTranslations 'en',
  glossary:
    content: '''
      ## Glossary
      A collection of definitions for terms that are used across the Zooniverse. The terms are split into three different categories:

      [General Terms](#general-terms)
      [People](#people)
      [Project-Specific Terms](#project-specific-terms)

      If you'd like to see a definition that currently isn't on this page, [get in touch](/about/contact) and we'll look into adding it.


      ### General Terms

      + **Classification** -  A classification is all the data associated with a  volunteer’s response to an item of data (or subject) they’re presented with whilst going through a project. In essence, a classification is the core unit of human effort produced by the Zooniverse community.

      + **Collection** - A collection is similar to favoriting an image, but allows volunteers to additionally link together groups of subjects. These collections can be set to either public or private, and you can see all of the public collections on the [Collections](/collections) page. Volunteers can only add to their own collections, and not those of others.

      + **Favorites** - If a volunteer finds an image on a project that they like and wants to be able to see again in the future, they can mark it as a ‘Favorite’ by clicking the heart icon underneath it. These images then show on the volunteer’s [Favorites](/favorites) page.

      + **Newsletter** - a brief email message about your project sent to your project's registered volunteers or to a subset of registered Zooniverse volunteers. Newsletters are a great way to update volunteers on the your project's progress and also help give the daily classification rate a boost. If you’d like a newsletter to be sent out for your project, [get in touch](/about/contact) with Grant Miller, the Zooniverse Communications Lead.

      + **Project** - A project is a way for our volunteer community to engage with a specific research goal or question, using data provided by the researchers. This gives the researcher data to work with and helps progress science. It takes shape in the form of a website, which includes the main classification interface and the [Talk discussion tool](/talk).

      + **Project Builder** - This is the web tool that researchers use to create Zooniverse projects.  There is documentation to help with this process on [the Project Builder page](/lab).

      + **Zooniverse** - the Zooniverse encompasses the team, website, projects and our codebase. The Zooniverse is an open web-based platform for large­ scale citizen science research projects, capable of supporting tens of thousands of simultaneous users. The Zooniverse hosts the largest collection of online citizen science projects in the world, supporting over 1.5 million registered users and containing projects in astronomy, ecology, humanities, physics, and beyond.


      ### People

      + **Collaborator** - Collaborators are people with permission on a project with full access to edit workflows and project content, including deleting some or all of the project. You can add a collaborator to a project you own through the Collaborators section of the [Project Builder](/lab).

      + **Display name** - This is the name that shows up in the [Talk boards](/talk). You can edit this at any time by going to your [Settings](/settings) page and entering into the appropriate box what you’d like to change it to.

      + **Expert** - Experts can enter "gold mode" to make authoritative gold standard data that will be used to validate data quality. You can add an expert to a project you own through the Collaborators section of the [Project Builder](/lab).

      + **Moderator** - this is a role given to allocated by the project owner, and typically given to a member of the project’s volunteer community. The moderator is given extra privileges in the project’s [Talk](/talk) discussion tool (such as the ability to create new discussion boards), and they oversee and help moderate the Talk discussions. You can add a moderator to a project you own through the Collaborators section of the [Project Builder](/lab).

      + **Project owner** - This is the person who has built the project using the [Project Builder](/lab). They are typically the researcher working with the data.

      + **Real name** - this is the name that will be published alongside any research which involves Zooniverse data from projects you’ve been involved with.

      + **Researcher** - Members of a project’s research team will be marked as researchers on [Talk](/talk). You can add a researcher to a project you own through the Collaborators section of the [Project Builder](/lab).

      + **Testers** - Testers are people who can view and classify on your project to give feedback while it’s still private. They cannot access the project builder. You can add testers to a project you own  through the Collaborators section of the [Project Builder](/lab).

      + **User name** - This is the name that you log in with. This is currently permanently associated with your Zooniverse account and your classifications.

      + **Volunteer** - the Zooniverse’s prefered term for a member of the public who is participating in and contributing to a Zooniverse project.


      ### Project-Specific Terms

      + **Aggregation** - Each subject in a Zooniverse project is independently classified by multiple people. Aggregation is the process of combining these multiple assessments together.

      + **Annotation** - Annotations are markings, drawings, answers or data about a subject provided by volunteers as part of the classification process.

      + **Classification interface** - This is the web interface where volunteers are review subjects (subjects being data that volunteers are presented to in projects) and perform the desired project assessments and tasks. Researchers can add in various things to this interface such as tutorials on how to use it, and also mini-courses that give you information about the science behind the project. Each workflow has its own separate classification interface. You can access the classification interface through the main landing page of the project.

      + **Export** - An export is how to get the volunteer classifications and other relevant information about your project that is stored in the Zooniverse databases. It is essentially a data dump from the Zooniverse database. Project owners and collaborators can request data exports from their projects through the Project Builder. Project data is supplied in CSV/JSON format and Talk data is supplied in JSON format, and the two most commonly used exports are the subject data export, providing all the information stored about the subjects you’ve uploaded for your project, and the classification export, which has information stored for each project classification. You can request a data export by going to the [Project Builder](/lab), going to the Data Exports tab and then selecting from where whichever data export you’d like, provided you have the right permissions.

      + **Field Guide** - A field guide is a place to store general project-specific information that volunteers will need to understand in order to complete classifications and talk about what they're seeing. It's available anywhere in your project. It’s different to the tutorial in that the information is generally more about the science behind it, and is a way of sharing knowledge with your volunteers. Field guides are optional and generally contain more information than tutorials.

      + **Gold standard data** - This is data from classifications made by ‘Experts’. ‘Expert’ is a role assigned by the project owner, and their data can be used as a standard to compare the rest of the data against. There is currently an experimental feature which allows you to create a training set and provide in-classification feedback using gold standard data.

      + **Landing page** - front page of your project’s website. This is where people are directly when they go to your project’s url. The landing page is always accessible from your project’s website by clicking on the project’s avatar.

      + **Marks** - for drawing tasks, volunteers are asked to highlight content on an image by drawing circles, boxes, etc. around it. These drawings are referred to as marks.

      + **Mini-course** - this is an educational course that is embedded into the project. It is designed to help teach users more about the science behind projects that they are interacting with. Gravity Spy has one such mini-course.

      + **Project Avatar** - the project’s logo. This image shows in the top left corner of for the project website. If the project becomes Zooniverse approved, the project avatar will also be listed on the [Zooniverse projects page](/projects)

      + **Project Tags** - These help define which field of research your project belongs to, and determines which category your project will sit under on the [Projects page](/projects) in the categories section (it will still appear on the main Project page regardless). Users can also search by tag to find projects.

      + **Subject** - The chunk of data/thing a volunteer on a Zooniverse project is being presented with and asked to review and analyze.  It typically is an image, graph, photo, audio recording, video,  or a collection of these different things.

      + **Subject Set** - This is a group of subjects (subjects being data that volunteers are presented to in projects). Subjects are uploaded into subject sets through the [Project Builder](/lab), and it is subject sets that can be linked to workflows in order to get the desired subjects showing on your project’s webpage. You can group subjects into subject sets however you wish. You might want to group Subjects together, for example to represent a season’s worth of images in [Snapshot Serengeti](https://www.snapshotserengeti.org/) or a particular cell dye staining as in Cell Slider.

      + **Talk** - is the object-orientated discussion tool associated with your project. [Talk](/talk) enables volunteers to comment on the subjects they've reviewed and promotes discussion amongst the volunteer community.  Talk is also a place where the research team and project volunteers can interact. Talk has a series of message boards for longer discussions. Additionally, each subject has a dedicated page on its project Talk where a registered volunteer can write a comment, add searchable Twitter-like hashtags, or  link multiple subjects together into groups called collections

        + **Talk Tags** - Tags are used to help note something as relating to a particular topic. For example, one way of using it would be the following:  you’ve found an image that you think would be good for the [Daily Zoo](https://daily.zooniverse.org/), and so you post it in [Talk](/talk) and then include the tag #dailyzoo in the post. This makes it easier for it to be found as a suggestion, because you can do a search for a particular tag using the search bar. A list of popular tags is displayed on the right-hand side of the Talk page and clicking one will take you to instances of that tag in the Talk boards. So for example if you clicked on #dailyzoo, you’d then be shown all the different suggestions that people have made for it that they’ve tagged.

      + **Tasks** - A task could be listing how many of a particular thing a volunteer sees in an image and then drawing circles around them, identifying the various animals they can see in an image or identifying where abouts in an image something is. There are a wide variety of tools to help create a wide variety of different tasks in the [Project Builder](/lab) tool. One or more tasks make up a workflow.

        + **Drawing Task** - A task where the volunteers are asked to directly highlight or mark something on an image (e.g. drawing a circle around a penguin if visible in the image presented)

        + **Question Task** - A task where the volunteers are asked to assess the image and respond to a multiple choice question. In the Project Builder, a question task can allow the volunteer to choose a single response or select multiple answers to the question posed.

        + **Sub-task** - Sometimes when you are asked to do a task, such as drag a circle around an element in a picture, you are then asked a further task and what is contained in the circle. This is a subtask. For example, you may be asked to circle penguins in an image, a sub-task would be identifying whether the penguin circled is an adult or chick.

        + **Survey task** - A survey task is a task where you identify something by selection from many options and then are asked a variety of questions about what you’ve just identified, like behaviour, number or color.  For example, you could be asked to identify an animal in an image and then answer questions on how many legs you can see, which way it is facing and whether it is an adult or baby. An example of such a project is [Camera CATalog](https://www.zooniverse.org/projects/panthera-research/camera-catalogue).

      + **Tools** - tools enable volunteers draw or highlight a particular area of a subject image presented on the classification interface (e.g. draw a circle, draw a line, place a pointer). You can design your project such that a single task in the [Project Builder](/lab) can have one or more tools available for volunteers to mark or identify different features found in your subject images.

      + **Tutorial** - is a very brief walk-through explaining the main goals and aims of your project. It quickly introduces and explains to the volunteer how to do the requested tasks. This is created in the project builder and is presented to first-time volunteers of your project. Project tutorials are optional.

      + **Workflow** - This is a series of tasks and assessments that a volunteer is asked to do  when presented with data in a Zooniverse’s project classification interface. This can be either one task or multiple tasks, depending on the project.

        + **Active workflow** - these are workflows that are currently being presented to volunteers. They can’t be edited whilst they are active. You can make a workflow active and inactive by ticking the relevant box on the Visibility tab on the Project Builder page.

        + **Default workflow** -  The default workflow is the workflow that appears if the volunteers doesn’t choose one from the offered list on the front page of the project  but just clicks on the Classify tab. If a project has more than one active workflow, the project owner and project collaborators can choose which one will be the default workflow.

        + **Inactive workflow** - Inactive workflows are ones that aren’t currently being shown to volunteers, but can be edited. You can make a workflow active and inactive by ticking the relevant box on the Visibility tab on the Project Builder page.

      + **Zooniverse approved project** - this is a project that has undergone beta testing and been approved by the Zooniverse team. Details of this process can be found on the [Policy Page](/help/lab-policies). Zooniverse approved projects that are currently live can be seen on the [Projects page](/projects).


    '''

module.exports = createReactClass
  displayName: 'Glossary'

  render: ->
    <div className="secondary-page">
      <Markdown>{counterpart "glossary.content"}</Markdown>
    </div>
