import PropTypes from 'prop-types';
import React, { Component } from 'react';

class StatusLink extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.updateQuery({
      status: this.props.status,
      page: '1',
    });
  }

  render() {
    const { children, location, status } = this.props;
    location.query.status = location.query.status || 'live';
    const isActive = location.query.status === status;
    return (
      <button role="tab" onClick={this.handleClick} aria-selected={isActive ? 'true' : 'false'}>
        {children}
      </button>
    );
  }
}

StatusLink.propTypes = {
  children: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  updateQuery: PropTypes.func.isRequired,
};

export default StatusLink;