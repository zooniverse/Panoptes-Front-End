import PropTypes from 'prop-types';
import React from 'react';
import { Markdown } from 'markdownz';
import Translate from 'react-translate-component';

function ShortcutSummary(props) {
  let answer;

  if (props.annotation.value != null) {
    answer = props.annotation.value.map((index) => {
      return (
        <div key={index} className="answer">
          <i className="fa fa-check-circle-o fa-fw" />
          <Markdown tag="span" inline={true}>{props.translation.answers[index].label}</Markdown>
        </div>
      );
    });
  } else {
    answer = <div className="answer"><Translate content="tasks.shortcut.noAnswer" /></div>;
  }

  return (
    <div>
      <div className="question">
        {props.translation.question}
      </div>
      <div className="answers">
        {answer}
      </div>
    </div>
  );
}

ShortcutSummary.propTypes = {
  annotation: PropTypes.shape(
    {
      task: PropTypes.string,
      value: PropTypes.array
    }
  ).isRequired,
  translation: PropTypes.object.isRequired
};

ShortcutSummary.defaultProps = {
  annotation: { }
};

export default ShortcutSummary;