import PropTypes from "prop-types";
import React from "react";
import GenericTaskEditor from "../generic-editor";

export default class VolumetricTask extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div>{"VolumetricTask Tool"}</div>;
  }
}

VolumetricTask.Editor = GenericTaskEditor;

VolumetricTask.getDefaultTask = () => ({
  help: "",
  instruction: "Describe how to use this tool",
  type: "volumetric",
});

VolumetricTask.getTaskText = (task) => task.instruction;

VolumetricTask.getDefaultAnnotation = () => ({ _toolIndex: 0, value: [] });

VolumetricTask.defaultProps = {
  showRequiredNotice: false,
  task: {
    help: "",
    type: "volumetric",
    instruction: "Describe how to use this tool",
  },
  workflow: {
    tasks: [],
  },
};

VolumetricTask.propTypes = {
  showRequiredNotice: PropTypes.bool,
  task: PropTypes.shape({
    help: PropTypes.string,
    instruction: PropTypes.string,
    required: PropTypes.bool,
    tools: PropTypes.array,
    type: PropTypes.string,
  }),
  workflow: PropTypes.shape({
    tasks: PropTypes.object,
  }),
};
