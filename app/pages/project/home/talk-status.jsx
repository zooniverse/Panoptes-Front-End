import React from 'react';
import { sugarApiClient } from 'panoptes-client/lib/sugar';
import { Link } from 'react-router';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';

counterpart.registerTranslations('en', {
  project: {
    home: {
      talk: {
        zero: 'Noone is talking about <strong>%(title)s</strong> right now.',
        one: '<strong>1</strong> person is talking about <strong>%(title)s</strong> right now.',
        other: '<strong>%(count)s</strong> people are talking about <strong>%(title)s</strong> right now.'
      },
      joinIn: 'Join in'
    }
  }
});

counterpart.registerTranslations('it', {
  project: {
    home: {
      talk: {
        zero: 'Nessuno sta parlando di <strong>%(title)s</strong> in questo momento.',
        one: '<strong>1</strong> persona sta parlando di <strong>%(title)s</strong> in questo momento.',
        other: '<strong>%(count)s</strong> persone stanno parlando di <strong>%(title)s</strong> in questo momento.'
      },
      joinIn: 'Partecipa'
    }
  }
});

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
            title: this.props.project.display_name
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
  }).isRequired
};
