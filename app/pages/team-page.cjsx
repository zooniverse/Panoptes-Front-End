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
      minnesota: ''' '''
      portsmouth: ''' '''
      taipei: ''' '''

teamMembers =
  oxford:
    adamMcMaster:
      name: 'Adam McMaster'
      twitter: 'astopy'
      title: counterpart "team.content.adamMcMaster.title"
      bio: counterpart "team.content.adamMcMaster.bio"
    alexBowyer:
      name: 'Alex Bowyer'
      twitter: 'alexbfree'
      title: counterpart "team.content.alexBowyer.title"
      bio: counterpart "team.content.alexBowyer.bio"
  chicago:
    alexWeiksnar:
      name: 'Alex Weiksnar'
      title: counterpart "team.content.alexWeiksnar.title"
      bio: counterpart "team.content.alexWeiksnar.bio"

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

