import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import Select from 'react-select';

class UserGroupSearchSelector extends Component {
  constructor(props) {
    super(props);

    this.searchByName = this.searchByName.bind(this);
  }

  searchByName = debounce((value) => {
    const query = {
      search: `%${value}%`,
      page_size: 5
    };
    
    if (value.trim().length > 3) {
      return apiClient.type('user_groups')
        .get(query)
        .then((userGroups) => {
          const opts = userGroups.map(userGroup => ({
            value: userGroup.id,
            label: userGroup.display_name
          }));
          return ({ options: opts });
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
    return Promise.resolve({ options: [] });
  }, 300); // 300ms delay

  render() {
    return (
      <Select.Async
        loadOptions={this.searchByName}
        multi={false}
        name="user_groups_search"
        placeholder="Display Name:"
        searchPromptText="Search by display name..."
        value={this.props.userGroup}
        onChange={this.props.handleUserGroupSearchChange}
        className="search standard-input"
      />
    );
  }
}

export default UserGroupSearchSelector;
