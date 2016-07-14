import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';
import HomePageSection from './generic-section';
import { Link } from 'react-router';
import StringTruncator from './string-truncator';

import style from './recent-messages.styl';
void style;

const LOADER_BULLETS = '• • •';

const RecentCollectionsSection = React.createClass({
  propTypes: {
    onClose: React.PropTypes.func,
  },

  contextTypes: {
    user: React.PropTypes.object,
  },

  getInitialState() {
    return {
      loading: false,
      error: null,
      conversations: [],
      messageAuthors: {},
      lastMessages: {},
    };
  },

  componentDidMount() {
    this.fetchConversations(this.context.user);
  },

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.user !== this.context.user) {
      this.fetchConversations(nextContext.user);
    }
  },

  fetchConversations(user) {
    this.setState({
      loading: true,
      error: null,
      converationPartners: {},
      lastMessages: {},
      messageAuthors: {},
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
  },

  fetchConversationPartner(conversation, currentUser) {
    return apiClient.type('users').get(conversation.links.users) // Talk's user links are broken.
    .catch(() => {
      return [];
    })
    .then((users) => {
      let partner = users.find((potentialPartner) => {
        return potentialPartner !== currentUser;
      });
      if (partner === undefined) {
        // Why're you talking to yourself?
        partner = currentUser;
      }
      this.state.converationPartners[conversation.id] = partner;
      this.forceUpdate();
      return partner;
    });
  },

  fetchLastMessage(conversation) {
    return conversation.get('messages', {
      page_size: 1,
      sort: '-created_at',
    })
    .catch(() => {
      return [];
    })
    .then(([message]) => {
      this.state.lastMessages[conversation.id] = message;
      this.forceUpdate();
      return this.fetchMessageAuthor(message)
      .then(() => {
        return message;
      });
    });
  },

  fetchMessageAuthor(message) {
    return apiClient.type('users').get(message.links.user) // Talk's user links are broken.
    .catch(() => {
      return null;
    })
    .then((author) => {
      this.state.messageAuthors[message.id] = author;
      this.forceUpdate();
      return author;
    });
  },

  renderConversation(conversation) {
    const partner = this.state.converationPartners[conversation.id];
    const message = this.state.lastMessages[conversation.id];
    const sentLastMessage = !!message && (this.state.messageAuthors[message.id] === this.context.user);

    return (
      <Link to={`/inbox/${conversation.id}`} className="recent-conversation-link">
        <span className="recent-conversation-link__direction">
          {sentLastMessage ? (
            'To'
          ) : (
            'From'
          )}
        </span>
        <span className="recent-conversation-link__partner">
          <img role="presentation" src="https://www.fillmurray.com/50/50" className="recent-conversation-link__partner-avatar" />{' '}
          {!!partner ? partner.display_name : LOADER_BULLETS}
        </span>

        <div className="recent-conversation-link__preview">
          <div className="recent-conversation-link__title">
            {conversation.title}
          </div>
          <div className="recent-conversation-link__body-preview">
            {!!message ? <StringTruncator>{message.body}</StringTruncator> : LOADER_BULLETS}
          </div>
        </div>
      </Link>
    );
  },

  render() {
    return (
      <HomePageSection
        title="Recent messages"
        loading={this.state.loading}
        error={this.state.error}
        onClose={this.props.onClose}
      >
        <div className="home-page-section__sub-header">
          <Link to="/inbox" className="outlined-button">See all</Link>
        </div>

        <ul className="recent-conversations-list">
          {this.state.conversations.map((conversation) => {
            return (
              <li key={conversation.id} className="recent-conversations-list__item">
                {this.renderConversation(conversation)}
              </li>
            );
          })}
        </ul>
      </HomePageSection>
    );
  },
});

export default RecentCollectionsSection;
