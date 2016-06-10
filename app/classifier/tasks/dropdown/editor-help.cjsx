React = require 'react'

module.exports =
  required: "Check this box if an option has to be provided before proceeding."

  allowCreate: "Check this box to allow a volunteer to type an unique answer, not provided as an option."

  options: <div className="content-container">
    <p>Add an option label individually <strong>OR</strong> copy and paste a list of option labels, <em>NO</em> header, and click the 'Add' button. Labels can be copied directly from file types CSV, TXT, XLS(X) or others. An example of a list that could be copied then pasted into the input is as follows:</p>

    <table className="standard-table">
      <tbody>
        <tr>
          <td>Mercury</td>
        </tr>
        <tr>
          <td>Venus</td>
        </tr>
        <tr>
          <td>Earth</td>
        </tr>
        <tr>
          <td>Mars</td>
        </tr>
        <tr>
          <td>Jupiter</td>
        </tr>
        <tr>
          <td>Saturn</td>
        </tr>
        <tr>
          <td>Uranus</td>
        </tr>
        <tr>
          <td>Neptune</td>
        </tr>
      </tbody>
    </table>
  </div>
