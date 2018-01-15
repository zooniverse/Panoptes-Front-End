import PropTypes from 'prop-types';
import React from 'react';
import HomePageLoggedIn from './home-for-user';
import HomePageNotLoggedIn from './home-not-logged-in';

const HomePageRoot = (props) => {
  if (props.user) {
    return (
      <HomePageLoggedIn
        user={props.user}
        location={props.location}
      />
    );
  }

  return (
    <HomePageNotLoggedIn />
  );
};

HomePageRoot.propTypes = {
  user: PropTypes.shape({
    display_name: PropTypes.string
  }),
  location: PropTypes.shape({
    hash: PropTypes.string
  })
};

HomePageRoot.defaultProps = {
  user: null,
  location: {}
};

export default HomePageRoot;