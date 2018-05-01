import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import Translate from 'react-translate-component';
import SubjectViewer from '../../components/subject-viewer';
import Thumbnail from '../../components/thumbnail';
import getSubjectLocations from '../../lib/get-subject-locations';

class Recents extends React.Component {
  constructor() {
    super();
    this.state = {
      recents: []
    };
  }

  componentDidMount() {
    const { user } = this.props;
    if (user && user.get) {
      user.get('recents', { project_id: this.props.project.id, sort: '-created_at' })
        .then(recents => this.setState({ recents }));
    }
  }

  render() {
    const { user, project } = this.props;
    return (
      <div className="collections-page secondary-page has-project-context">
        <div className="hero collections-hero">
          <div className="hero-container">
            <Translate content="classifier.recents" component="h1" />
          </div>
        </div>
        {(this.state.recents.length > 0) &&
          <div className="content-container collection-page-with-project-context">
            <ul className="collections-show">
              {this.state.recents.map((recent) => {
                const locations = getSubjectLocations(recent);
                let type = '';
                let format = '';
                let src = '';
                if (locations.image) {
                  type = 'image';
                  [format, src] = locations.image;
                } else if (locations.video) {
                  type = 'video';
                  [format, src] = locations.video;
                }
                const fakeSubject = {
                  id: recent.links.subject,
                  locations: [{ [`${type}/${format}`]: src }]
                };
                return (
                  <li key={recent.id} className="collection-subject-viewer">
                    <SubjectViewer
                      project={project}
                      subject={fakeSubject}
                      user={user}
                    >
                      <Link
                        className="subject-link"
                        to={`/projects/${project.slug}/talk/subjects/${recent.links.subject}`}
                      >
                        <Thumbnail
                          alt={`Subject ${recent.links.subject}`}
                          src={src}
                          type={type}
                          format={format}
                          height={250}
                        />
                      </Link>
                    </SubjectViewer>
                  </li>
                );
              })}
            </ul>
          </div>
        }
      </div>
    );
  }
}

Recents.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string
  }).isRequired,
  user: PropTypes.shape({
    get: PropTypes.func
  }).isRequired
};

export default Recents;
