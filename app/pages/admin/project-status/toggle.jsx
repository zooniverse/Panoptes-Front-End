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
    let setting = this.state.setting
    setting[property] = true;
    this.setState({ error: null, setting});

    let changes = { };
    changes[property] = value;
    this.props.project.update(changes).save()
      .catch(error => this.setState({ error }))
      .then(() => {
        let changedSetting = this.state.setting;
        changedSetting[property] = false;
        this.setState({ setting: changedSetting });
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
