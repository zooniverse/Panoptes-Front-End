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
    var counts = {};
    Object.keys(teamMembers).map((member) => {
      if(counts[teamMembers[member].location]) {
        counts[teamMembers[member].location] += 1;
      }
      else {
        counts[teamMembers[member].location] = 1;   
      }
    });
    var all = 0;
    Object.keys(counts).map((key) => {
      if(key !== "alumni") {
        all += counts[key];
      }
    });
    counts["showAll"] = all;
    return counts;
  }

  renderNavItem(key, title, count) {
    return (
      <button key={key} 
              ref={key} 
              style={this.state.currentSort === key ? { fontWeight: 700 } : null } 
              onClick={() => this.showPeopleList(key)}
              className={"secret-button side-bar-button " + "nav-" + key}>
              <span>{title} ({count})</span>
      </button>
    );
  }

  renderSideBarNav(sideBarNav) {
    const counts = this.getCounts();
    return (
      <nav ref="sideBarNav">
        { Object.keys(sideBarNav).map((navItem) => {
            return this.renderNavItem(navItem, sideBarNav[navItem], counts[navItem])
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
          <h3>{teamMembers[member].name}, {counterpart(`about.team.content.${member}.title`)} {teamMembers[member].twitter ? <a href={"http://twitter.com/" + teamMembers[member].twitter} target="_blank"><i className="fa fa-twitter"></i></a> : null }</h3>
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