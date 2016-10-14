counterpart = require 'counterpart'
React = require 'react'
{Markdown} = (require 'markdownz').default

counterpart.registerTranslations 'en',
  policiesPage:
    content: '''
      ## Glossary

      ###GENERAL TERMS

      * **Zooniverse** - the Zooniverse encompasses the team, website, projects and our codebase. The Zooniverse is an open web-based platform for large­ scale citizen science research projects, capable of supporting tens of thousands of simultaneous users. The Zooniverse hosts the largest collection of online citizen science projects in the world, supporting over 1.5 million registered users and containing projects in astronomy, ecology, humanities, physics, and beyond.

      * **Project** - A project is a way for our volunteer community to engage with a specific research goal or question, using data provided by the researchers. This gives the researcher data to work with and helps progress science. It takes shape in the form of a website, which includes the main classification interface and the Talk discussion tool.

      * **Project builder** - This is the web tool that researchers use to create Zooniverse projects. It can be found at [http://www.zooniverse.org/lab](relativelink)  There is documentation to help with this process on the Project Builder page.

      * **Classification** -  A classification is all the data associated with a  volunteer’s response to an item of data (or subject) they’re presented with whilst going through a project. In essence, a classification is the core unit of human effort produced by the Zooniverse community.

      * **Newsletter** - a brief email message about your project sent to your project's registered volunteers or to a subset of registered Zooniverse volunteers. Newsletters are a great way to update volunteers on the your project's progress and also help give the daily classification rate a boost. If you’d like a newsletter to be sent out for your project, [get in touch](relativelink) with Grant Miller, the Zooniverse Communications Lead.

      * **Talk** - is the object-orientated discussion tool associated with your project. Talk enables volunteers to comment on the subjects they've reviewed and promotes discussion amongst the volunteer community.  Talk is also a place where the research team and project volunteers can interact. Talk has a series of message boards for longer discussions. Additionally, each subject has a dedicated page on its project Talk where a registered volunteer can write a comment, add searchable Twitter-like hashtags, or  link multiple subjects together into groups called collections

      * **Talk Tags** - these are tags that people use the same way as hashtags on Twitter. A list of popular tags is displayed on the right-hand side of the Talk page and clicking one will take you to instances of that tag in the forum.

      * **Favorites** - If a volunteer finds an image on a project that they like and want to be able to see again in the future, they can mark it as a ‘Favorite’ by clicking the heart icon underneath it. These images then show on the volunteer’s ‘Favorites’ page.

      * **Collection** - A collection is similar to favoriting an image, but allows volunteers to additionally link together groups of subjects. These collections can be set to either public or private, and you can see all of the public collections on the Collections page. Volunteers can only add to their own collections, and not those of others.


      ###PEOPLE

      * **Researcher** - Members of a project’s research team will be marked as researchers on Talk. You can add a researcher to a project you own through the Collaborators section of the Project Builder.

      * **Collaborator** - Collaborators are people with permission on a project with full access to edit workflows and project content, including deleting some or all of the project. You can add a collaborator to a project you own through the Collaborators section of the Project Builder.

      * **Moderator** - this is a role given to allocated by the project owner, and typically given to a member of the project’s volunteer community. The moderator is given extra privileges in the project’s  Talk discussion tool (such as the ability to create new discussion boards), and they oversee and help moderate  the Talk discussions. You can add a moderator to a project you own through the Collaborators section of the Project Builder.

      * **Testers** - Testers are people who can view and classify on your project to give feedback while it’s still private. They cannot access the project builder. You can add testers to a project you own  through the Collaborators section of the Project Builder.

      * **Expert** - Experts can enter "gold mode" to make authoritative gold standard data that will be used to validate data quality. You can add an expert to a project you own through the Collaborators section of the Project Builder.

      * **Volunteer** - the Zooniverse’s prefered term for a member of the public who is participating in and contributing to a Zooniverse project.

      * **User name** - This is the name that you log in with. This is currently permanently associated with your Zooniverse account and your classifications.

      * **Display name** - This is the name that shows up in the Talk boards. You can edit this at any time by going to your Settings page and entering into the appropriate box what you’d like to change it to.

      * **Real name** - this is the name that will be published alongside any research which involves Zooniverse data from projects you’ve been involved with.

      * **Project owner** - This is the person who has built the project using the Project Builder. They are typically the researcher working with the data.



      ###PROJECT-SPECIFIC TERMS

      * **Zooniverse approved project** - this is a project that has undergone beta testing and been approved by the Zooniverse team. Details of this process can be found on the Policy Page. Zooniverse approved projects that are currently live can be seen on the Projects page.

      * **Landing page** - front page of your project’s website. This is where people are directly when they go to your project’s url. The landing page is always accessible from your project’s website by clicking on the project’s avatar.

      * **Project Avatar** - the project’s logo. This image shows in the top left corner of for the project website. If the project becomes Zooniverse approved, the project avatar will also be listed on the [Zooniverse projects page](relativeURL)

      * **Project Tags** - These help define which field of research your project belongs to, and determines which category your project will sit under on the Projects page in the categories section (it will still appear on the main Project page regardless). Users can also search by tag to find projects.

      * **Classification interface** - This is the web interface where volunteers are review subjects (subjects being data that volunteers are presented to in projects) and perform the desired project assessments and tasks. Researchers can add in various things to this interface such as tutorials on how to use it, and also mini-courses that give you information about the science behind the project. Each workflow has its own separate classification interface. You can access the classification interface through the main landing page of the project.

      * **Subject** - The chunk of data/thing a volunteer on a Zooniverse project is being presented with and asked to review and analyze.  It typically is an image, graph, photo, audio recording, video,  or a collection of these different things.

      * **Subject Set** - This is a group of subjects (subjects being data that volunteers are presented to in projects). Subjects are uploaded into subject sets through the Project Builder, and it is subject sets that can be linked to workflows in order to get the desired subjects showing on your project’s webpage. You can group subjects into subject sets however you wish. You might want to group Subjects together, for example to represent a season’s worth of images in Snapshot Serengeti or a particular cell dye staining as in Cell Slider.

      * **Tasks** - A task could be listing how many of a particular thing a volunteer sees in an image and then drawing circles around them, identifying the various animals they can see in an image or identifying where abouts in an image something is. There are a wide variety of tools to help create a wide variety of different tasks in the Project Builder tool. One or more tasks make up a workflow.

      * **Drawing Task** - A task where the volunteers are asked to directly highlight or mark something on an image (e.g. drawing a circle around a penguin if visible in the image presented)

      * **Question Task** - A task where the volunteers are asked to assess the image and respond to a multiple choice question. In the Project Builder, a question task can allow the volunteer to choose a single response or select multiple answers to the question posed.

      * **Sub-task** - Sometimes when you are asked to do a task, such as drag a circle around an element in a picture, you are then asked a further task and what is contained in the circle. This is a subtask. For example, you may be asked to circle penguins in an image, a sub-task would be identifying whether the penguin circled is an adult or chick.

      * **Survey task** - A survey task is a task where you identify something by selection from many options and then are asked a variety of questions about what you’ve just identified, like behaviour, number or color.  For example, you could be asked to identify an animal in an image and then answer questions on how many legs you can see, which way it is facing and whether it is an adult or baby. An example of such a project is Camera CATalog.

      * **Tools** - tools enable volunteers draw or highlight a particular area of a subject image presented on the classification interface (e.g. draw a circle, draw a line, place a pointer). You can design your project such that a single task in the Project Builder can have one or more tools available for volunteers to mark or identify different features found in your subject images.

      * **Marks** - for drawing tasks, volunteers are asked to highlight content on an image by drawing circles, boxes, etc. around it. These drawings are referred to as marks.

      * **Annotation** - Annotations are markings, drawings, answers or data about a subject provided by volunteers as part of the classification process.

      * **Workflow** - This is a series of tasks and assessments that a volunteer is asked to do  when presented with data in a Zooniverse’s project classification interface. This can be either one task or multiple tasks, depending on the project.

      * **Default workflow** -  The default workflow is the workflow that appears if the volunteers doesn’t choose one from the offered list on the front page of the project  but just clicks on the Classify tab. If a project has more than one active workflow, the project owner and project collaborators can choose which one will be the default workflow.

      * **Active workflow** - these are workflows that are currently being presented to volunteers. They can’t be edited whilst they are active. You can make a workflow active and inactive by ticking the relevant box on the Visibility tab on the Project Builder page

      * **Inactive workflow** - Inactive workflows are ones that aren’t currently being shown to volunteers, but can be edited. You can make a workflow active and inactive by ticking the relevant box on the Visibility tab on the Project Builder page

      * **Tutorial** - is a very brief walk-through explaining the main goals and aims of your project. It quickly introduces and explains to the volunteer how to do the requested tasks. This is created in the project builder and is presented to first-time volunteers of your project. Project tutorials are optional.

      * **Mini-course** - this is an educational course that is embedded into the project. It is designed to help teach users more about the science behind projects that they are interacting with. [Planet Hunters](relativeurl) has one such mini-course.

      * **Field Guide** - A field guide is a place to store general project-specific information that volunteers will need to understand in order to complete classifications and talk about what they're seeing. It's available anywhere in your project. It’s different to the tutorial in that the information is generally more about the science behind it, and is a way of sharing knowledge with your volunteers. Field guides are optional and generally contain more information than tutorials.

      * **Export** - An export is how to get the volunteer classifications and other relevant information about your project that is stored in the Zooniverse databases. It is essentially a data dump from the Zooniverse database. Project owners and collaborators can request data exports from their projects through the Project Builder. Project data is supplied in CSV/JSON format and Talk data is supplied in JSON format, and the two most commonly used exports are the subject data export, providing all the information stored about the subjects you’ve uploaded for your project, and the classification export, which has information stored for each project classification. You can request a data export by going to the Project Builder, going to the Data Exports tab and then selecting from where whichever data export you’d like, provided you have the right permissions.

      * **Gold standard data** - This is data from classifications made by ‘Experts’. ‘Expert’ is a role assigned by the project owner, and their data can be used as a standard to compare the rest of the data against. There is currently an experimental feature which allows you to create a training set and provide in-classification feedback using gold standard data.

      * **Aggregation** - Each subject in a Zooniverse project is independently classified by multiple people. Aggregation is the process of combining these multiple assessments together. 

    '''

module.exports = React.createClass
  displayName: 'LabPoliciesPage'

  render: ->
    <div className="secondary-page centered-grid">
      <Markdown>{counterpart "policiesPage.content"}</Markdown>
    </div>
