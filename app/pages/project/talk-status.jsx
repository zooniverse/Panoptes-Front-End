import React from 'react';
import { sugarApiClient } from 'panoptes-client/lib/sugar';
import { Link } from 'react-router';
import talkClient from 'panoptes-client/lib/talk-client';
import apiClient from 'panoptes-client/lib/api-client';
import getSubjectLocation from '../../lib/get-subject-location';

export default class TalkStatus extends React.Component {

  constructor() {
    super();
    this.state = {
      talkImages: [],
      activeUsers: 0,
    };
  }

  componentWillMount() {
    this.talkItems();
    talkClient.type('comments').get({ section: `project-${this.props.project.id}`, sort: '-created_at', focus_type: 'Subject' })
    .then((comments) => {
      comments.splice(0, 3).map((comment) => {
        apiClient.type('subjects').get(comment.focus_id)
        .then((image) => {
          const newArray = this.state.talkImages.slice();
          newArray.push(image);
          this.setState({ talkImages: newArray });
        });
      });
    })
    .then(() => {
      if (this.state.talkImages.length < 3) {
        do {
          this.state.talkImages.push('/assets/default-project-background.jpg');
        } while (this.state.talkImages.length < 3);
      }
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
          if (typeof (image) === 'string') {
            return (
              <div key={image.id} className="project-home-page__talk-image">
                <img alt="" src={image} />
              </div>
            );
          }
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
          <Link to={`/projects/${this.props.project.slug}/talk`} className="join-in standard-button">Join In</Link>
        </div>

      </div>
    );
  }
}

TalkStatus.defaultProps = {
  project: {},
};

TalkStatus.propTypes = {
  project: React.PropTypes.shape({
    display_name: React.PropTypes.string,
    id: React.PropTypes.string,
    slug: React.PropTypes.string,
  }).isRequired,
};
