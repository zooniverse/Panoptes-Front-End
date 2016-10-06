import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import React from 'react';
import { Link, IndexLink } from 'react-router';

const ChatWindow = React.createClass({
  getInitialState() {
      return {message: ''};
  },

  componentDidMount() {
    var channel = window.pusher.subscribe('panoptes-chat');
    var _this = this;
    channel.bind('chat', function(data) {
      console.log(data);
      _this.setState({message: data.message})
    });

    // this.setState({channel: channel});
  },

  componentWillUnmount() {
    window.pusher.unsubscribe('panoptes');
  },

  render() {
    return (
      <div className="chat-window" style={{fontSize: "2em", padding: "2em"}}>
        {this.state.message}
      </div>
    );
  },
});

export default ChatWindow;
