import React from 'react';
import { sugarApiClient } from 'panoptes-client/lib/sugar';
import { Link } from 'react-router';

export default class TalkStatus extends React.Component {

  constructor() {
    super();
    this.state = {
      activeUsers: 0
    };
  }

  componentWillMount() {
    this.talkItems();
  }

  talkItems() {
    sugarApiClient.get('/active_users', { channel: `project-${this.props.project.id}` })
    .then((activeUsers) => {
      this.setState({ activeUsers: activeUsers.length });
    })
    .catch(() => {
      return null;
    });
  }

  render() {
    const peopleAmount = this.state.activeUsers === 1 ? 'person is' : 'people are';

    return (
      <div className="project-home-page__talk-stat">
        <span>
          <strong>{this.state.activeUsers}</strong> {peopleAmount} talking about <strong>{this.props.project.display_name}
          </strong> right now.
        </span>
        <Link to={`/projects/${this.props.project.slug}/talk`} className="join-in standard-button">Join in</Link>
      </div>
    );
  }
}

TalkStatus.defaultProps = {
  project: {}
};

TalkStatus.propTypes = {
  project: React.PropTypes.shape({
    display_name: React.PropTypes.string,
    id: React.PropTypes.string,
    slug: React.PropTypes.string
  }).isRequired
};
