import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import FlexibleLink from '../../components/flexible-link';

export default class CollectionCard extends React.Component {
  constructor(props) {
    super(props);

    this.refreshImage = this.refreshImage.bind(this);
  }

  componentDidMount() {
    this.refreshImage(this.props.imagePromise);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.imagePromise !== this.props.imagePromise) {
      this.refreshImage(nextProps.imagePromise);
    }
  }

  collectionOwner() {
    apiClient.type(this.props.collection.links.owner.type).get(this.props.collection.links.owner.id);
  }

  refreshImage(promise) {
    Promise.resolve(promise)
      .then((src) => {
        if (src) {
          this.collectionCard.style.backgroundImage = `url('${src}')`;
          this.collectionCard.style.backgroundPosition = 'initial';
          this.collectionCard.style.backgroundRepeat = "no-repeat";
          this.collectionCard.style.backgroundSize = "cover";
        } else {
          this.collectionCard.style.backgroundImage = "url('/assets/simple-pattern.png')";
        }
      }).catch(() => {
        return null; // We don't care if there is an error. Default pattern in styles will show.
      });
  }

  render() {
    let translationObjectName = this.props.translationObjectName;
    if (this.props.translationObjectName) {
      translationObjectName = this.props.translationObjectName.toLowerCase().replace(/page$/, '').replace(/s?$/, '');
    }
    const [owner, name] = this.props.collection.slug.split('/');
    const dataText = `view-${translationObjectName}`;
    const linkTo = name ? this.props.linkTo : `${this.props.linkTo}${this.props.collection.id}`;

    const linkProps = {
      to: linkTo,
      geordiHandler: 'profile-menu',
      logText: dataText,
      params: { owner, name },
    };

    return (
      <FlexibleLink {...linkProps}>
        <div className="collection-card" ref={(c) => { this.collectionCard = c; }}>
          <span className="collection-card__badge">{this.props.subjectCount}</span>
          <svg viewBox="0 0 2 1" width="100%" />
          <div className="details">
            <div className="name">
              <span>{this.props.collection.display_name}</span>
              {this.props.collection.private ? <i className="fa fa-lock" /> : null}
            </div>
              <div className="owner">
                {this.props.shared ?
                  <span><i className="fa fa-users"></i>{" "}</span> : null}
                {this.props.collection.links.owner.display_name}
              </div>
          </div>
        </div>
      </FlexibleLink>
    );
  }
}

CollectionCard.propTypes = {
  collection: React.PropTypes.shape({
    display_name: React.PropTypes.string,
    links: React.PropTypes.object,
    private: React.PropTypes.bool,
    slug: React.PropTypes.string,
  }).isRequired,
  imagePromise: React.PropTypes.any,
  linkTo: React.PropTypes.string.isRequired,
  subjectCount: React.PropTypes.number,
  shared: React.PropTypes.bool,
  translationObjectName: React.PropTypes.string.isRequired,
};

CollectionCard.defaultProps = {
  collection: {},
  imagePromise: null,
  linkTo: '',
  subjectCount: 0,
  translationObjectName: '',
};
