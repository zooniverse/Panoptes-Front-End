counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{Link} = require 'react-router'
Markdown = require '../components/markdown'
TeamPage = require './team-page'

counterpart.registerTranslations 'en',
  about:
    title: 'About Us'
    nav:
      about: 'About'
      publications: 'Publications'
      ourTeam: 'Our Team'
      careers: 'Careers'
    pageContent:
      aboutIndex: '''
        ## What is the Zooniverse?

        The Zooniverse is the world's largest and most popular online platform for
        people-powered research projects. This research is being conducted in part by
        volunteers—hundreds of thousands of people around the world who come together to
        assist professional researchers with their data. Our goal is to enable research
        that would not be possible (or practical) otherwise. People-powered research results
        in new discoveries, datasets useful to the wider research community, and [many publications](./#/about/publications).

        ### At the Zooniverse, anyone can be a researcher online.

        You don't need any specialised background, training, or expertise to participate in any
        Zooniverse projects. We make it easy for anyone to contribute to real academic research,
        on their own computer, at their own convenience.

        You'll be able to study authentic objects of interest gathered by researchers,
        like images of faraway galaxies, historical records and diaries, or videos of animals
        in their natural habitats. By answering simple questions about them, you'll help contribute
        to our understanding of our world, our history, our universe, and more.

        And with our wide-ranging and ever-expanding suite of projects, covering many disciplines
        and topics across the sciences and humanities, there's a place for anyone and everyone to
        explore, learn and have fun in the Zooniverse!

        ### We accelerate important research by working together.

        The major challenge of 21st century research is dealing with the flood of information we can
        now collect about the world around us. Computers can help, but in many fields the human ability
        for pattern recognition—and our ability to be surprised—is still superior. With the help of
        Zooniverse volunteers, researchers can analyze that information more quickly and accurately
        than would otherwise be possible, saving time and resources, advancing the ability of computers
        to do the same tasks, and leading to faster research output.

        Our projects apply the philosophy of the "wisdom of crowds." Combining the classifications of
        many individual users produces accurate and usable data with a measurable estimate of
        error—exactly what's needed to make progress in these fields of research.

        ### Volunteers and professionals make real discoveries together.

        Zooniverse projects are constructed with the aim of converting volunteers' efforts into
        measurable results. These projects have produced a large number of [published research papers](./#/about/publications),
        as well as several open-source sets of analyzed data. In some cases, Zooniverse volunteers have
        even made completely new and scientifically significant discoveries!

        A significant amount of this research takes place on the Zooniverse discussion boards,
        where volunteers can work together with each other and with the research teams. These boards
        are integrated with each project's data to allow for everything from quick hashtagging to in-depth
        collaborative analysis. There is also a central Zooniverse board for general chat and discussion
        about Zooniverse-wide matters.

        Many of the most interesting discoveries from Zooniverse projects
        have come from discussion between volunteers and researchers.
        We encourage all users to join the conversation on the discussion boards for more in-depth participation.'''
      team: 'the team!'
      publications: 'publications'

module.exports = React.createClass
  displayName: 'AboutPage'

  getInitialState: ->
    activeTab: null

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'

    currentRoute = @props.routes[@props.routes.length - 1]
    @setState activeTab: currentRoute.name

  componentWillReceiveProps: (nextProps) ->
    currentRoute = nextProps.routes[nextProps.routes.length - 1]
    @setState activeTab: currentRoute.name

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  # May pull out hero and nav section out into its own reusable component
  render: ->
    <div className="secondary-page about-page">
      <section className="hero about-hero">
        <div className="hero-container">
          <Translate content="about.title" component="h1" />
          <nav className="hero-nav">
            <Link to="aboutIndex"><Translate content="about.nav.about" /></Link>
            <Link to="publications"><Translate content="about.nav.publications" /></Link>
            <Link to="team"><Translate content="about.nav.ourTeam" /></Link>
          </nav>
        </div>
      </section>
      <section className="about-page-content content-container">
        {if @state.activeTab is 'team'
          <TeamPage />
        else
          <Markdown>{counterpart "about.pageContent.#{@state.activeTab}"}</Markdown>
        }
      </section>
    </div>