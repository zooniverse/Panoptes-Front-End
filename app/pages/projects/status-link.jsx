import React, { Component, PropTypes } from 'react';

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
    const isActive = location.query.status === status;
    return (
      <button onClick={this.handleClick} className={isActive ? 'active' : null}>
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
