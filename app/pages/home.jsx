import React from 'react';
import HomePageLoggedIn from './home-for-user';
import HomePageNotLoggedIn from './home-not-logged-in';

class HomePageRoot extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return
      {(this.props.user) ?
        <div>
          {React.cloneElement(HomePageLoggedIn, this.props)}
        </div> :
        <div>
          {React.cloneElement(HomePageNotLoggedIn, this.props)}
        </div>}
  }
}

export default HomePageRoot;

// import React from 'react';
// import HomePageLoggedIn from './home-for-user';
// import HomePageNotLoggedIn from './home-not-logged-in';

// const HomePageRoot = () => {
//   if (this.props.user) {
//     return React.cloneElement(HomePageLoggedIn, this.props)}
//   } else {
//     return React.cloneElement(HomePageNotLoggedIn, this.props)}
//   }
// }

// export default HomePageRoot;



// original cs

// React = require 'react'
// `import HomePageLoggedIn from './home-for-user';`
// `import HomePageNotLoggedIn from './home-not-logged-in';`

// module.exports = React.createClass
//   displayName: 'HomePageRoot'

//   render: ->
//     if @props.user
//       <HomePageLoggedIn {...@props} />
//     else
//       <HomePageNotLoggedIn {...@props} />
