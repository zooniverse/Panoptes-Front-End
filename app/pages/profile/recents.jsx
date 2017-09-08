import React from 'react';
import { Link } from 'react-router';
import Translate from 'react-translate-component';
import Thumbnail from '../../components/thumbnail';

class Recents extends React.Component {
  constructor() {
    super();
    this.state = {
      recents: []
    };
  }

  componentDidMount() {
    const { user } = this.props;
    user.get('recents', { project_id: this.props.project.id, sort: '-created_at' })
    .then(recents => this.setState({ recents }));
  }

  render() {
    const { project } = this.props;
    return (
      <div className="secondary-page">
        <h2><Translate content="classifier.recents" /></h2>
        {this.state.recents.map(recent => (
          <Link to={`/projects/${project.slug}/talk/subjects/${recent.links.subject}`}>
            <Thumbnail alt={`Subject ${recent.links.subject}`} src={recent.locations[0]['image/jpeg']} width={150} />
          </Link>
          )
        )}
      </div>
    );
  }
}

export default Recents;
