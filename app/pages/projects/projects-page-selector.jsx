import PropTypes from 'prop-types';
import React, { Component } from 'react';

class PageSelector extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.renderPageButtons = this.renderPageButtons.bind(this);
  }

  handleChange(page) {
    this.props.onChange(page);
  }

  renderPageButtons(currentPage, totalPages) {
    return (
      <div>
        {(totalPages > 1)
        ? [...Array(totalPages).keys()].map((i) => {
          const page = i + 1;
          const active = page === +currentPage;
          return (
            <button
              onClick={this.handleChange.bind(this, page)}
              key={page}
              className="pill-button"
              style={{ border: active ? '2px solid' : 'none' }}
            >
              {page}
            </button>);
        })
        : null}
      </div>
    );
  }

  render() {
    const { currentPage, totalPages } = this.props;
    return (
      <nav className="pagination">
        {this.renderPageButtons(currentPage, totalPages)}
      </nav>
    );
  }
}

PageSelector.propTypes = {
  currentPage: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
};

PageSelector.defaultProps = {
  currentPage: 1,
  totalPages: 0,
};

export default PageSelector;