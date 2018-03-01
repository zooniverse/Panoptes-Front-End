import PropTypes from 'prop-types';
import React from 'react';
import AutoSave from '../../../components/auto-save';

class GridEditor extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    choice: PropTypes.object,
    workflow: PropTypes.object,
  };

  state = {
    tool: null,
  };

  componentWillMount() {
    this.setState({
      tool: this.props.choice,
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      tool: newProps.choice,
    });
  }

  onChangeRows = (e) => {
    const tool = this.state.tool;
    if (e.target.value) {
      tool.rows = e.target.value;
    } else {
      delete tool.rows;
    }
    this.updateWorkflow(tool);
  };

  onChangeCols = (e) => {
    const tool = this.state.tool;
    if (e.target.value) {
      tool.cols = e.target.value;
    } else {
      delete tool.cols;
    }
    this.updateWorkflow(tool);
  };

  onChangeXOffset = (e) => {
    const tool = this.state.tool;
    if (e.target.value) {
      tool.x_offset = e.target.value;
    } else {
      delete tool.x_offset;
    }
    this.updateWorkflow(tool);
  };

  onChangeYOffset = (e) => {
    const tool = this.state.tool;
    if (e.target.value) {
      tool.y_offset = e.target.value;
    } else {
      delete tool.y_offset;
    }
    this.updateWorkflow(tool);
  };

  updateWorkflow = (tool) => {
    const changes = {};
    changes[this.props.name] = tool;
    this.setState({ tool });
    this.props.workflow.update(changes);
  };

  render() {
    return (
      <div className="grid-editor workflow-choice-setting">
        <AutoSave resource={this.props.workflow}>
          Rows{' '}
          <input
            type="number"
            inputMode="numeric"
            name={`${this.props.name}.rows`}
            min="0"
            value={this.state.tool.rows}
            placeholder="0"
            size="5"
            style={{ width: '5ch' }}
            onChange={this.onChangeRows}
          />
        </AutoSave>

        <AutoSave resource={this.props.workflow}>
          Columns{' '}
          <input
            type="number"
            inputMode="numeric"
            name={`${this.props.name}.cols`}
            min="0"
            value={this.state.tool.cols}
            placeholder="0"
            size="5"
            style={{ width: '5ch' }}
            onChange={this.onChangeCols}
          />
        </AutoSave>

        <AutoSave resource={this.props.workflow}>
          X Offset{' '}
          <input
            type="number"
            inputMode="numeric"
            name={`${this.props.name}.x-offset`}
            min="0"
            value={this.state.tool.x_offset}
            placeholder="0"
            size="5"
            style={{ width: '5ch' }}
            onChange={this.onChangeXOffset}
          />
        </AutoSave>

        <AutoSave resource={this.props.workflow}>
          Y Offset{' '}
          <input
            type="number"
            inputMode="numeric"
            name={`${this.props.name}.y-offset`}
            min="0"
            value={this.state.tool.y_offset}
            placeholder="0"
            size="5"
            style={{ width: '5ch' }}
            onChange={this.onChangeYOffset}
          />
        </AutoSave>
      </div>
    );
  }
}

export default GridEditor;