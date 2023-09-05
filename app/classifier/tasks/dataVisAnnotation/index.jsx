import PropTypes from 'prop-types';
import GenericTaskEditor from '../generic-editor';
import GenericTask from '../generic';


export default function DataVisAnnotation() {
  return <p>This is a stub for the data annotation task.</p>
}

DataVisAnnotation.Editor = GenericTaskEditor;

DataVisAnnotation.getDefaultTask = () => ({
  help: '',
  tools: [],
  instruction: 'Select data from the chart.',
  type: 'dataVisAnnotation'
});

DataVisAnnotation.getTaskText = task => task.instruction;

DataVisAnnotation.getDefaultAnnotation = () => ({ _toolIndex: 0, value: [] });

DataVisAnnotation.defaultProps = {
  onChange: () => null,
  showRequiredNotice: false,
  task: {
    help: '',
    tools: [],
    type: 'dataVisAnnotation',
    instruction: 'Select data from the chart.'
  },
  workflow: {
    tasks: []
  }
};

DataVisAnnotation.propTypes = {
  annotation: PropTypes.shape({
    _toolIndex: PropTypes.number,
    task: PropTypes.string
  }),
  onChange: PropTypes.func,
  showRequiredNotice: PropTypes.bool,
  task: PropTypes.shape({
    help: PropTypes.string,
    instruction: PropTypes.string,
    required: PropTypes.bool,
    tools: PropTypes.array,
    type: PropTypes.string
  }),
  workflow: PropTypes.shape({
    tasks: PropTypes.object
  })
};

DataVisAnnotation.defaultProps = {
  annotation: {
    value: []
  },
  task: {
    help: '',
    tools: [],
    instruction: 'Select data from the chart.',
    type: 'dataVisAnnotation'
  }
}
