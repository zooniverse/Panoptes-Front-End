import React from 'react';

export default class LabelRenderer extends React.Component {

  constructor(props) {
    super(props);
    this.createLabelAnnotation = this.createLabelAnnotation.bind(this);
    this.createNewContent = this.createNewContent.bind(this);
  }

  createLabelAnnotation() {
    const selection = window.getSelection();
    const anchorIndex = selection.anchorOffset;
    const focusIndex = selection.focusOffset;
    const task = this.props.classification._workflow.tasks[this.props.annotation.task];
    const labelInformation = task.highlighterLabels[this.props.annotation._toolIndex];

    this.props.annotation.value.push({
      _toolIndex: this.props.annotation._toolIndex,
      labelInformation: labelInformation,
      anchorIndex: anchorIndex,
      focusIndex: focusIndex
    });
    this.props.onChange(this.props.annotation);
  }

  createNewContent(){
    let newContent = [];
    let lastFocusIndex = 0;
    const annotationValueLength = this.props.annotation.value.length;
    if (annotationValueLength > 0) {
      for ( let i = 0; i < this.props.content.length; i++){
        for (let a = 0; a < this.props.annotation.value.length; a++) {
          let currentAnnotation = this.props.annotation.value[a];
          let annotationColor = currentAnnotation.labelInformation.color;
          if (currentAnnotation.anchorIndex === i ) {
            // 1. add text between last label and current label
            let preContent = this.props.content.slice(lastFocusIndex, i);
            newContent.push(preContent);
            
            // 2. add the highlighted content, push content to be labeled
            let highlightedContent = this.props.content.slice(i, currentAnnotation.focusIndex);
            let labelColor = currentAnnotation.labelInformation.color;

            let newLabel = 
              <span key={a} style={{background: `${labelColor}`}} >
                {highlightedContent}
              </span>;
            newContent.push(newLabel);
            
            // 3. re-set last focusIndex with annotation index
            lastFocusIndex = currentAnnotation.focusIndex;
          }
        }
        // 4. if last character in the string, add the remaining content
        if (i === (this.props.content.length - 1)) {
          let endContent = this.props.content.slice(lastFocusIndex, i);
          newContent.push(endContent);
        }
      }
      return(newContent);
    } else {
      return([this.props.content]);
    }
  }

  render() {
    const labeledContent = this.createNewContent();
    const divStyles = {      
      position: 'absolute',
      top: 0,
      left: 0,
      padding: '2%',
      color: 'transparent'
    };
    return(
      <div>
        <div>
          {labeledContent}
        </div>
        <div style={divStyles} onMouseUp={this.createLabelAnnotation} >
          {this.props.content}
        </div>
      </div>
    );
  }
}

LabelRenderer.propTypes = {
  content: React.PropTypes.string
};