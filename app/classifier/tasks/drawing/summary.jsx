import React from 'react';
import PropTypes from 'prop-types';
import { Markdown } from 'markdownz';
import SummaryAnswer from './summary-answer';

class DrawingSummary extends React.Component {
  static propTypes = {
    annotation: PropTypes.shape({
      value: PropTypes.array
    }),
    translation: PropTypes.shape({
      instruction: PropTypes.string,
      tools: PropTypes.array
    })
  }

  static defaultProps = {
    annotation: {},
    translation: {}
  }

  render() {
    const { value } = this.props.annotation;
    const { instruction, tools } = this.props.translation;
    const marksByTool = tools.map((tool, i) => value.filter(mark => mark.tool === i));
    return (
      <React.Fragment>
        <div className="question">
          <Markdown>
            {instruction}
          </Markdown>
        </div>
        {marksByTool.map((toolMarks, i) => <SummaryAnswer key={tools[i]._key} tool={tools[i]} marks={toolMarks} />)}
      </React.Fragment>
    );
  }
}

export default DrawingSummary;
