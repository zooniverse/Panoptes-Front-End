import PropTypes from 'prop-types';
import React from 'react';
import { sugarApiClient } from 'panoptes-client/lib/sugar';
import { Link } from 'react-router';
import { Markdown } from 'markdownz';
import counterpart from 'counterpart';
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
        <Markdown>
          {counterpart(
            'project.home.talk',
            {
              count: parseInt(this.state.activeUsers, 10),
              title: this.props.translation.display_name
            }
          )}
        </Markdown>
        <div>
          <Link to={`/projects/${this.props.project.slug}/talk`} className="join-in project-home-page__button">
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
  project: PropTypes.shape({
    display_name: PropTypes.string,
    id: PropTypes.string,
    slug: PropTypes.string
  }).isRequired,
  translation: PropTypes.shape({
    description: PropTypes.string,
    display_name: PropTypes.string,
    introduction: PropTypes.string,
    researcher_quote: PropTypes.string,
    title: PropTypes.string
  }).isRequired
};
