import {Socket, Presence} from 'phoenix';
import locationMatch from './location-match';

const commsURL = {
  // production: '79e8e05ea522377ba6db',
  // staging: 'wss://comms-staging.zooniverse.org/socket',
  development: 'ws://localhost:4000/socket',
};

const envFromBrowser = locationMatch(/\W?env=(\w+)/);
const envFromShell = process.env.NODE_ENV;
const DEFAULT_ENV = 'development';
const env = envFromBrowser || envFromShell || DEFAULT_ENV;

class CommsClient {
  constructor() {
    this.socket = new Socket(commsURL[env], {params: {token: null}});
    this.channels = {};
    this.presences = {};
    this.bindings = [];
    this.bindingRef = 0;
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
    this.channels = {};
    this.presences = {};
  }

  authenticate(auth) {
    this.socket.params = {token: auth._bearerToken}
    this.socket.disconnect()
    this.socket.connect()
  }

  setCurrentProject(projectId) {
    if (this.currentProjectId) {
      this.leave("lobby:project:" + this.currentProjectId);
    }

    if (projectId) {
      this.currentProjectId = projectId;
      this.join("lobby:project:" + projectId)
    }
  }

  join(topic) {
    let channel = this.socket.channel(topic, {});
    this.channels[topic] = channel;
    this.presences[topic] = {};

    channel.on("presence_state", state => {
      this.presences[topic] = Presence.syncState(this.presences[topic], state)
      this.trigger("presenceChange", this.presences);
    })

    channel.on("presence_diff", diff => {
      this.presences[topic] = Presence.syncDiff(this.presences[topic], diff)
      this.trigger("presenceChange", this.presences);
    })

    channel.join();

    return channel;
  }

  leave(topic) {
    this.channels[topic].leave();
    this.channels[topic] = null;
  }

  on(event, callback) {
    let ref = this.bindingRef++;
    this.bindings.push({event, ref, callback});
    return ref;
  }

  off(event, ref) {
    this.bindings = this.bindings.filter((bind) => {
      return !(bind.event === event && (typeof ref === "undefined" || ref === bind.ref));
    });
  }

  trigger(event, payload){
    this.bindings.filter(bind => bind.event === event)
                 .map(bind => bind.callback(payload));
  }

  getUserIds(lobby) {
    let key = "lobby:" + lobby;

    if (this.presences[key]) {
      return Object.keys(this.presences[key]);
    } else {
      return [];
    }
  }
}

export {CommsClient};
