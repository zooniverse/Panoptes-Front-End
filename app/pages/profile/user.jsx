import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import Avatar from '../../partials/avatar';

counterpart.registerTranslations('en', {
  loading: '(Loading)',
  profile: {
    title: 'Profile',
    nav: {
      comments: 'Recent comments',
      collections: 'Collections',
      favorites: 'Favorites',
      message: 'Message',
      moderation: 'Moderation',
      settings: 'Settings',
      stats: 'Your stats'
    }
  }
});

class ProfileUser extends Component {
  constructor(props) {
    super(props);
    this.logMessageClick = this.logMessageClick.bind(this);
    this.state = {
      profileHeader: null
    };
  }

  componentDidMount() {
    this.getProfileHeader(this.props.profileUser);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profileUser !== this.props.profileUser) {
      this.getProfileHeader(nextProps.profileUser);
    }
  }

  getProfileHeader() {
    return this.props.profileUser.get('profile_header')
      .catch(() => [])
      .then(profileHeaders => this.setState({ profileHeader: profileHeaders[0] }));
  }

  hasGeordi() {
    return this.context && this.context.geordi;
  }

  logClick() {
    if (this.hasGeordi()) {
      return this.context.geordi.makeHandler('user-menu');
    }
    return () => { };
  }

  logMessageClick() {
    if (this.hasGeordi()) {
      this.context.geordi.logEvent({
        type: 'message-user',
        data: {
          sender: this.props.user.display_name,
          recipient: this.props.profileUser.display_name
        }
      });
    }
  }

  renderUserLink() {
    const baseLink = this.props.project ? `/projects/${this.props.project.slug}/` : '/';
    const classes = classNames({ 'about-tabs': !!this.props.project });
    if (this.props.user !== this.props.profileUser) {
      return (
        <Link to={`${baseLink}users/${this.props.profileUser.login}/message`} className={classes} activeClassName="active" onClick={this.logMessageClick}>
          <Translate content="profile.nav.message" />
        </Link>
      );
    } else {
      return (
        <Link to="/#projects" className={classes} onClick={this.logClick.bind(this, 'stats')}>
          <Translate content="profile.nav.stats" />
        </Link>
      );
    }
  }

  renderNavLinks() {
    const baseLink = this.props.project ? `/projects/${this.props.project.slug}/` : '/';
    const classes = classNames({ 'about-tabs': !!this.props.project });

    return (
      <ul>
        <li>
          <IndexLink to={`${baseLink}users/${this.props.profileUser.login}`} className={classes} activeClassName="active" onClick={this.logClick.bind(this, 'comments')}>
            <Translate content="profile.nav.comments" />
          </IndexLink>
        </li>
        <li>
          <Link to={`${baseLink}users/${this.props.profileUser.login}/collections`} className={classes} activeClassName="active" onClick={this.logClick.bind(this, 'collections')}>
            <Translate content="profile.nav.collections" />
          </Link>
        </li>
        <li>
          <Link to={`${baseLink}users/${this.props.profileUser.login}/favorites`} className={classes} activeClassName="active" onClick={this.logClick.bind(this, 'favorites')}>
            <Translate content="profile.nav.favorites" />
          </Link>
        </li>

        <li>
          {this.renderUserLink()}
        </li>
      </ul>
    );
  }

  render() {
    let headerStyle = { };

    if (this.state.profileHeader && !this.props.project) {
      headerStyle = {
        backgroundImage: `url(${this.state.profileHeader.src})`
      };
    }

    const pageClasses = classNames({
      'secondary-page': true,
      'all-resources-page': true,
      'user-profile': true,
      'has-project-context': !!this.props.project
    });

    const containerClasses = classNames({
      'user-profile-content': true,
      'project-text-content': !!this.props.project,
      'in-project-context': !!this.props.project
    });

    return (
      <div className={pageClasses}>
        <Helmet title={this.props.profileUser ? `${counterpart("profile.title")} » ${this.props.profileUser.display_name}` : counterpart('loading')} />
        <section className="hero user-profile-hero" style={headerStyle}>
          <div className="overlay" />
          <div className="hero-container">
            <h1>
              <Avatar user={this.props.profileUser} />
              {this.props.profileUser.display_name}
              <span className="login-name">
                ({this.props.profileUser.login})
              </span>
            </h1>

            {!this.props.project ? <nav className="hero-nav">{this.renderNavLinks()}</nav> : null}
          </div>
        </section>

        <section className={containerClasses}>
          {this.props.project ? <nav className="hero-nav">{this.renderNavLinks()}</nav> : null}
          {React.cloneElement(this.props.children, this.props)}
        </section>
      </div>
    );
  }
}

ProfileUser.propTypes = {
  children: PropTypes.node,
  user: PropTypes.shape({
    display_name: PropTypes.string
  }),
  project: PropTypes.object,
  profileUser: PropTypes.object.isRequired
};

ProfileUser.defaultProps = {
  profileUser: null
};

ProfileUser.contextTypes = {
  geordi: PropTypes.object
};

export default ProfileUser;
