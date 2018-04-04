import PropTypes from 'prop-types';
import React from 'react';
import AutoSave from '../../../components/auto-save';

class GridEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tool: null
    };
    this.onChangeXOffset = this.onChangeXOffset.bind(this);
    this.onChangeYOffset = this.onChangeYOffset.bind(this);
    this.onChangeRows = this.onChangeRows.bind(this);
    this.onChangeCols = this.onChangeCols.bind(this);
    this.onChangeOpacity = this.onChangeOpacity.bind(this);
  }

  componentWillMount() {
    this.setState({
      tool: this.props.choice
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      tool: newProps.choice
    });
  }

  onChangeRows(e) {
    const tool = this.state.tool;
    if (e.target.value) {
      tool.rows = e.target.value;
    } else {
      delete tool.rows;
    }
    this.updateWorkflow(tool);
  }

  onChangeCols(e) {
    const tool = this.state.tool;
    if (e.target.value) {
      tool.cols = e.target.value;
    } else {
      delete tool.cols;
    }
    this.updateWorkflow(tool);
  }

  onChangeXOffset(e) {
    const tool = this.state.tool;
    if (e.target.value) {
      tool.offsetX = e.target.value;
    } else {
      delete tool.offsetX;
    }
    this.updateWorkflow(tool);
  }

  onChangeYOffset(e) {
    const tool = this.state.tool;
    if (e.target.value) {
      tool.offsetY = e.target.value;
    } else {
      delete tool.offsetY;
    }
    this.updateWorkflow(tool);
  }

  onChangeOpacity(e) {
    const tool = this.state.tool;
    if (e.target.value) {
      tool.opacity = e.target.value;
    } else {
      delete tool.opacity;
    }
    this.updateWorkflow(tool);
  }

  updateWorkflow(tool) {
    const changes = {};
    changes[this.props.name] = tool;
    this.setState({ tool });
    this.props.workflow.update(changes);
  }

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
            name={`${this.props.name}.offsetX`}
            min="0"
            value={this.state.tool.offsetX}
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
            name={`${this.props.name}.offsetY`}
            min="0"
            value={this.state.tool.offsetY}
            placeholder="0"
            size="5"
            style={{ width: '5ch' }}
            onChange={this.onChangeYOffset}
          />
        </AutoSave>

        <AutoSave resource={this.props.workflow}>
          Opacity{' '}
          <input
            type="number"
            inputMode="numeric"
            name={`${this.props.name}.opacity`}
            min="0"
            max="100"
            value={this.state.tool.opacity}
            placeholder="0"
            size="5"
            style={{ width: '5ch' }}
            onChange={this.onChangeOpacity}
          />
        </AutoSave>/100
      </div>
    );
  }
}

GridEditor.propTypes = {
  name: PropTypes.string,
  choice: PropTypes.object,
  workflow: PropTypes.object
};

export default GridEditor;
