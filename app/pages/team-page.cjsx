counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
Markdown = require '../components/markdown'

counterpart.registerTranslations 'en',
  team:
    nav:
      oxford: 'Oxford'
      chicago: 'Chicago'
      minnesota: 'Minnesota'
      portsmouth: 'Portsmouth'
      taipei: 'Taipei'
      showAll: 'Show All'
    content:
      adamMcMaster:
        title: 'Infrastructure Engineer'
        bio: '''Adam is responsible for managing the Zooniverse's web hosting infrastructure.
        He has a computer science degree and has worked in web hosting and development for many years.
        He's also working on a degree in astronomy with the OU.'''
      alexBowyer:
        title: 'UX Developer'
        bio: '''Alex mostly works remotely for Zooniverse from his home in Northumberland.
        He's a web developer specializing in user experience, has a computer science degree,
        and has developed software & websites at large enterprises and startups.'''
      alexWeiksnar:
        title: 'Developer'
        bio: '''Alex previously attended University of Miami, where he studied Psychology,
        Biology, and English. Alex enjoys reading, coding, and sailing in his free time.'''
      aliSwanson:
        title: 'Researcher'
        bio: '''Ali spent most of her PhD chasing lions around the Serengeti. She finished
        her PhD in Ecology, Evolution, and Behavior at the University of Minnesota in 2014,
        and has since joined the Zooniverse as a Postdoc in Ecology and Citizen Science.'''
      brianCarstensen:
        title: 'UX Developer'
        bio: '''Brian Carstensen recently moved from Chicago to Oxford. Brian has a degree
        in graphic design from Columbia College in Chicago, and worked in that field for a
        number of years before finding a niche in web development.'''
      brookeSimmons:
        title: 'Researcher'
        bio: 'Brooke is an astrophysicist studying black holes, galaxies, and how citizen
        science can be applied to other non-traditional problems.'
      camAllen:
        title: 'Developer'
        bio: '''Web developer for the Zooniverse, enjoys building things on the internet while listening to funky tunes'''
      chrisLintott:
        title: 'Zooniverse PI'
        bio: '''Astronomer and founder of both Galaxy Zoo and the Zooniverse that grew from it,
        Chris is interested in how galaxies form and evolve, how citizen science can change the
        world, and whether the Chicago Fire can get their act together.'''
      chrisSnyder:
        title: 'Educator'
        bio: '''Chris Snyder began working on the Zooniverse team in fall 2012 as a web developer. In July 2013,
        he became the technical project manager. He received a degree in computer science from the University of Dayton.'''
      darrenMcRoy:
        title: 'Community Manager'
        bio: '''Darren (DZM) serves as a liaison to the Zooniverse community and assists with strategic
        content for projects. A Northwestern University graduate in journalism, he is also a golf addict,
        amateur author, and hopeless animal lover.'''
      edPaget:
        title: 'Developer'
        bio: '''Ed Paget joined Adler's Zooniverse Team as a software developer in August 2012.
        He previously worked as a freelance programmer and photographer. Ed graduated from
        Northwestern University with a major in Radio/TV/Film.'''
      grantMiller:
        title: 'Community Manager'
        bio: '''A former exoplanetary scientist, Grant is now responsible for looking after
        the interests of our volunteers. He is also behind the Zooniverse's presence on
        social media and publishes the Daily Zooniverse blog.'''
      gregHines:
        title: 'Data Scientist'
        bio: '''Greg uses machine learning and statistics to help projects analyse the volunteer
        classifications. He has a PhD in Computer Science from the University of Waterloo, Canada.
        In his spare time, Greg loves to eat pancakes with real maple syrup and run ultramarathons.'''
      heathVanSingel:
        title: 'Designer'
        bio: '''Heath is the UX/UI Designer for projects at the Zooniverse where he works to craft
        thoughtful and engaging user experiences. Apart from design Heath also enjoys illustration,
        a good sci-fi or fantasy novel, and trips back to Michigan.'''
      jimODonnell:
        title: 'UX Developer'
        bio: '''Professional cynic but his heart's not in it. Web developer for the Zooniverse,
        Web Standards organiser, Amnesty UK activist.'''
      julieFeldt:
        title: 'Educator'
        bio: '''Julie has a background in space physics and museum studies. She works on educational
        experiences, and Skype in the Classroom lessons for the Zooniverse. She loves to run, mostly
        to compensate for her love of cupcakes and chocolate.'''
      kellyBorden:
        title: 'Educator'
        bio: '''With a background in museum education, Kelly joined the Zooniverse in 2011 to bring
        an educator's perspective and spread the word amongst teachers and students. She's fond of
        several C's: chocolate, cats, coffee, and more chocolate.'''
      michaelParrish:
        title: 'Developer'
        bio: '''Software developer at the Zooniverse. Dog, fishing, snakes, and bourbon.'''
      rebeccaSmethurst:
        title: 'Researcher'
        bio: '''Becky is an astrophysicist working towards her doctorate in Oxford. She is
        interested in how galaxies change over time and how we can track this evolution.
        Happy-go-lucky about outreach, the Zooniverse and everything.'''
      sandorKruk:
        title: 'Researcher'
        bio: '''Sandor is a graduate student working on his PhD in Astrophysics at Oxford.
        He is looking at how galaxies evolve using data from Galaxy Zoo and enjoys stargazing,
        using telescopes, and dancing in his free time.'''
      victoriaVanHyning:
        title: 'Researcher'
        bio: '''Victoria is a Digital Humanities postdoc for the Zooniverse. She holds a masters
        in Medieval English literature from Oxford and a PhD in early modern English literature
        from the University of Sheffield. Coffee is her lifeblood.'''
      minnesota: ''' '''
      portsmouth: ''' '''
      taipei: ''' '''

teamMembers =
  oxford:
    adamMcMaster:
      name: "Adam McMaster"
      twitter: "astopy"
      title: counterpart "team.content.adamMcMaster.title"
      bio: counterpart "team.content.adamMcMaster.bio"
    alexBowyer:
      name: "Alex Bowyer"
      twitter: "alexbfree"
      title: counterpart "team.content.alexBowyer.title"
      bio: counterpart "team.content.alexBowyer.bio"
    aliSwanson:
      name: "Ali Swanson"
      twitter: "alicatzoo"
      title: counterpart "team.content.aliSwanson.title"
      bio: counterpart "team.content.aliSwanson.bio"
    brianCarstensen:
      name: "Brian Carstensen"
      twitter: "__brian_c__"
      title: counterpart "team.content.brianCarstensen.title"
      bio: counterpart "team.content.brianCarstensen.bio"
    brookeSimmons:
      name: "Brooke Simmons"
      twitter: "vrooje"
      title: counterpart "team.content.brookeSimmons.title"
      bio: counterpart "team.content.brookeSimmons.bio"
    camAllen:
      name: "Campbell Allen"
      title: counterpart "team.content.camAllen.title"
      bio: counterpart "team.content.camAllen.bio"
    chrisLintott:
      name: "Chris Lintott"
      twitter: "chrislintott"
      title: counterpart "team.content.chrisLintott.title"
      bio: counterpart "team.content.chrisLintott.bio"
    grantMiller:
      name: "Grant Miller"
      twitter: "mrniaboc"
      title: counterpart "team.content.grantMiller.title"
      bio: counterpart "team.content.grantMiller.bio"
    gregHines:
      name: "Greg Hines"
      title: counterpart "team.content.gregHines.title"
      bio: counterpart "team.content.gregHines.bio"
    jimODonnell:
      name: "Jim O'Donnell"
      twitter: "pekingspring"
      title: counterpart "team.content.jimODonnell.title"
      bio: counterpart "team.content.jimODonnell.bio"
    rebeccaSmethurst:
      name: "Rebecca Smethurst"
      twitter: "becky1505"
      title: counterpart "team.content.rebeccaSmethurst.title"
      bio: counterpart "team.content.rebeccaSmethurst.bio"
    sandorKruk:
      name: "Sandor Kruk"
      twitter: "kruksandor"
      title: counterpart "team.content.sandorKruk.title"
      bio: counterpart "team.content.sandorKruk.bio"
    victoriaVanHyning:
      name: "Victoria van Hyning"
      twitter: "VanHyningV"
      title: counterpart "team.content.victoriaVanHyning.title"
      bio: counterpart "team.content.victoriaVanHyning.bio"
  chicago:
    alexWeiksnar:
      name: "Alex Weiksnar"
      title: counterpart "team.content.alexWeiksnar.title"
      bio: counterpart "team.content.alexWeiksnar.bio"
    chrisSnyder:
      name: "Chris Snyder"
      twitter: "bumishness"
      title: counterpart "team.content.chrisSnyder.title"
      bio: counterpart "team.content.chrisSnyder.bio"
    darrenMcRoy:
      name: "Darren McRoy"
      title: counterpart "team.content.darrenMcRoy.title"
      bio: counterpart "team.content.darrenMcRoy.bio"
    edPaget:
      name: "Ed Paget"
      twitter: "edpaget"
      title: counterpart "team.content.edPaget.title"
      bio: counterpart "team.content.edPaget.bio"
    heathVanSingel:
      name: "Heath van Singel"
      title: counterpart "team.content.heathVanSingel.title"
      bio: counterpart "team.content.heathVanSingel.bio"
    julieFeldt:
      name: "Julie Feldt"
      twitter: "JulieAFeldt"
      title: counterpart "team.content.julieFeldt.title"
      bio: counterpart "team.content.julieFeldt.bio"
    kellyBorden:
      name: "Kelly Borden"
      twitter: "BordenKelly"
      title: counterpart "team.content.kellyBorden.title"
      bio: counterpart "team.content.kellyBorden.bio"
    michaelParrish:
      name: "Michael Parrish"
      twitter: "michael_parrish"
      title: counterpart "team.content.michaelParrish.title"
      bio: counterpart "team.content.michaelParrish.bio"


module.exports = React.createClass
  displayName: 'TeamPage'

  getInitialState: ->
    currentSort: 'showAll'

  render: ->
    sideBarNav = counterpart "team.nav"
    <div className="team-page">
      <aside className="side-bar">
        <nav>
          {for navItem of sideBarNav
            <button key={navItem} className="secret-button" onClick={@showPeopleList.bind(null, navItem)}><Translate content="team.nav.#{navItem}" /></button>
          }
        </nav>
      </aside>
      <section className="team-member-list">
        {unless @state.currentSort is 'showAll'
          for teamMember, details of teamMembers[@state.currentSort]
            <div key={teamMember} className="team-member">
              <img src="http://placehold.it/150x150" alt="#{details.name}" />
              <div className="team-member-details">
                <h4>{details.name}, {details.title} {if details.twitter then <a href="http://twitter.com/#{details.twitter}" target="_blank"><i className="fa fa-twitter"></i></a> }</h4>
                <p>{details.bio}</p>
              </div>
            </div>
        }
      </section>
    </div>

  showPeopleList: (navItem) ->
    @setState currentSort: navItem

