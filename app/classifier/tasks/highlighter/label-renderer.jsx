import React from 'react'; 

export default class LabelRenderer extends React.Component {

  constructor(props) {
    super(props);
    this.createNewContent = this.createNewContent.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.state = {
      content: ''
    }
  }

  onLoad(e) {
    const content = e.data;
    this.setState({ content });
    this.props.onLoad(e);
  }

  createNewContent(){
    let newContent = [];
    let lastFocusIndex = 0;
    let i = 0;
    if (this.props.annotation.value && this.props.annotation.value.length > 0) {
      for ( i = 0; i < this.state.content.length; i++){
        for (let a = 0; a < this.props.annotation.value.length; a++) {
          let currentAnnotation = this.props.annotation.value[a];
          let annotationColor = currentAnnotation.labelInformation.color;
          if (currentAnnotation.start === i ) {
            // 1. add text between last label and current label
            let preContent = this.state.content.slice(lastFocusIndex, i);
            newContent.push(preContent);
            
            // 2. add the highlighted content, push content to be labeled
            let highlightedContent = this.state.content.slice(i, currentAnnotation.end);
            let labelColor = currentAnnotation.labelInformation.color;

            let newLabel = 
              <span key={a} style={{background: `${labelColor}`}} >
                {highlightedContent}
              </span>;
            newContent.push(newLabel);
            
            // 3. re-set last focusIndex with annotation index
            lastFocusIndex = currentAnnotation.end;
          }
        }
      }
      // 4. if last character in the string, add the remaining content
      const endContent = this.state.content.slice(lastFocusIndex, i);
      newContent.push(endContent);
    }

    return ( newContent.length === 0 ? this.state.content : newContent );
  }

  render() {
    const labeledContent = this.createNewContent();
    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        className: 'invisible',
        onLoad: this.onLoad
      });
    });
    return(
      <div className='label-renderer' >
        <div >
          {labeledContent}
        </div>
          {children}
      </div>
    );
  }
}

LabelRenderer.propTypes = {
  onLoad: React.PropTypes.func,
  src: React.PropTypes.string
};

LabelRenderer.defaultProps = {
  annotation: {
    value: []
  },
  onLoad: () => { return true }
}