import React, { Component, PropTypes } from 'react';
import Admin from '../components/admin';

class AdminContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let renderer = null;
    if (!this.props.user) {
      renderer = this.renderNotSignedIn();
    } else {
      if (this.props.user.admin) {
        renderer = this.renderAdmin();
      } else {
        renderer = this.renderNotAnAdmin();
      }
    };
    return renderer;
  }

  renderAdmin() {
    return (
      <div className="content-container">
        <Admin />
      </div>
    );
  }

  renderNotAnAdmin() {
    return (
      <div className="content-container">
        <p>You’re not signed in.</p>
      </div>
    );
  }

  renderNotSignedIn() {
    return (
      <div className="content-container">
        <p>You’re not signed in.</p>
      </div>
    );
  }
}

AdminContainer.propTypes = {
  user: PropTypes.shape({
    admin: PropTypes.bool,
  })
};

export default AdminContainer; 
