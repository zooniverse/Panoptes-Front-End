import React from 'react';

const cache = {}; 

export default class LabelRenderer extends React.Component {

  constructor(props) {
    super(props);
    this.createNewContent = this.createNewContent.bind(this);
    this.state = {
      content: ''
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.src !== this.props.src) {
      this.loadText(newProps.src);
    }
  }

  componentDidMount(){
    this.loadText(this.props.src);
  }

  loadText(src) {
    const cachedContent = cache[src];
    if (cachedContent) {
      this.setState({ content: cachedContent });
    } else {
      this.setState({ content: 'Loading…' });
      fetch(src + '?=')
      .then((response) => {
        return response.text();
      })
      .then((content) => {
        cache[src] = content;
        this.setState({ content });
      })
      .catch((e) => {
        const content = e.message;
        this.setState({ content });
      });
    }
  }

  createNewContent(){
    let newContent = [];
    let lastFocusIndex = 0;
    const annotationValueLength = this.props.annotation.value.length;
    if (annotationValueLength > 0) {
      for ( let i = 0; i < this.state.content.length; i++){
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
        // 4. if last character in the string, add the remaining content
        if (i === (this.state.content.length - 1)) {
          let endContent = this.state.content.slice(lastFocusIndex, i);
          newContent.push(endContent);
        }
      }
      return(newContent);
    } else {
      return([this.state.content]);
    }
  }

  render() {
    const labeledContent = this.createNewContent();
    const invisibleDivStyles = {      
      position: 'absolute',
      top: 0,
      left: 0,
      padding: '2%',
      color: 'transparent',
      whiteSpace: 'pre-wrap'
    };
    const visibleDivStyles = {      
      position: 'absolute',
      top: 0,
      left: 0,
      padding: '2%',
      color: '#efefef',
      whiteSpace: 'pre-wrap'
    };
    return(
      <div className='label-renderer' >
        <div style={visibleDivStyles} >
          {labeledContent}
        </div>
        <div style={invisibleDivStyles} >
          {this.state.content}
        </div>
      </div>
    );
  }
}

LabelRenderer.propTypes = {
  src: React.PropTypes.string
};