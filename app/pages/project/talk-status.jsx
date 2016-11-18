import React, { PropTypes } from 'react';
import { sugarApiClient } from 'panoptes-client/lib/sugar';
import { Link } from 'react-router';
import talkClient from 'panoptes-client/lib/talk-client';
import apiClient from 'panoptes-client/lib/api-client';
import getSubjectLocation from '../../lib/get-subject-location';

class TalkStatus extends React.Component {

  constructor() {
    super();
    this.state = {
      talkImages: [],
      activeUsers: 0,
    };
  }

  componentWillMount() {
    let recentSubjects;
    this.talkItems();
    talkClient.type('discussions').get({ section: `project-${this.props.project.id}`, sort: '-created_at' })
    .then((discussions) => {
      recentSubjects = discussions.filter((discussion) => {
        if (discussion.focus_type === 'Subject') return discussion;
      });
      recentSubjects.splice(0, 3).map((subject) => {
        apiClient.type('subjects').get(subject.focus_id)
        .then((image) => {
          const newArray = this.state.talkImages.slice();
          newArray.push(image);
          this.setState({ talkImages: newArray });
        });
      });
    });
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
      <div className="project-home-page__section">

        {this.state.talkImages.map((image) => {
          return (
            <div key={image.id} className="project-home-page__talk-image">
              <img alt="" src={getSubjectLocation(image).src} />
            </div>
          );
        })}

        <div className="project-home-page__talk-stat">
          <span>
            <strong>{this.state.activeUsers}</strong> {peopleAmount} talking about <strong>{this.props.project.display_name}
            </strong> right now.
          </span>
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
