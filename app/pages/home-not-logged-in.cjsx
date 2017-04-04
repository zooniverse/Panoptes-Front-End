React = require 'react'
ReactDOM = require 'react-dom'
{Link} = require 'react-router'
ZooniverseLogo = require '../partials/zooniverse-logo'
`import FeaturedProject from './home-common/featured-project';`
`import HomePageDiscover from './home-not-logged-in/discover';`
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
    <div className="on-home-page home-page-not-logged-in">
      <div className="flex-container">
        <section className="home-intro">
          <img className="home-mobile-video-image" src="./assets/home-video.jpg" />
          <video className="home-video" autoPlay loop>
            <source type="video/ogg" src="./assets/home-video.ogv"></source>
            <source type="video/webm" src="./assets/home-video.webm"></source>
            <source type="video/mp4" src="./assets/home-video.mp4"></source>
          </video>

          <h5 className="main-kicker">welcome to the zooniverse</h5>
          <h1 className="main-headline">People-powered research</h1>
          <div className="home-intro-buttons">
            <Link to="/projects" className="primary-button">See All Projects</Link>
          </div>
        </section>
      </div>

      <div className="flex-container">
        <FeaturedProject />
      </div>

      <div className="flex-container">
        <HomePageDiscover />
      </div>

      <div className="flex-container">
        <HomePagePromoted />
      </div>

      <div className="flex-container">
        <HomePageSocial />
      </div>
    </div>
