import React from 'react';
import { Markdown } from 'markdownz';

export default class HighlighterSummary extends React.Component {
  constructor(props){
    super(props);
    this.createSummary = this.createSummary.bind(this);
  }
  createSummary(value, index){
    return(
      <div key={index} className="answer">
        <p>{value.labelInformation.label} : {value.start} to {value.end}</p>
      </div>
    );
  }
  render() {
    const annotationSummaries = this.props.annotation.value.map(this.createSummary);
    return(
      <div>
        {annotationSummaries}
      </div>
    );
  }
}

