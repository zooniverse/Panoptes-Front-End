import React from 'react';

export default {
  choices:
  <div className="content-container">
    <p>
      User-identifiable <strong>choices</strong>, with these headers:
    </p>

    <table className="standard-table">
      <tbody>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Images</th>
          <th>No questions</th>
        </tr>
        <tr className="form-label">
          <td>The label for the choice</td>
          <td>A short description of the choice</td>
          <td>Representative images of the choice, <code>;</code>-separated</td>
          <td>Y or N for whether you want "sub-questions" to appear</td>
        </tr>
        <tr>
          <td>Shark</td>
          <td>A shark is a big gray ocean monster with fins and teeth.</td>
          <td>shark.jpg</td>
          <td>Y</td>
        </tr>
        <tr>
          <td>Dolphin</td>
          <td>Dolphins are intelligent marine mammals who solve crimes.</td>
          <td>dolphin.jpg; flipper.jpg</td>
          <td>N</td>
        </tr>
      </tbody>
    </table>
  </div>,
  images:
  <div className="content-container">
    Pick some <strong>images</strong>. Make sure they have the exact same names as the ones in your other files.
  </div>,
  characteristics:
  <div className="content-container">
    <p>
      <strong>Characteristics</strong> of those choices that the user can filter through. Note that the values in Name have to match the values in choices.csv exactly. Format like this:
    </p>

    <table className="standard-table">
      <tbody>
        <tr>
          <th>Name</th>
          <th>Color=Orange; orange.png</th>
          <th>Color=Gray; gray.png</th>
          <th>Teeth=Dull; dull.png</th>
          <th>Teeth=Pointy; pointy.png</th>
        </tr>
        <tr className="form-label">
          <td>Choice name</td>
          <td colSpan="4"><code>Characteristic</code>=<code>value</code>; <code>icon filename</code>, with each row marked <code>Y</code> or <code>N</code> for that choice</td>
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
  </div>,
  confusions:
  <div className="content-container">
    <p>
      Commonly <strong>confused pairs</strong> of choices:
    </p>

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
  </div>,
  questions:
  <div className="content-container">
    <p>
      <strong>Questions</strong> to ask about each identification:
    </p>

    <table className="standard-table">
      <tbody>
        <tr>
          <th>Question</th>
          <th>Multiple</th>
          <th>Required</th>
          <th>Answers</th>
          <th>Include</th>
          <th>Exclude</th>
        </tr>
        <tr className="form-label">
          <td>The question to ask</td>
          <td>Can the user select multiple answers? <code>Y</code> or <code>N</code></td>
          <td>Is an answer required? <code>Y</code> or <code>N</code></td>
          <td>The answers separated with <code>;</code></td>
          <td>Choices to ask this question for (leave blank for all by default).</td>
          <td>Choices to not ask this question for.</td>
        </tr>
        <tr>
          <td>Is this an example question?</td>
          <td>Y</td>
          <td>N</td>
          <td>Yes; No; Maybe</td>
          <td />
          <td>Dolphin</td>
        </tr>
      </tbody>
    </table>
  </div>
};
