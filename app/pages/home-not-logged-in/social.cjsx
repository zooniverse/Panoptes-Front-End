React = require 'react'
moment = require 'moment'
talkClient = require 'panoptes-client/lib/talk-client'

module.exports = React.createClass
  displayName: 'HomePageSocial'

  getInitialState: ->
    social:
      tweets: []
      statuses: []
      posts: []

  componentDidMount: ->
    @loadSocial()

  loadSocial: ->
    request = new XMLHttpRequest()
    request.open 'GET', "#{ talkClient.root }/social", true
    request.onload = =>
      data = JSON.parse request.responseText
      @setState social: data
    request.send()

  render: ->
    <section className="home-social">
      <h1>Social Feed</h1>

      <div className="home-social-columns">
        <div className="home-social-column">
          <h2><a href="https://twitter.com/the_zooniverse">Twitter</a></h2>
          <ul>
            {for tweet, i in @state.social.tweets
              <li key={"tweet-#{i}"}>
                <p className="home-social-text">
                  <a href={"https://twitter.com/the_zooniverse/status/#{tweet.id_str}"}>{tweet.text}</a>
                </p>
                <p className="home-social-timestamp">
                  {moment(new Date(tweet.created_at)).fromNow()}
                </p>
              </li>}
          </ul>
        </div>

        <div className="home-social-column">
          <h2><a href="https://www.facebook.com/therealzooniverse">Facebook</a></h2>
          <ul>
            {for status, i in @state.social.statuses
              <li key="status-#{i}">
                <p className="home-social-text">
                  <a href={status.link}>{status.message}</a>
                </p>
                <p className="home-social-timestamp">
                  {moment(new Date(status.created_at)).fromNow()}
                </p>
              </li>}
          </ul>
        </div>

        <div className="home-social-column">
          <h2><a href="http://blog.zooniverse.org">Blog</a></h2>
          <ul>
            {for post, i in @state.social.posts
              <li key="post-#{i}">
                <p className="home-social-text">
                  <a href={post.link}>{post.title}</a>
                </p>
                <p className="home-social-timestamp">
                  {moment(new Date(post.created_at)).fromNow()}
                </p>
              </li>}
          </ul>
        </div>
      </div>
    </section>
