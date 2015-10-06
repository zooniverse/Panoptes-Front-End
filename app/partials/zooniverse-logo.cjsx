React = require 'react'

module.exports = React.createClass
  displayName: 'ZooniverseLogo'

  getDefaultProps: ->
    width: '1em'
    height: '1em'

  render: ->
    useHTML = '''
      <use xlink:href="#zooniverse-logo-source" x="0" y="0" width="100" height="100" />
    '''

    <svg viewBox="0 0 100 100" width={@props.width} height={@props.height} className="zooniverse-logo" dangerouslySetInnerHTML={__html: useHTML} />
