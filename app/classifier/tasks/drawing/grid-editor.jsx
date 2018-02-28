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
      </div>
    );
  }
}

export default GridEditor;