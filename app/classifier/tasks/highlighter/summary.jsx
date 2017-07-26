import React from 'react';

export default class HighlighterSummary extends React.Component {
  static createSummary(value, index) {
    return (
      <div key={index} className="answer">
        <p>{value.labelInformation.label} : {value.text} ({value.start} to {value.end})</p>
      </div>
    );
  }
  render() {
    const annotationSummaries = this.props.annotation.value.map(this.constructor.createSummary);
    return (
      <div>
        {annotationSummaries}
      </div>
    );
  }
}

HighlighterSummary.propTypes = {
  annotation: React.PropTypes.shape({
    value: React.PropTypes.array
  })
};

