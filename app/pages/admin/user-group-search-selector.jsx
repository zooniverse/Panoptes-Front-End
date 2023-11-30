import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';
import Select from 'react-select';

class SearchSelector extends Component {
  constructor(props) {
    super(props);
    this.navigateToUserGroup = this.navigateToUserGroup.bind(this);
    this.searchByName = this.searchByName.bind(this);
  }

  navigateToUserGroup(userGroupOption) {
    const userGroupID = userGroupOption.value;
    browserHistory.push(['/admin/user-group-status', userGroupID].join('/'));
  }

  searchByName = debounce((value) => {
    const query = {
      search: `%${value}%`
    };
    if ((value != null ? value.trim().length : undefined) > 3) {
      return apiClient.type('user_groups').get(query, {
        page_size: 10
      }).then((userGroups) => {
        const opts = userGroups.map(userGroup => ({
          value: userGroup.id,
          label: userGroup.display_name
        }));
        return { options: opts };
      });
    } else {
      return Promise.resolve({ options: [] });
    }
  }, 500); // 500ms delay

  render() {
    const { className } = this.props;

    return (
      <Select.Async
        multi={false}
        name="resourcesid"
        placeholder="Display Name:"
        value=""
        searchPromptText="Search by display name..."
        loadOptions={this.searchByName}
        onChange={this.navigateToUserGroup}
        className={`search card-search standard-input ${className}`}
      />
    );
  }
}

SearchSelector.propTypes = {
  className: PropTypes.string
};

SearchSelector.defaultProps = {
  className: ''
};

export default SearchSelector;
