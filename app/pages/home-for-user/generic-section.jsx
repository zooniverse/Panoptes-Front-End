import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';

class HomePageSection extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    loading: PropTypes.bool,
    error: PropTypes.object,
    onClose: PropTypes.func,
    children: PropTypes.node,
  };

  render() {
    return (
      <div className="home-page-section">
        <header className="home-page-section__header">
          <i
            className="fa fa-spinner fa-spin fa-fw"
            style={{
              alignSelf: 'center',
              visibility: this.props.loading ? '' : 'hidden',
            }}
          ></i>
          <span className="home-page-section__header-label">{this.props.title}</span>
          <Link to="#" className="secret-button" title="Close this section" aria-label="Close this section" onClick={this.props.onClose}>
            <i className="fa fa-times"></i>
          </Link>
        </header>
        {!!this.props.error && (
          <div className="home-page-section__error">
            {this.props.error.toString()}
          </div>
        )}

        <div className="home-page-section__content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default HomePageSection;