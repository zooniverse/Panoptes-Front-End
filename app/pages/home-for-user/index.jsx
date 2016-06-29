import React from 'react';
import CircleRibbon from './circle-ribbon';

import style from './index.styl';
void style;

function BlurredImage(props) {
  return (
    <div className={`blurred-image__container ${props.className}`.trim()} style={props.style}>
      <div
        className="blurred-image__display"
        style={{
          backgroundImage: `url('${props.src}')`,
          backgroundPosition: props.position,
          fontSize: props.blur,
        }}></div>
    </div>
  );
}

const HomePageForUser = React.createClass({
  getDefaultProps() {
    return {
      user: {},
    };
  },

  getInitialState() {
    return {
      weight: 1,
      hoverIndex: -1,
    };
  },

  render() {
    return (
      <div className="home-page-for-user">
        <BlurredImage className="home-page-for-user__background" src="//lorempixel.com/500/500/animals/2" blur="1em" position="50% 33%" />
        <CircleRibbon />
        <div className="home-page-for-user__welcome">Hello, {this.props.user.display_name}</div>
        <div className="home-page-for-user__menu">
          <button type="button" className="secret-button home-page-for-user__menu-button">
            <span className="home-page-for-user__menu-label">
              <i className="fa fa-cog fa-fw"></i>
              My recent projects
            </span>
          </button>
          <button type="button" className="secret-button home-page-for-user__menu-button">
            <span className="home-page-for-user__menu-label">
              <i className="fa fa-cog fa-fw"></i>
              Messages
            </span>
          </button>
          <button type="button" className="secret-button home-page-for-user__menu-button">
            <span className="home-page-for-user__menu-label">
              <i className="fa fa-cog fa-fw"></i>
              My collections
            </span>
          </button>
          <button type="button" className="secret-button home-page-for-user__menu-button">
            <span className="home-page-for-user__menu-label">
              <i className="fa fa-cog fa-fw"></i>
              My builds
            </span>
          </button>
        </div>
      </div>
    );
  },
});

export default HomePageForUser;
