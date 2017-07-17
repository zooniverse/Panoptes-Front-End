import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

const propTypes = {
  project: PropTypes.object.isRequired
};

class Localise extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: ''
    };
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
    });
  }


  render() {
    const { available_languages } = this.props.project;
    const options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];
    return (
      <Select
        className="standard-input"
        multi={false}
        name="locales"
        onChange={this.componentDidMount.handleChange}
        options={options}
        placeholder="Choose a language"
        value={this.state.value}
      />
    );
  }
}

Localise.propTypes = propTypes;

export default Localise;
