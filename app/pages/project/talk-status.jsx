import React, {PropTypes} from 'react';
import {sugarApiClient} from 'panoptes-client/lib/sugar';
import {Link} from 'react-router';

class TalkStatus extends React.Component {

  constructor() {
    super();
    this.state = {
      talkImages: [],
      activeUsers: 0,
    };
  }

  componentWillMount() {
    this.talkItems();
  }

  talkItems() {
    sugarApiClient.get('/active_users', {channel: `project-${this.props.project.id}`})
    .then((activeUsers) => {
      this.setState({activeUsers: activeUsers.length})
    })
    .catch(() => {
      return null
    })
  }

  render() {
    const peopleAmount = this.state.activeUsers === 1 ? 'person is' : 'people are'

    return (
      <div className="project-home-page__talk-status">

        <div className="project-home-page__talk-image">
        </div>

        <div className="project-home-page__talk-image">
        </div>

        <div className="project-home-page__talk-image">
        </div>

        <div className="project-home-page__talk-stat">
          <strong>{this.state.activeUsers}</strong> {peopleAmount} talking about <strong>{this.props.project.display_name}</strong> right now.
          <Link to={`/projects/${this.props.project.slug}/talk`} className="call-to-action standard-button">Join In</Link>
        </div>

      </div>
    );
  }
}

TalkStatus.propTypes = {
  project: React.PropTypes.object.isRequired,
};

TalkStatus.defaultProps = {
  project: {},
};

export default TalkStatus;
