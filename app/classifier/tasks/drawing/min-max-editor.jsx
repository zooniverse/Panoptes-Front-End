import React from 'react';
import AutoSave from '../../../components/auto-save';

const MinMaxEditor = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    choice: React.PropTypes.object,
    workflow: React.PropTypes.object,
  },

  getInitialState() {
    return {
      min: null,
      max: null,
    };
  },

  componentWillMount() {
    this.setState({ min: this.props.choice.min, max: this.props.choice.max });
  },

  componentWillReceiveProps(newProps) {
    this.setState({ min: newProps.choice.min, max: newProps.choice.max });
  },

  onChangeMin(e) {
    this.setState({ min: e.target.value });
    this.updateWorkflow(e.target.name, e.target.value);
  },

  onChangeMax(e) {
    const newMax = e.target.value && e.target.value < this.state.min ?
      this.state.min :
      e.target.value;
    this.setState({ max: newMax });
    this.updateWorkflow(e.target.name, newMax);
  },

  updateWorkflow(name, value) {
    const changes = {};
    changes[name] = value;
    this.props.workflow.update(changes);
  },

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
            value={this.state.min}
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
            min={this.state.min ? this.state.min : 0}
            value={this.state.max}
            placeholder="∞"
            size="5"
            style={{ width: '5ch' }}
            onChange={this.onChangeMax}
          />
        </AutoSave>
      </div>
    );
  },
});

export default MinMaxEditor;
