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
  user: React.PropTypes.shape({
    display_name: React.PropTypes.string
  }),
  location: React.PropTypes.shape({
    hash: React.PropTypes.string
  })
};

HomePageRoot.defaultProps = {
  user: null,
  location: {}
};

export default HomePageRoot;
