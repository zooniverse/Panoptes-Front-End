import React from 'react';
import HomePageSection from './generic-section';
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
      converationPartners: {},
      lastMessages: {},
      messageAuthors: {},
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
      lastMessages: {},
      users: {},
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

  fetchConversationPartner(conversation, notThisOne) {
    return conversation.get('users')
    .catch(() => {
      return [];
    })
    .then((users) => {
      const partner = users.find((potentialPartner) => {
        return potentialPartner !== notThisOne;
      });
      this.state.converationPartners[conversation.id] = partner;
      this.forceUpdate();
    })
  },

  fetchLastMessage(conversation) {
    return conversation.get('messages', {
      page_size: 1,
    })
    .catch(() => {
      return [];
    })
    .then((messages) => {
      const message = messages[0];
      this.state.lastMessages[conversation.id] = message;
      this.forceUpdate();

      return this.fetchMessageAuthor(message);
    });
  },

  fetchMessageAuthor(message) {
    message.get('user')
    .catch(() => {
      return null;
    })
    .then((author) => {
      this.state.messageAuthors[message.id] = author;
      this.forceUpdate();
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
          const messageAuthor = !!message && this.state.messageAuthors[message.id];

          return (
            <div key={conversation.id}>
              <b>TITLE</b>: {conversation.title}{' '}
              <b>WITH</b>: {!!partner ? partner.display_name : LOADER_BULLETS}
              <br />
              <b>LAST MESSAGE</b>: {!!message ? message.body : LOADER_BULLETS}{' '}
              <b>BY</b>: {!!messageAuthor ? messageAuthor.display_name : LOADER_BULLETS}
              <hr />
            </div>
          );
        })}
      </HomePageSection>
    );
  },
});

export default RecentCollectionsSection;
