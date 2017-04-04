React = require 'react'
{Link} = require 'react-router'

module.exports = (props) =>
  <div className="content-container">
    <p>Your classification stats are now displayed on <Link to="/">your Zooniverse home page</Link>.</p>
  </div>