React = require 'react'
ReactDOM = require 'react-dom'
{Link} = require 'react-router'
ZooniverseLogo = require '../partials/zooniverse-logo'
HomePageSocial = require './home-not-logged-in/social'
HomePagePromoted = require './home-not-logged-in/promoted'

module.exports = React.createClass
  displayName: 'HomePage'

  componentDidMount: ->
    document.documentElement.classList.add 'on-home-page-not-logged-in'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-home-page-not-logged-in'

  scrollDown: (e) ->
    e.preventDefault()
    @refs.discover?.scrollIntoView behavior: 'smooth', block: 'start'

  render: ->
    <div className="home-page-not-logged-in">
      <div className="flex-container">
        <section className="home-intro">
          <img className="home-mobile-video-image" src="./assets/home-video.jpg" />
          <video className="home-video" autoPlay loop>
            <source type="video/ogg" src="./assets/home-video.ogv"></source>
            <source type="video/webm" src="./assets/home-video.webm"></source>
            <source type="video/mp4" src="./assets/home-video.mp4"></source>
          </video>

          <h1>THE ZO<ZooniverseLogo />NIVERSE</h1>
          <h2 className="lighter">is people powered research</h2>
          <div className="home-intro-buttons">
            <button className="standard-button" onClick={@scrollDown}>Learn More</button>
            <Link to="/projects" className="intro-button">Get Started</Link>
          </div>
          <button className="home-link-down" onClick={@scrollDown}>
            <i className="fa fa-angle-down" onClick={@scrollDown} />
          </button>
        </section>
      </div>

      <div className="flex-container">
        <section className="home-discover" ref="discover">
          <h1>Discover, teach, and learn</h1>

          <p>
            The Zooniverse enables everyone to take part in real cutting edge
            research in many fields across the sciences, humanities, and more.
            The Zooniverse creates opportunities for you to unlock answers and
            contribute to real discoveries.
          </p>

          <Link to="/projects" className="discover-button">Choose a Project</Link>
        </section>
      </div>

      <div className="flex-container">
        <HomePagePromoted />
      </div>

      <div className="flex-container">
        <HomePageSocial />
      </div>
    </div>
