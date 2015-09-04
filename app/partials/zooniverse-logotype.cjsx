React = require 'react'

module.exports = React.createClass
  displayName: 'ZooniverseLogoType'

  getDefaultProps: ->
    width: '178px'
    height: '18px'

  render: ->
    @titleID ?= 'logo_' + Math.random()

    useHTML = "
      <title id=#{@titleID}>Zooniverse</title>
      <use xlink:href='#zooniverse-logotype-source' x='0' y='0' width='178px' height='18px' />
    "

    <svg viewBox="0 0 178 18" width={@props.width} height={@props.height} aria-labelledby={@titleID} role="img" className="zooniverse-logotype" dangerouslySetInnerHTML={__html: useHTML} />
