import PropTypes from 'prop-types';
import React from 'react';
import AutoSave from '../../../components/auto-save';

class MinMaxEditor extends React.Component {
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

  onChangeMin = (e) => {
    const tool = this.state.tool;
    if (e.target.value) {
      tool.min = e.target.value;
    } else {
      delete tool.min;
    }
    if (tool.max && tool.max < tool.min) {
      tool.max = tool.min;
    }
    this.updateWorkflow(tool);
  };

  onChangeMax = (e) => {
    const tool = this.state.tool;
    const newMax = e.target.value && e.target.value < this.state.tool.min ?
      this.state.tool.min :
      e.target.value;
    if (newMax) {
      tool.max = newMax;
    } else {
      delete tool.max;
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
      <div className="min-max-editor workflow-choice-setting">
        <AutoSave resource={this.props.workflow}>
          Min{' '}
          <input
            type="number"
            inputMode="numeric"
            name={`${this.props.name}.min`}
            min="0"
            value={this.state.tool.min}
            placeholder="0"
            size="5"
            style={{ width: '5ch' }}
            onChange={this.onChangeMin}
          />
        </AutoSave>
        <AutoSave resource={this.props.workflow}>
          Max{' '}
          <input
            type="number"
            inputMode="numeric"
            name={`${this.props.name}.max`}
            min={this.state.tool.min ? this.state.tool.min : 0}
            value={this.state.tool.max}
            placeholder="∞"
            size="5"
            style={{ width: '5ch' }}
            onChange={this.onChangeMax}
          />
        </AutoSave>
      </div>
    );
  }
}

export default MinMaxEditor;