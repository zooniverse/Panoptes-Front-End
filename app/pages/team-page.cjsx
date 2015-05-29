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

module.exports = React.createClass
  displayName: 'TeamPage'

  render: ->
    sideBarNav = counterpart "team.nav"
    <div className="team-page">
      <aside className="side-bar">
        <nav>
          {for navItem of sideBarNav
            <button key={navItem} className="secret-button"><Translate content="team.nav.#{navItem}" /></button>
          }
        </nav>
      </aside>
      <section>

      </section>
    </div>