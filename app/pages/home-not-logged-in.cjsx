React = require 'react'
ReactDOM = require 'react-dom'
{Link} = require 'react-router'
ZooniverseLogo = require '../partials/zooniverse-logo'
HomePageSocial = require './home-not-logged-in/social'
HomePagePromoted = require './home-not-logged-in/promoted'
HomePageFeaturedCollections = require './home-not-logged-in/featured-collections'

module.exports = React.createClass
  displayName: 'HomePage'

  componentDidMount: ->
    document.documentElement.classList.add 'on-home-page-not-logged-in'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-home-page-not-logged-in'

  scrollDown: (e) ->
    e.preventDefault()
    ReactDOM.findDOMNode(@refs.discover)?.scrollIntoView behavior: 'smooth', block: 'start'

  render: ->
    <div className="home-page-not-logged-in">
      <section className="home-intro">
        <img className="home-mobile-video-image" src="./assets/home-video.jpg" />
        <video className="home-video" autoPlay loop>
          <source type="video/ogg" src="./assets/home-video.ogv"></source>
          <source type="video/webm" src="./assets/home-video.webm"></source>
          <source type="video/mp4" src="./assets/home-video.mp4"></source>
        </video>

        <h1>THE ZO<ZooniverseLogo />NIVERSE</h1>
        <h2 className="lighter">is people powered research</h2>
        <h2>
          <Link to="/about" className="standard-button">Learn More</Link>
        </h2>
      </section>

      <button className="home-link-down" onClick={@scrollDown}>
        <i className="fa fa-angle-down" onClick={@scrollDown} />
      </button>

      <section className="home-discover" ref="discover">
        <h1>Discover, teach, and learn</h1>

        <p>
          The Zooniverse enables everyone to take part in real cutting edge
          research in many fields across the sciences, humanities, and more.
          The Zooniverse creates opportunities for you to unlock answers and
          contribute to real discoveries.
        </p>

        <h2>
          <Link to="/projects" className="standard-button">Get started</Link>
        </h2>
      </section>

      <HomePagePromoted />

      <HomePageFeaturedCollections />

      <HomePageSocial />
    </div>
