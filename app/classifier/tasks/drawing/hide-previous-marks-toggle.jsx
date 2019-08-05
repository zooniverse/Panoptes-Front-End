import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';

class HidePreviousMarksToggle extends React.Component {
  constructor() {
    super();
    this.state = {
      checked: false,
      count: 0
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.annotations.length < this.props.annotations.length) {
      this.setPreviousMarks(this.state.count);
    }
  }

  componentWillUnmount() {
    const annotations = this.props.annotations.slice();
    const currentAnnotation = annotations[annotations.length - 1];
    if (currentAnnotation) {
      delete currentAnnotation._hideMarksBefore;
      this.props.onChange(currentAnnotation);
    }
  }

  setPreviousMarks(count) {
    const currentAnnotation = this.props.annotations[this.props.annotations.length - 1];
    currentAnnotation._hideMarksBefore = count;
    const checked = count > 0;
    this.setState({ checked, count });
    this.updateParent();
  }

  updateParent() {
    const annotations = this.props.annotations.slice();
    const annotation = annotations[annotations.length - 1];
    this.props.onChange(annotation);
  }

  render() {
    const { annotations } = this.props;
    const currentAnnotation = annotations[annotations.length - 1];
    if (!this.props.workflow.tasks[currentAnnotation.task].enableHidePrevMarks) { return null; }

    let marksCount = 0;
    annotations.forEach((annotation) => {
      const taskDescription = this.props.workflow.tasks[annotation.task];
      if (taskDescription.type === 'drawing') {
        marksCount += annotation.value.length;
      }
    });

    const nextValueToSet = this.state.checked ? 0 : marksCount;

    const checkedStyle = {
      background: 'rgba(255, 0, 0, 0.7)',
      color: 'white'
    };

    return (
      <div>
        <label style={this.state.checked ? checkedStyle : undefined}>
          <input
            type="checkbox"
            checked={this.state.checked}
            disabled={marksCount === 0}
            onChange={this.setPreviousMarks.bind(this, nextValueToSet)}
          />
          {' '}
          <Translate content="tasks.hidePreviousMarks" with={{
            count: marksCount > 0 ? `(${marksCount})` : undefined
          }} />
        </label>
      </div>
    );
  }
}

HidePreviousMarksToggle.propTypes = {
  annotations: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  workflow: PropTypes.shape({
    tasks: PropTypes.object
  })
};

HidePreviousMarksToggle.defaultProps = {
  annotations: [],
  workflow: null,
  onChange() { }
};

export default HidePreviousMarksToggle;
