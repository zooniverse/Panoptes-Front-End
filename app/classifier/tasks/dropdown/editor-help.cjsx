React = require 'react'

module.exports =
  required: "Check this box if an option has to be provided before proceeding."

  allowCreate: "Check this box to allow a volunteer to type an unique answer, not provided as an option."

  options: <div className="content-container">
    <p>Add an option label individually <strong>OR</strong> copy and paste a list of option labels, <em>NO</em> header, and click the 'Add' button. An example of a list of option labels is as follows:</p>

    <textarea readOnly rows="5" value={"Mercury\nVenus\nEarth\nMars\nJupiter\nSaturn\nUranus\nNeptune"} />
  </div>
