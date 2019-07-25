import PropTypes from 'prop-types';
import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';
import classnames from 'classnames';
import HomePageSection from './generic-section';
import { Link } from 'react-router';
import StringTruncator from './string-truncator';


const LOADER_BULLETS = '• • •';

class RecentCollectionsSection extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  };

  static contextTypes = {
    user: PropTypes.object.isRequired,
  };

  state = {
    loading: false,
    error: null,
    conversations: [],
    messageAuthors: {},
    avatars: {},
    lastMessages: {},
  };

  componentDidMount() {
    this.fetchConversations(this.context.user);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.user !== this.context.user) {
      this.fetchConversations(nextContext.user);
    }
  }

  fetchConversations = (user) => {
    this.setState({
      loading: true,
      error: null,
      conversationPartners: {},
      messageAuthors: {},
      avatars: {},
      lastMessages: {},
    });

    talkClient.type('conversations').get({
      user_id: user.id,
      page_size: 10,
      sort: '-updated_at',
      include: 'users',
    })
    .then((conversations) => {
      this.setState({ conversations });

      return Promise.all(conversations.map((conversation) => {
        return Promise.all([
          this.fetchConversationPartner(conversation, user),
          this.fetchLastMessage(conversation),
        ]);
      }));
    })
    .catch((error) => {
      this.setState({
        error: error,
        conversations: [],
      });
    })
    .then(() => {
      this.setState({
        loading: false,
      });
    });
  };

  fetchConversationPartner = (conversation, currentUser) => {
    return apiClient.type('users').get(conversation.links.users) // Talk's user links are broken.
    .catch(() => {
      return [];
    })
    .then((users) => {
      if (users.length > 0) {
        let partner = users.find((potentialPartner) => {
          return potentialPartner !== currentUser;
        });
        if (partner === undefined) {
          // Why're you talking to yourself?
          partner = currentUser;
        }
        const newState = Object.assign({}, this.state.conversationPartners);
        newState[conversation.id] = partner;
        this.setState({
          conversationPartners: newState,
        });
        return partner;
      } else {
        return null;
      }
    });
  };

  fetchLastMessage = (conversation) => {
    return conversation.get('messages', {
      page_size: 1,
      sort: '-created_at',
    })
    .catch(() => {
      return [];
    })
    .then(([message]) => {
      const newState = Object.assign({}, this.state.lastMessages);
      newState[conversation.id] = message;
      this.setState({
        lastMessages: newState,
      });
      return this.fetchMessageAuthor(message)
      .then(() => {
        return message;
      });
    });
  };

  fetchMessageAuthor = (message) => {
    return apiClient.type('users').get(message.links.user) // Talk's user links are broken.
    .catch(() => {
      return null;
    })
    .then((author) => {
      const authorState = Object.assign({}, this.state.messageAuthors);
      authorState[message.id] = author;
      this.setState({
        messageAuthors: authorState,
      });
      if (author) {
        return author.get('avatar')
        .catch(() => {
          return [];
        })
        .then((avatars) => {
          const avatar = [].concat(avatars)[0]; // Why's this an array?
          const avatarState = Object.assign({}, this.state.avatars);
          avatarState[author.id] = avatar;
          this.setState({
            avatars: avatarState,
          });
          return author;
        });
      } else {
        return {};
      }
    });
  };

  renderConversation = (conversation, index, allConversations) => {
    const partner = this.state.conversationPartners[conversation.id];
    if (!partner) {
      return null;
    }
    const message = this.state.lastMessages[conversation.id];
    const sentLastMessage = !!message && (this.state.messageAuthors[message.id] === this.context.user);

    let avatarSrc = '/assets/simple-avatar.png';
    if (!!partner && !!this.state.avatars[partner.id]) {
      avatarSrc = this.state.avatars[partner.id].src;
    }

    const allClassNames = classnames('recent-conversation-link', {
      'recent-conversation-link--first': index === 0,
      'recent-conversation-link--last': index === allConversations.length - 1,
    });

    return (
      <Link to={`/inbox/${conversation.id}`} className={allClassNames}>
        <span className="recent-conversation-link__direction">
          {sentLastMessage ? (
            'To'
          ) : (
            'From'
          )}
        </span>
        <img role="presentation" src={avatarSrc} className="recent-conversation-link__partner-avatar" />
        <span className="recent-conversation-link__partner">
          {partner ? partner.display_name : LOADER_BULLETS}
        </span>

        <div className="recent-conversation-link__preview">
          <div className="recent-conversation-link__title">
            {conversation.title}
          </div>
          <div className="recent-conversation-link__body-preview">
            {message ? <StringTruncator>{message.body}</StringTruncator> : LOADER_BULLETS}
          </div>
        </div>
      </Link>
    );
  };

  render() {
    return (
      <HomePageSection
        titleFill="#11497f"
        title="Recent messages"
        loading={this.state.loading}
        error={this.state.error}
        onClose={this.props.onClose}
      >
        <div className="home-page-section__sub-header">
          <Link to="/inbox" className="outlined-button">See all</Link>
        </div>

        {this.state.conversations.length === 0 && (
          <div className="home-page-section__header-label">
            <p> Your inbox is empty. </p>
          </div>
        )}

        <ul className="recent-conversations-list">
          {this.state.conversations.map((conversation, i, allConversations) => {
            return (
              <li key={conversation.id} className="recent-conversations-list__item">
                {this.renderConversation(conversation, i, allConversations)}
              </li>
            );
          })}
        </ul>
      </HomePageSection>
    );
  }
}

export default RecentCollectionsSection;