import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import languages from './languages';

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

  handleChange(option) {
    this.setState({
      language: option
    });
  }

  render() {
    const { available_languages } = this.props.project;
    const filtered_languages = languages.reduce((result, language) => {
      const filtered = available_languages.filter(option => language.value === option);
      if (filtered.length > 0) {
        result.push({
          label: language.label,
          value: language.value
        });
      }
      return result;
    }, []);

    return (
      <Select
        className="search card-search standard-input"
        multi={false}
        name="locales"
        onChange={this.handleChange}
        options={filtered_languages}
        placeholder="Choose a language"
        value={this.state.language}
      />
    );
  }
}

Localise.propTypes = propTypes;

export default Localise;
