React = require 'react'
{Link} = require 'react-router'

module.exports = (props) =>
  <div className="content-container">
    <p>Your classification stats are now displayed on <Link to="https://www.zooniverse.org">your Zooniverse home page</Link>.</p>
  </div>
