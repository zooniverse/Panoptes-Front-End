import React from 'react';

const HomePageSection = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    loading: React.PropTypes.bool,
    error: React.PropTypes.object,
    onClose: React.PropTypes.func,
    children: React.PropTypes.node,
  },

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
          <a href="#" className="secret-button">×</a>
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
  },
});

export default HomePageSection;
