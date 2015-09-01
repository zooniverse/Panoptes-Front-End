counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{Markdown} = require 'markdownz'

counterpart.registerTranslations 'en',
  policiesPage:
    content: '''
      ## Zooniverse Project Builder Policies, or So You Want To Launch a Project?

      This page is for those who have used the builder tools to construct a project they're happy with, and are now ready to launch it to the wider world. The first thing to understand is that there are three modes which a live project can be in - _Public Projects_, _Beta Projects_, and _Zooniverse Projects_:

      Firstly, **Public Projects**.

      Got your own crowd? Want only members of your collaboration to sort through your data? Then you can simply share the URL with those you want to take part. There is a limit of 10,000 subjects per project - [contact us](#/about/contact) if you'd like to host more. NOTE: This upload limit applies to all projects initially.

      _If you're planning a big public launch, or you think your project might attract significant attention, you should still [let us know](#/about/contact) so we can support you properly. Otherwise you can get on with using your project._

      For project teams who want to work with the established, ever-keen Zooniverse community, the first step is to turn your project into a **Beta Project**. You can do this from the main interface. Clicking the "_Apply for beta_" button will allow the Zooniverse team to review your project - this is just a quick check to make sure it complies with our rules (see below). Once it passes review, it will be available on the beta projects page and accessible to volunteers.

      _During the beta phase, you should be checking for suggestions and comments on the project's Discussion pages. Technical issues can be reported to us via [the GitHub repository](https://github.com/zooniverse/Panoptes-Front-End), but you will need to consider carefully comments on workflow design. Remember to look at the results produced during this beta phase too - are they of sufficient quality for your research? If not, then a redesign or a rethink is in order; go back, make changes to your project and then submit it for Beta once again._

      Following a successful beta, you should have a final version of the workflow that you're confident will produce useful results, and a site containing all the information that volunteers will need. You can then submit your project for launch, making it an official **Zooniverse Project** which will appear on our main page. A project appearing on the main Zooniverse page must have as its goal the production of useful research, and so there will be a further review. This final review may include requesting information from you about your plans for using the results, and a review of the beta test results. We may also carry out a peer review of your project.

      At this point, you will likely want to upload more than the small subject set used for development and for the beta. We’ll get in touch to arrange that once your project has passed review.

      Once the project has passed review, it will appear on the main project list, and we will consider it for inclusion in a Zooniverse community newsletter or for other promotion. If you want to increase the chance that your project will be promoted, then note that we will particularly favour projects whose researchers are proactive in engaging with their community, on the discussion forums and elsewhere.

      _If you'd like your project to launch on a particular day, perhaps to coincide with a press release, please [get in touch](#/about/contact)._

      ### Rules and Regulations

      By using the Zooniverse project builder, you're making use of our software and hosting, and so we reserve the right to remove content for any reason whatsoever. In particular, we will remove content and projects which are brought to our attention and where:

      - The content is not legal.
      - The content is likely to cause offense, or is suitable only for an adult audience.
      - The copyright on material uploaded to the site is not clear; please only use content you have the right to use!

      If in doubt - please [get in touch](#/about/contact).

      We're keen to find out how people want to use our platform, and at present it’s free to use. If you want more than the standard 10,000 subjects per user, are likely to want more than 100GB of space for those subjects, or will have more than a few hundred concurrent users, please let us know. We’re keen to help.

      We do, however, reserve the right to have the final say on which projects appear on the main page and which are promoted to the Zooniverse community. In particular, if you have a project that is very close to an existing Zooniverse project, please [get in touch](#/about/contact) to discuss the situation; it is in no-one's interest to, for example, have seventeen different galaxy classification projects competing for attention.

      Projects promoted to the Zooniverse community also need to:

      - Have the goal of producing useful research; this means they not only need to be well designed, but that you should have thought about who is going to use the results, and put in the effort to turn them into a formal publication.
      - Make their classification data open after a proprietary period, normally lasting two years from project launch.
      - Communicate results to their communities, via open access publication, a blog or elsewhere.
      - Acknowledge Zooniverse in any publications. Please use the following text:

      _This publication uses data generated via the Zooniverse.org platform, development of which was supported by a Global Impact Award from Google, and by the Alfred P. Sloan Foundation._

      - Report publications using Zooniverse-produced data to us via this [form](https://docs.google.com/forms/d/18jwLbtV_6M5HCM74xNFtFbiiszWAxpC5IGHaToYjeiw/viewform).
    '''

module.exports = React.createClass
  displayName: 'LabPoliciesPage'

  render: ->
    <div className="secondary-page centered-grid">
      <Markdown>{counterpart "policiesPage.content"}</Markdown>
    </div>
