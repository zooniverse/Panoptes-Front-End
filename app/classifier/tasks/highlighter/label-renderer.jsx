import PropTypes from 'prop-types';
import React from 'react';
import Selection from './selection';

export default class LabelRenderer extends React.Component {

  constructor(props) {
    super(props);
    this.createNewContent = this.createNewContent.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.state = {
      content: ''
    };
  }

  onLoad(e) {
    const content = e.data;
    this.setState({ content });
    this.props.onLoad(e);
  }

  createNewContent() {
    const newContent = [];
    let lastFocusIndex = 0;
    let i = 0;
    if (this.props.annotation.value && this.props.annotation.value.length > 0) {
      for (i = 0; i < this.state.content.length; i += 1) {
        for (let a = 0; a < this.props.annotation.value.length; a += 1) {
          const currentAnnotation = this.props.annotation.value[a];
          if (currentAnnotation.start === i) {
            // 1. add text between last label and current label
            const preContent = this.state.content.slice(lastFocusIndex, i);
            newContent.push(preContent);
            // 2. add the highlighted content, push content to be labeled
            const newLabel = <Selection key={a} annotation={currentAnnotation} disabled={this.props.disabled} />;
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

    return (newContent.length === 0 ? this.state.content : newContent);
  }

  render() {
    const labeledContent = this.createNewContent();
    const children = React.Children.map(
      this.props.children, child => (React.cloneElement(child, { className: 'invisible', onLoad: this.onLoad }))
    );
    return (
      <div className="label-renderer" >
        <div className="text-viewer" >
          {labeledContent}
        </div>
        {children}
      </div>
    );
  }
}

LabelRenderer.propTypes = {
  annotation: PropTypes.shape({
    value: PropTypes.array
  }),
  children: PropTypes.element,
  disabled: PropTypes.bool,
  onLoad: PropTypes.func
};

LabelRenderer.defaultProps = {
  annotation: {
    value: []
  },
  disabled: true,
  onLoad: () => true
};