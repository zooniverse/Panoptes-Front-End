counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{Markdown} = require 'markdownz'

counterpart.registerTranslations 'en',
  educationPage:
    content: '''
      ## Education in the Zooniverse

      As a volunteer on these websites, both you and your students can become citizen scientists and citizen researchers, participating in real science and other research. If you or your students think you have make a mistake, don’t worry; even the researchers make mistakes. These projects are set up to have more than one volunteer analyzing each piece of data, thereby eliminating the vast majority of human error. Mistakes are a part of the process, and can even help us evaluate the difficulty of the data. As long as everyone does their best, they are helping!

      ### Resources for educators using Zooniverse
      - [ZooTeach](http://www.zooteach.org/) is a repository of lessons and resources for teachers. At ZooTeach, you will find a variety of resources for education, including: guides to projects for students and teachers, teacher-created presentations designed to introduce students to a particular project, and lessons developed to connect your students to projects and research within the context of things they already know.
      - Many Zooniverse projects have their own education pages with additional resources for teachers. Resources may include a video tutorial of how to use the project, other helpful documents and videos about the classification process, and education resources related to the research behind the project.

      ### Take part in the conversation

      Keep up with the latest Zooniverse educational efforts on the [Zooniverse Blog](http://blog.zooniverse.org/) or by following [&#64;zooteach](https://twitter.com/ZooTeach) on Twitter. You can also talk with other Zooniverse educators and peers interested in using people-powered research in all sorts of learning environments on the [Zooniverse Education Talk board](http://zooniverse.org/talk/16).

      ### How are educators are using Zooniverse?

      Looking for a little inspiration? Here are some ways educators have used Zooniverse projects and educational resources:
      - [Floating Forests: Teaching Young Children About Kelp](http://blog.zooniverse.org/2015/04/29/floating-forests-teaching-young-children-about-kelp/)
      - [Cosmic Curves: Investigating Gravitational Lensing at the Adler Planetarium](http://blog.zooniverse.org/2014/03/18/cosmic-curves-investigating-gravitational-lensing-at-the-adler-planetarium/)
      - [Snapshot Serengeti Brings Authentic Research Into Undergraduate Courses](http://blog.zooniverse.org/2014/02/19/snapshot-serengeti-brings-authentic-research-into-undergraduate-courses/)

      We’d love to hear about how you’ve used Zooniverse with youth or adult learners! Please contact [education@zooniverse.org](mailto:education@zooniverse.org) if you have any interesting stories to share.
    '''

module.exports = React.createClass
  displayName: 'EducationPage'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  render: ->
    <Markdown>{counterpart "educationPage.content"}</Markdown>
