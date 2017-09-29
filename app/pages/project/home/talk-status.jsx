import React from 'react';
import { Link } from 'react-router';
import Translate from 'react-translate-component';

export default class TalkStatus extends React.Component {

  constructor() {
    super();
    this.state = {
      activeUsers: 0
    };

    this.talkItems = this.talkItems.bind(this);
  }

  componentWillMount() {
    let ref = this.context.comms.on("presenceChange", this.talkItems)
    this.setState({callbackRef: ref})
  }

  talkItems() {
    let userIds = this.context.comms.getUserIds("project:" + this.props.project.id)
    this.setState({activeUsers: userIds.length})
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

TalkStatus.contextTypes = {
  comms: React.PropTypes.object,
};

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
