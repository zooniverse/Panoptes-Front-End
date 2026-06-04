import PropTypes from 'prop-types';
import React from 'react';
import AutoSave from '../../../components/auto-save';

class MinMaxEditor extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    choice: PropTypes.object,
    workflow: PropTypes.object,
    minKey: PropTypes.string,
    maxKey: PropTypes.string,
    minLimit: PropTypes.number,
  };

  static defaultProps = {
    minKey: 'min',
    maxKey: 'max',
    minLimit: 0,
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
      tool[this.props.minKey] = e.target.value;
    } else {
      delete tool[this.props.minKey];
    }
    if (tool[this.props.maxKey] && tool[this.props.maxKey] < tool[this.props.minKey]) {
      tool[this.props.maxKey] = tool[this.props.minKey];
    }
    this.updateWorkflow(tool);
  };

  onChangeMax = (e) => {
    const tool = this.state.tool;
    const newMax = e.target.value && e.target.value < this.state.tool[this.props.minKey] ?
      this.state.tool[this.props.minKey] :
      e.target.value;
    if (newMax) {
      tool[this.props.maxKey] = newMax;
    } else {
      delete tool[this.props.maxKey];
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
            name={`${this.props.name}.${this.props.minKey}`}
            min={this.props.minLimit}
            value={this.state.tool[this.props.minKey]}
            placeholder={`${this.props.minLimit}`}
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
            name={`${this.props.name}.${this.props.maxKey}`}
            min={this.state.tool[this.props.minKey] ? this.state.tool[this.props.minKey] : this.props.minLimit}
            value={this.state.tool[this.props.maxKey]}
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
