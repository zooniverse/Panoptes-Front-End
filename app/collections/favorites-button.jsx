import PropTypes from 'prop-types';
import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import classnames from 'classnames';
import alert from '../lib/alert';
import SignInPrompt from '../partials/sign-in-prompt';

export default class FavoritesButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      favorites: null,
      favorited: false
    };

    this.findFavoriteCollection = this.findFavoriteCollection.bind(this);
    this.favoriteSubject = this.favoriteSubject.bind(this);
    this.addSubjectTo = this.addSubjectTo.bind(this);
    this.removeSubjectFrom = this.removeSubjectFrom.bind(this);
    this.logSubjLike = this.logSubjLike.bind(this);
    this.createFavorites = this.createFavorites.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

  componentWillMount() {
    this.favoriteSubject(this.props.isFavorite);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isFavorite !== nextProps.isFavorite) {
      this.favoriteSubject(nextProps.isFavorite);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.subject !== this.props.subject) {
      this.favoriteSubject(this.props.isFavorite);
    }
  }

  promptToSignIn() {
    alert((resolve) => {
      return (
        <SignInPrompt onChoose={resolve()}>
          <p>You must be signed in to save your favorites.</p>
        </SignInPrompt>
      );
    });
  }

  findFavoriteCollection() {
    return apiClient.type('collections')
      .get({ project_ids: this.props.project.id, favorite: true, owner: this.props.user.login })
      .then(([favorites]) => { return (favorites || null); });
  }

  favoriteSubject(isFavorite) {
    const favorited = isFavorite;
    this.setState({ favorited });
  }

  addSubjectTo(collection) {
    this.setState({ favorited: true });
    collection.addLink('subjects', [this.props.subject.id.toString()]);
  }

  removeSubjectFrom(collection) {
    this.setState({ favorited: false });
    collection.removeLink('subjects', [this.props.subject.id.toString()]);
  }

  getFavoritesName(project) {
    if (project) {
      return `Favorites ${project.slug}`;
    }

    return 'Favorites';
  }

  logSubjLike(liked) {
    if (this.context.geordi) {
      this.context.geordi.logEvent({ type: liked });
    }
  }

  createFavorites() {
    return (
      new Promise((resolve, reject) => {
        this.findFavoriteCollection()
          .catch((err) => { reject(err); })
          .then((favorites) => {
            if (favorites) {
              this.setState({ favorites });
              resolve(favorites);
            } else {
              const display_name = this.getFavoritesName(this.props.project);
              const project = this.props.project.id;
              const subjects = [];
              const favorite = true;

              const links = { subjects };
              if (project) {
                links.projects = [project];
              }
              const collection = { favorite, display_name, links };
              apiClient.type('collections')
                .create(collection)
                .save()
                .catch((err) => { reject(err); })
                .then((newFavorites) => {
                  this.setState({ favorites: newFavorites });
                  resolve(newFavorites);
                });
            }
          });
      })
    );
  }

  toggleFavorite() {
    if (this.props.user) {
      if (!this.state.favorites) {
        this.setState({ favorited: true });
        this.createFavorites()
          .then((favorites) => { this.addSubjectTo(favorites); });
        this.logSubjLike('favorite');
      } else if (this.state.favorited) {
        this.removeSubjectFrom(this.state.favorites);
        this.logSubjLike('unfavorite');
      } else {
        this.addSubjectTo(this.state.favorites);
        this.logSubjLike('favorite');
      }
    } else {
      this.promptToSignIn();
      this.logSubjLike('favorite');
    }
  }

  render() {
    const iconClasses = classnames({
      'favorited': this.state.favorited,
      'fa fa-heart': this.state.favorited,
      'fa fa-heart-o': !this.state.favorited,
      'fa-fw': true
    });

    return (
      <button
        aria-label={(this.state.favorited) ? 'Unfavorite' : 'Favorite'}
        className={`favorites-button ${this.props.className || ''}`}
        type="button"
        title={(this.state.favorited) ? 'Unfavorite' : 'Favorite'}
        onClick={this.toggleFavorite}
      >
        <i className={iconClasses} />
      </button>
    );
  }
}

FavoritesButton.defaultProps = {
  isFavorite: false,
  subject: { id: '' },
  project: null,
  user: null
};

FavoritesButton.propTypes = {
  className: PropTypes.string,
  isFavorite: PropTypes.bool,
  subject: PropTypes.shape({ id: PropTypes.string }).isRequired,
  project: PropTypes.shape({
    id: PropTypes.string,
    slug: PropTypes.string
  }),
  user: PropTypes.shape({
    login: PropTypes.string
  })
};

FavoritesButton.contextTypes = {
  geordi: PropTypes.object
};