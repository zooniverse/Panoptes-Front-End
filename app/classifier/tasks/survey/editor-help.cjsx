React = require 'react'

module.exports =
  choices: <div className="content-container">
    <p>User-identifiable <strong>choices</strong>, with these headers:</p>

    <table className="standard-table">
      <tbody>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Images</th>
        </tr>
        <tr className="form-label">
          <td>The label for the choice</td>
          <td>A short description of the choice</td>
          <td>Representative images of the choice, <code>;</code>-separated</td>
        </tr>
        <tr>
          <td>Shark</td>
          <td>A shark is a big gray ocean monster with fins and teeth.</td>
          <td>http://example.com/images/shark.jpg</td>
        </tr>
        <tr>
          <td>Dolphin</td>
          <td>Dolphins are intelligent marine mammals who solve crimes.</td>
          <td>http://example.com/images/dolphin.jpg; http://example.com/images/flipper.jpg</td>
        </tr>
      </tbody>
    </table>
  </div>

  images: <div className="content-container">
    Pick some <strong>images</strong>. Make sure they have the exact same names as the ones in your other files.
  </div>

  characteristics: <div className="content-container">
    <p><strong>Characteristics</strong> of those choices that the user can filter through, formatted like this:</p>

    <table className="standard-table">
      <tbody>
        <tr>
          <th>Name</th>
          <th>Color=Orange; http://...png</th>
          <th>Color=Gray; http://...png</th>
          <th>Teeth=Dull; http://...png</th>
          <th>Teeth=Pointy; http://...png</th>
        </tr>
        <tr className="form-label">
          <td>Choice name</td>
          <td colSpan="4"><code>Characteristic</code>=<code>value</code>; <code>icon URL</code>, with each row marked <code>Y</code> or <code>N</code> for that choice</td>
        </tr>
        <tr>
          <td>Shark</td>
          <td>N</td>
          <td>Y</td>
          <td>N</td>
          <td>Y</td>
        </tr>
        <tr>
          <td>Dolphin</td>
          <td>Y</td>
          <td>Y</td>
          <td>Y</td>
          <td>N</td>
        </tr>
      </tbody>
    </table>
  </div>

  confusions: <div className="content-container">
    <p>Commonly <strong>confused pairs</strong> of choices:</p>

    <table className="standard-table">
      <tbody>
        <tr>
          <th>Name</th>
          <th>Twin</th>
          <th>Details</th>
        </tr>
        <tr className="form-label">
          <td>The name of the choice to show this pairing for</td>
          <td>The name of the similar choice</td>
          <td>A short explanation of how to tell the difference</td>
        </tr>
        <tr>
          <td>Shark</td>
          <td>Dolphin</td>
          <td>A dolphin is shaped like a shark, but its tail is horizontal and it’s less terrifying.</td>
        </tr>
      </tbody>
    </table>
  </div>

  questions: <div className="content-container">
    <p><strong>Questions</strong> to ask about each identification:</p>

    <table className="standard-table">
      <tbody>
        <tr>
          <th>Question</th>
          <th>Multiple</th>
          <th>Required</th>
          <th>Answers</th>
        </tr>
        <tr className="form-label">
          <td>The question to ask</td>
          <td>Can the user select multiple answers? <code>Y</code> or <code>N</code></td>
          <td>Is an answer required? <code>Y</code> or <code>N</code></td>
          <td>The answers, <code>,</code>-separated</td>
        </tr>
        <tr>
          <td>Is this an example question?</td>
          <td>Y</td>
          <td>N</td>
          <td>Yes, No, Maybe</td>
        </tr>
      </tbody>
    </table>
  </div>
