import React, { Component, PropTypes } from 'react';

class Admin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<p>Admin!</p>);
  }

}

Admin.propTypes = {
  user: PropTypes.func,
};

export default Admin; 
