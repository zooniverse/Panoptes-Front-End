# @cjsx React.DOM

React = require 'react'

module.exports = React.createClass
  displayName: 'AccountBar'

  render: ->
    <div className="account-bar">
      <a href="#/edit/account">USER_NAME_OR_LOGIN</a>

      <span className="badge">
        <button type="button">GROUP_NAME</button>
      </span>

      <img src="https://pbs.twimg.com/profile_images/437294429955563520/MM1_4w75.jpeg" className="avatar" />
    </div>
