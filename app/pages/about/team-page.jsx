import React from 'react';
import counterpart from 'counterpart';
import { teamMembers } from './team-members';

export default class TeamPage extends React.Component {

  constructor() {
    super();
    this.state = {
      currentSort: 'showAll',
    };
    this.showPeopleList = this.showPeopleList.bind(this);
  }

  showPeopleList(key) {
    this.setState({currentSort: key});
  }

  getCounts() {
    const counts = {};
    Object.keys(teamMembers).forEach((member) => {
      if (counts[teamMembers[member].location]) {
        counts[teamMembers[member].location] += 1;
      }
      else {
        counts[teamMembers[member].location] = 1;   
      }
    });
    let all = 0;
    Object.keys(counts).forEach((key) => {
      if (key !== "alumni") {
        all += counts[key];
      }
    });
    counts["showAll"] = all;
    return counts;
  }

  renderSideBarNav(sideBarNav) {
    const counts = this.getCounts();
    return (
      <nav>
        { Object.keys(sideBarNav).map((navItem) => {
            return (<button key={navItem}
                      style={this.state.currentSort === navItem ? { fontWeight: 700 } : null }
                      onClick={() => this.showPeopleList(navItem)}
                      className={`secret-button side-bar-button nav-${navItem}`}>
                      <span>{sideBarNav[navItem]} ({counts[navItem]})</span>
                    </button>);
          })
        }
      </nav>
    );
  }

  renderMemberHeading(sideBarNav) {
    return (
      <h2> 
        { this.state.currentSort === 'showAll' 
            ? counterpart("about.team.content.header.showAll") 
            : sideBarNav[this.state.currentSort]
        }
      </h2>
    );
  }

  renderMember(member) {
    return (
      <div key={member} className="team-member">
        <img src={teamMembers[member].image} alt={teamMembers[member].name} />
        <div className="team-member-details">
          <h3>{teamMembers[member].name}, {counterpart(`about.team.content.${member}.title`)} {teamMembers[member].twitter ? <a rel="noopener noreferrer" href={`http://twitter.com/${teamMembers[member].twitter}`} target="_blank"><i className="fa fa-twitter"></i></a> : null }</h3>
          <p>{counterpart(`about.team.content.${member}.bio`)}</p>
        </div>
      </div>  
    );
  }

  renderMemberList() {
    return Object.keys(teamMembers).map((member) => {
      if(teamMembers[member].location === this.state.currentSort || this.state.currentSort === "showAll" && teamMembers[member].location !== "alumni" )  {
        return this.renderMember(member);
      }
      return null;
    });
  }
 
  render() {
    const sideBarNav = counterpart("about.team.nav");
    return (
      <div className="team-page secondary-page-copy">
        <aside className="secondary-page-side-bar">
          { this.renderSideBarNav(sideBarNav) }
        </aside>
        <section className="team-member-list">
          { this.renderMemberHeading(sideBarNav) }
          { this.renderMemberList() } 
        </section>
      </div>
    );
  }
}