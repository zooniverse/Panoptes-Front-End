import PropTypes from "prop-types";
import React from "react";
import GenericTaskEditor from "../generic-editor";

export default class VolumetricTask extends React.Component {
  render() {
    return <div>This is a placeholder for the Volumetric Task, which is only visible in the FEM Classifier</div>;
  }
}

VolumetricTask.Editor = GenericTaskEditor;

VolumetricTask.getDefaultTask = () => ({
  help: "",
  instruction: "Describe how to use this tool",
  type: "volumetric",
});

VolumetricTask.getTaskText = (task) => task.instruction;

VolumetricTask.getDefaultAnnotation = () => ({ value: [] });

VolumetricTask.defaultProps = {
  showRequiredNotice: false,
  task: {
    help: "",
    required: false,
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
    type: PropTypes.string,
  })
};
