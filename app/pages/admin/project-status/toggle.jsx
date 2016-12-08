import React, { Component } from 'react';
import AutoSave from '../../../components/auto-save';

class Toggle extends Component {
  constructor(props) {
    super(props);
    this.set = this.set.bind(this);
    this.state = {
      error: null,
      setting: { }
    };
  }

  set(property, value) {
    this.state.error = null;
    this.state.setting[property] = true;
    this.forceUpdate();

    let changes = { };
    changes[property] = value;
    this.props.project.update(changes).save()
      .catch(error => this.setState({ error }))
      .then(() => {
        this.state.setting[property] = false;
        this.forceUpdate();
      });
  }

  render() {
    const setting = this.props.project[this.props.field];

    return(
      <span>
        <label style={ { whiteSpace: 'nowrap' } }>
          <input
            type="radio"
            name={this.props.field}
            value={true}
            data-json-value={true}
            checked={setting}
            disabled={this.state.setting.private}
            onChange={this.set.bind(this, this.props.field, true)}
          />
          {this.props.trueLabel}
        </label>
        &emsp;
        <label style={{ whiteSpace: 'nowrap' }}>
          <input
            type="radio"
            name={this.props.field}
            value={false}
            data-json-value={true}
            checked={!setting}
            disabled={this.state.setting.private}
            onChange={this.set.bind(this, this.props.field, false)}
          />
          {this.props.falseLabel}
        </label>
      </span>
    );
  }
}

Toggle.defaultProps = {
  project: null,
  field: null,
  trueLabel: 'True',
  falseLabel: 'False'
};

export default Toggle;
