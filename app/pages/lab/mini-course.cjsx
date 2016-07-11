React = require 'react'
ProjectModalEditor = require '../../partials/project-modal-editor'

module.exports = React.createClass
  displayName: 'EditMiniCourse'

  render: ->
    <div>
      <div>
        <p>The mini-course is an educational tool used to improve quality of classifications and retain volunteer interest through presenting information on the tips & tricks of quality classification, the research process, and the team behind your project.</p>
        <p>Some things to know: The mini-course will interrupt the volunteer every 5th classification. The volunteer will always be given the option to opt out. If you need to add a caption to an image, especially for credit, then include <pre><code>###### example caption text</code></pre> at the start of your text. You can reorder the steps by clicking and dragging on the left gray tab. It is important to keep each step brief so volunteers can get back to classifying as soon as possible!</p>
      </div>
      <div>
        <ProjectModalEditor project={@props.project} kind="mini-course" />
      </div>
    </div>