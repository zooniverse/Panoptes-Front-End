import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'react-select';

import PROJECT_SORTS from './project-sorts';

class SortSelector extends Component {
  render() {
    const { onChange, sortMethods, value } = this.props;
    return (
      <Select
        multi={false}
        name="sort_order"
        value={value}
        placeholder="Sort by"
        searchPromptText="Select a sort order"
        closeAfterClick
        className="standard-input search card-sort"
        options={sortMethods}
        onChange={onChange}
      />
    );
  }
}

SortSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  sortMethods: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
};

SortSelector.defaultProps = {
  sortMethods: PROJECT_SORTS,
  value: 'default',
};

export default SortSelector;