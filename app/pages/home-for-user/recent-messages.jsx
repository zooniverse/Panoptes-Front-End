import React from 'react';
import HomePageSection from './generic-section';
import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';

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

  render() {
    return (
      <HomePageSection
        title="Recent messages"
        loading={this.state.loading}
        error={this.state.error}
        onClose={this.props.onClose}
      >
        {this.state.conversations.map((conversation) => {
          const partner = this.state.converationPartners[conversation.id];
          const message = this.state.lastMessages[conversation.id];
          const sentLastMessage = !!message && (this.state.messageAuthors[message.id] === this.context.user);

          return (
            <div key={conversation.id}>
              <b>TITLE</b>: {conversation.title}{' '}
              <b>
                {sentLastMessage ? (
                  'TO'
                ) : (
                  'FROM'
                )}
              </b>: {!!partner ? partner.display_name : LOADER_BULLETS}
              <br />
              <b>LAST MESSAGE</b>: {!!message ? message.body : LOADER_BULLETS}
              <hr />
            </div>
          );
        })}
      </HomePageSection>
    );
  },
});

export default RecentCollectionsSection;
