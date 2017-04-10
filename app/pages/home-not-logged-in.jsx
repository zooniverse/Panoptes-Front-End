import React from 'react';
import { Link } from 'react-router';
import statsClient from 'panoptes-client/lib/stats-client';
import LoginDialog from '../partials/login-dialog';
import alert from '../lib/alert';
import FeaturedProject from './home-common/featured-project';
import HomePageDiscover from './home-not-logged-in/discover';
import HomePageResearch from './home-not-logged-in/research';
import HomePageSocial from './home-not-logged-in/social';
import HomePagePromoted from './home-not-logged-in/promoted';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 42000000
    };

    this.showDialog = this.showDialog.bind(this);
  }

  componentDidMount() {
    document.documentElement.classList.add('on-home-page-not-logged-in');
    this.getClassificationCounts();
  }

  componentWillUnmount() {
    document.documentElement.classList.remove('on-home-page-not-logged-in');
  }

  getClassificationCounts() {
    let count = 0;
    statsClient.query({
      period: 'year',
      type: 'classification'
    })
    .then((data) => {
      data.map((statObject) => {
        count += statObject.doc_count;
      });
      this.setState({ count }); // number will only appear on production
    });
  }

  showDialog(event) {
    const which = event.currentTarget.value;
    alert((resolve) => {
      return <LoginDialog which={which} onSuccess={resolve} contextRef={this.context} />;
    });
  }

  render() {
    return (
      <div className="on-home-page home-page-not-logged-in">
        <div className="flex-container">
          <section className="home-intro">
            <img role="presentation" className="home-mobile-video-image" src="./assets/home-video.jpg" />
            <video className="home-video" autoPlay={true} loop={true}>
              <source type="video/ogg" src="./assets/home-video.ogv" />
              <source type="video/webm" src="./assets/home-video.webm" />
              <source type="video/mp4" src="./assets/home-video.mp4" />
            </video>

            <h5 className="main-kicker">welcome to the zooniverse</h5>
            <h1 className="main-headline">People-powered research</h1>
            <Link to="/projects" className="primary-button">See All Projects</Link>
          </section>
        </div>

        <div className="flex-container">
          <FeaturedProject />
        </div>

        <div className="flex-container">
          <HomePageDiscover showDialog={this.showDialog} />
        </div>

        <div className="flex-container">
          <HomePagePromoted />
        </div>

        <div className="flex-container">
          <HomePageResearch count={this.state.count} showDialog={this.showDialog} />
        </div>

        <div className="flex-container">
          <HomePageSocial />
        </div>
      </div>
    );
  }
}

HomePage.contextTypes = {
  geordi: React.PropTypes.object
};
