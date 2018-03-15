import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import RuleEditorModal from '../components/rule-editor-modal';
import defaultValidations from '../helpers/default-validations';
import strategies from '../../shared/strategies';

class RuleEditorModalContainer extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSave = this.handleSave.bind(this);

    this.state = {
      form: _.assign({}, props.rule),
      valid: false
    };
  }

  handleInputChange({ target }) {
    const newState = _.assign({}, this.state);
    newState.form[target.name] = (target.type === 'checkbox') ? target.checked : target.value;
    this.setState(newState, this.validateRule);
  }

  handleSave() {
    this.props.saveRule(this.state.form);
  }

  validateRule() {
    const { form } = this.state;
    let validations = [].concat(defaultValidations);

    if (form.strategy && strategies[form.strategy].validations) {
      validations = validations.concat(strategies[form.strategy].validations);
    }

    const validationsResult = validations
      .map(validation => validation.call(this, form))
      .every(validation => validation === true);

    this.setState({
      valid: validationsResult
    });
  }

  render() {
    return (<RuleEditorModal
      formState={this.state.form}
      handleInputChange={this.handleInputChange}
      handleSave={this.handleSave}
      valid={this.state.valid}
    />);
  }
}

RuleEditorModalContainer.propTypes = {
  rule: PropTypes.object,
  saveRule: PropTypes.func
};

export default RuleEditorModalContainer;
