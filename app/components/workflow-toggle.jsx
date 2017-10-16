import React from 'react';
import Translate from 'react-translate-component';

class WorkflowToggle extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggleActive = this.handleToggleActive.bind(this);
    this.state = {
      error: null,
      setting: {}
    };
  }

  handleToggleActive(property, value) {
    const setting = this.state.setting;
    setting[property] = true;
    this.setState({ error: null, setting });

    const changes = {};
    changes[property] = value;

    this.props.workflow.update(changes).save()
      .catch(error => this.setState({ error }))
      .then(() => {
        const changedSetting = this.state.setting;
        changedSetting[property] = false;
        this.setState({ setting: changedSetting });
      });
  }

  render() {
    const workflow = this.props.workflow;
    const setting = workflow[this.props.field];

    return (
      <span>
        { this.props.workflow.id } - { this.props.workflow.display_name}:
        <label>
          <input
            type="checkbox"
            name={this.props.field}
            value={setting}
            checked={setting}
            onChange={this.handleToggleActive.bind(this, this.props.field, !setting)}
          />
          <Translate content="workflowToggle.label" />
        </label>
      </span>
    );
  }
}

WorkflowToggle.defaultProps = {
  field: null,
  workflow: null
};

WorkflowToggle.propTypes = {
  field: React.PropTypes.string,
  workflow: React.PropTypes.shape({
    display_name: React.PropTypes.string,
    id: React.PropTypes.string,
    update: React.PropTypes.func
  }).isRequired
};

export default WorkflowToggle;
