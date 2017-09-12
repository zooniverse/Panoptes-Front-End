import React from 'react';
import Thumbnail from '../../components/thumbnail';

const AVATAR_SIZE = 100;

class OrganizationPage extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="organization-page">
        <section
          className="organization-hero"
          style={{ backgroundImage: `url(${this.props.organizationBackground.src})` }}
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
      </div>
    );
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
    introduction: React.PropTypes.string
  }).isRequired,
  organizationAvatar: React.PropTypes.shape({
    src: React.PropTypes.string
  }),
  organizationBackground: React.PropTypes.shape({
    src: React.PropTypes.string
  })
};

export default OrganizationPage;
