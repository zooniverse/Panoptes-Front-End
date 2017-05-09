import React from 'react';

class Publications extends React.Component {
  constructor(props) {
    super(props);
    this.renderNavbarItem = this.renderNavbarItem.bind(this);
    this.renderPublication = this.renderPublication.bind(this);
    this.renderProject = this.renderProject.bind(this);
  }

  renderNavbarItem(navItem) {
    const style = (navItem.active) ? { fontWeight: 700 } : {};
    return (
      <button
        className="secret-button side-bar-button"
        key={navItem.id}
        onClick={this.props.setFilter.bind(null, navItem.id)}
        style={style}
      >
        {navItem.content}
      </button>
    );
  }

  renderProject(project) {
    console.info(project.name || false, 'i')
    return (
      <div>
        <h3 className="project-name">
        </h3>
        <ul className="publications-list">
        </ul>
      </div>
    );
  }

  renderPublication() {
    return (<p></p>);
  }

  render() {
    const { props } = this;
    console.info(props)
    return (
      <div className="publications-page secondary-page-copy">

        <aside className="secondary-page-side-bar">
          <nav ref="sideBarNav">
            {props.navItems.map(this.renderNavbarItem)}
          </nav>
        </aside>

        <section className="publications-content">
          <h2>{props.title}</h2>
          {props.projects.map(this.renderProject)}
        </section>

      </div>
    );
  }
};

export default Publications
