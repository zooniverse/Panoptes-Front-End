import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import Publications from '../../lib/publications';
import counterpart from 'counterpart';
import Loading from '../../components/loading-indicator';
import { Markdown } from 'markdownz';

export default class PublicationsPage extends React.Component {

  constructor() {
    super();
    this.state = {
      currentSort: 'showAll',
    };
    this.showPublicationsList = this.showPublicationsList.bind(this);

  }

  componentDidMount() {
    this.loadProjects();
  }

  showPublicationsList(key) {
    this.setState({ currentSort: key });
  }

  projectSlugs() {
    const slugs = [];
    Object.keys(Publications).forEach((category) => {
      Publications[category].forEach((project) => {
        slugs.push(project.slug);
      });
    });
    return slugs;
  }

  loadProjects() {
    const slugs = this.projectSlugs();
    const page_size = slugs.length;
    apiClient.type('projects')
        .get({
          slugs,
          cards: true,
          page_size
        }).then((result) => {
          const projects = {};
          result.forEach((project) => {
            projects[project.slug] = project;
          });
          this.setState({
            projects
          });
        });
  }

  renderSideBarNav(sideBarNav) {
    return (
      <nav>
        {Object.keys(sideBarNav).map(navItem => (
          <button
            key={navItem}
            style={this.state.currentSort === navItem ? { fontWeight: 700 } : null}
            onClick={() => this.showPublicationsList(navItem)}
            className={'secret-button side-bar-button'}
          >
            <span>{sideBarNav[navItem]}</span>
          </button>
        ))}
      </nav>
    );
  }

  renderHeading(sideBarNav) {
    return (
      <h2> 
        { this.state.currentSort === 'showAll' 
            ? counterpart('about.publications.content.header.showAll') 
            : sideBarNav[this.state.currentSort]
        }
      </h2>
    );
  }

  renderProjects() {
    return (
      Object.keys(Publications).map((category) => {
        if (this.state.currentSort === category || this.state.currentSort === 'showAll') {
          return (
            <div key={category} className="publications-list">
              {
                Publications[category].map((projectListing) => {
                  const project = this.state.projects[projectListing.slug]; 
                  return (
                    <div key={projectListing.name !== undefined ? projectListing.name : projectListing.slug}>
                      <div>
                        <h3 className="project-name">
                          { project !== undefined  
                              ? project.display_name 
                              : projectListing.name
                          }
                        </h3>
                        <span className="publication-count">{` (${projectListing.publications.length})`}</span>
                      </div>
                      <ul className="publications">
                        {projectListing.publications.map(publication => (
                          <li key={`publication-${Math.random()}`} className="publication-item">
                            {this.avatarFor(project)}
                            <div className="citation">
                              <p>
                                <cite>{publication.citation}</cite><br />
                                {publication.href !== undefined ? <a href={publication.href} target="_blank" rel="noopener noreferrer" >{counterpart('about.publications.publication.viewPublication')}</a> : null }{' '}
                                {publication.openAccess ? <a href={publication.openAccess} target="_blank" rel="noopener noreferrer" >{counterpart('about.publications.publication.viewOpenAccess')}</a> : null }
                              </p>
                            </div>
                          </li>
                        ))}                        
                      </ul>
                    </div>
                  );
                })
              }
            </div>
          );
        }
        return null;
      })
    );
  }

  render() {
    const sideBarNav = counterpart('about.publications.nav');
    const submitNewPublication = counterpart('about.publications.content.submitNewPublication')
    return (
      <div className="publications-page secondary-page-copy">
        <aside className="secondary-page-side-bar">
          { this.renderSideBarNav(sideBarNav) }
        </aside>
        <section className="publications-content">
          { this.renderHeading(sideBarNav) }
          <Markdown>{submitNewPublication}</Markdown>
          { this.state.projects != null 
              ? this.renderProjects()
              : <Loading />
          }
        </section>
      </div>
    );
  }

  avatarFor(project) {
    const src = project !== undefined ? `//${project.avatar_src}` : '/assets/simple-avatar.png';
    return <img src={src} alt="Project Avatar" />;
  }
} 
