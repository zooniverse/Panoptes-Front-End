import counterpart from 'counterpart';
import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import classnames from 'classnames';
import Translate from 'react-translate-component';

counterpart.registerTranslations('en', {
  footerAdminMode: 'Admin mode',
});

class AdminToggle extends React.Component {
  componentDidMount() {
    apiClient.update({
      'params.admin': !!localStorage.getItem('adminFlag') || undefined,
    });
  }

  toggleAdminMode = (e) => {
    apiClient.update({
      'params.admin': e.target.checked || undefined,
    });

    if (e.target.checked) {
      localStorage.setItem('adminFlag', true);
    } else {
      localStorage.removeItem('adminFlag');
    }
  };

  render() {
    return (
      <label
        className={classnames('footer-admin-toggle', {
          'footer-admin-toggle--active': !!apiClient.params.admin,
        })}
      >
        <input
          type="checkbox"
          checked={!!apiClient.params.admin}
          onChange={this.toggleAdminMode}
        />{' '}
        <Translate content="footerAdminMode" />
      </label>
    );
  }
}

export default AdminToggle;
