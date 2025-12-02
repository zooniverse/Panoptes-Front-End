import PropTypes from "prop-types";
import React from "react";
import GenericTaskEditor from "../generic-editor";

export default class GeoDrawingTask extends React.Component {
  render() {
    return <div>This is a placeholder for the GeoDrawing Task, which is only visible in the FEM Classifier</div>;
  }
}

GeoDrawingTask.Editor = GenericTaskEditor;

GeoDrawingTask.getDefaultTask = () => ({
  help: "",
  instruction: "Explain what to draw on a map",
  tools: [],
  type: "geoDrawing",
});

GeoDrawingTask.getTaskText = (task) => task.instruction;

GeoDrawingTask.getDefaultAnnotation = () => ({ value: [] });

GeoDrawingTask.defaultProps = {
  task: {
    help: "",
    instruction: "Explain what to draw on a map",
    required: false,
    tools: [],
    type: "geoDrawing",
  },
  workflow: {
    tasks: [],
  },
};

GeoDrawingTask.propTypes = {
  task: PropTypes.shape({
    help: PropTypes.string,
    instruction: PropTypes.string,
    required: PropTypes.bool,
    tools: PropTypes.arrayOf(PropTypes.object),
    type: PropTypes.string,
  })
};