React = require 'react'
PromiseRenderer = require '../components/promise-renderer'

DEFAULT_AVATAR = './assets/simple-avatar.jpg'

module?.exports = React.createClass
  displayName: 'Avatar'

  propTypes:
    user: React.PropTypes.object # User response

  render: ->
    <PromiseRenderer
      promise={@props.user.get('avatar', {})}
      pending={null}
      then={([avatar]) =>
        <img src={avatar.src} alt={"User Avatar"} />
      }
      catch={->
        <img src={DEFAULT_AVATAR} alt={"User Avatar"} />
      }/>
