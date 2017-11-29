import React from 'react';
import { sugarApiClient } from 'panoptes-client/lib/sugar';
import { Link } from 'react-router';
import Translate from 'react-translate-component';

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
    return (
      <div className="project-home-page__talk-stat">
        <Translate
          content="project.home.talk"
          with={{
            count: this.state.activeUsers,
            title: this.props.translation.display_name
          }}
          unsafe={true}
        />
        <div>
          <Link to={`/projects/${this.props.project.slug}/talk`} className="join-in standard-button">
            <Translate content="project.home.joinIn" />
          </Link>
        </div>
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
  }).isRequired,
  translation: React.PropTypes.shape({
    description: React.PropTypes.string,
    display_name: React.PropTypes.string,
    introduction: React.PropTypes.string,
    researcher_quote: React.PropTypes.string,
    title: React.PropTypes.string
  }).isRequired
};
