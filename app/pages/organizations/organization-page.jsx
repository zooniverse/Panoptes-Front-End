import React from 'react';
import ProjectCard from '../../partials/project-card';
import Thumbnail from '../../components/thumbnail';
import WarningBanner from '../../classifier/warning-banner';

const AVATAR_SIZE = 100;

const OrganizationProjectCard = ({ collaboratorView, project }) => {
  let statusMessage;
  if (project.launch_approved === true) {
    statusMessage = 'Launch Approved';
  } else if (project.launch_approved === false) {
    statusMessage = 'NOT PUBLICLY VISIBILE';
  } else {
    statusMessage = 'UNKNOWN';
  }

  return (
    <div className="organization-project">
      <ProjectCard project={project} />
      {collaboratorView &&
        <WarningBanner className="warning-banner" label={statusMessage}>
          <p>something something ok cool</p>
        </WarningBanner>}
    </div>);
};

OrganizationProjectCard.propTypes = {
  collaboratorView: React.PropTypes.bool,
  project: React.PropTypes.shape({
    id: React.PropTypes.string,
    display_name: React.PropTypes.string
  })
};

class OrganizationPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backgroundHeight: null
    };

    this.resizeBackground = this.resizeBackground.bind(this);
  }

  componentDidMount() {
    this.resizeBackground();
    addEventListener('resize', this.resizeBackground);
  }

  componentWillUnmount() {
    removeEventListener('resize', this.resizeBackground);
  }

  resizeBackground() {
    const orgHero = this.organizationHero;
    if (orgHero) {
      const sectionBottom = orgHero.getBoundingClientRect().bottom;
      const sectionHeight = document.body.scrollTop + sectionBottom;
      if (this.state.backgroundHeight !== sectionHeight) {
        this.setState({ backgroundHeight: sectionHeight });
      }
    }
  }

  render() {
    let backgroundStyle = {};
    if (this.props.organizationBackground) {
      backgroundStyle = {
        backgroundImage: `url(${this.props.organizationBackground.src})`,
        height: this.state.backgroundHeight
      };
    }

    return (
      <div className="organization-page">
        <div
          className="project-background"
          style={backgroundStyle}
        />
        <div className="project-home-page">
          <section
            className="organization-hero"
            ref={(node) => { this.organizationHero = node; }}
          >
            <div className="organization-hero__container">
              {this.props.organizationAvatar &&
                <Thumbnail
                  src={this.props.organizationAvatar.src}
                  className="avatar organization-hero__avatar"
                  width={AVATAR_SIZE}
                  height={AVATAR_SIZE}
                />}
              <div>
                <h1 className="organization-hero__title">{this.props.organization.display_name}</h1>
                <h5 className="organization-hero__description">{this.props.organization.description}</h5>
              </div>
            </div>
          </section>
          <section className="resources-container">
            <div className="organization-projects">
              <div className="project-card-list">
                {this.props.organization.projects.map(project =>
                  <OrganizationProjectCard
                    collaboratorView={this.props.collaboratorView}
                    key={project.id}
                    project={project}
                  />)}
              </div>
            </div>
          </section>
          <section className="organization-details">
            <p>Details like description, stats and about info will go here, omitting to keep PR compact.</p>
          </section>
        </div>
      </div>);
  }
}

OrganizationPage.defaultProps = {
  collaboratorView: false,
  organization: {},
  organizationAvatar: null,
  organizationBackground: null
};

OrganizationPage.propTypes = {
  collaboratorView: React.PropTypes.bool,
  organization: React.PropTypes.shape({
    description: React.PropTypes.string,
    display_name: React.PropTypes.string,
    id: React.PropTypes.string,
    introduction: React.PropTypes.string,
    projects: React.PropTypes.arrayOf(React.PropTypes.object)
  }).isRequired,
  organizationAvatar: React.PropTypes.shape({
    src: React.PropTypes.string
  }),
  organizationBackground: React.PropTypes.shape({
    src: React.PropTypes.string
  })
};

export default OrganizationPage;
