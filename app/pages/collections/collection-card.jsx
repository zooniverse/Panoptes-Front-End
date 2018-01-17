import PropTypes from 'prop-types';
import React from 'react';
import FlexibleLink from '../../components/flexible-link';

export default class CollectionCard extends React.Component {
  constructor(props) {
    super(props);

    this.setSubjectPreview = this.setSubjectPreview.bind(this);
  }

  componentDidMount() {
    this.setSubjectPreview(this.props.collection.default_subject_src);
  }

  setSubjectPreview(src) {
    const splitSrc = src ? src.split('.') : [];
    if (src && splitSrc[splitSrc.length - 1] !== 'mp4') {
      this.collectionCard.style.backgroundImage = `url('${src}')`;
      this.collectionCard.style.backgroundPosition = 'initial';
      this.collectionCard.style.backgroundRepeat = 'no-repeat';
      this.collectionCard.style.backgroundSize = 'cover';
    }
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
      params: { owner, name }
    };

    return (
      <FlexibleLink {...linkProps}>
        <div className="collection-card" ref={(c) => { this.collectionCard = c; }}>
          {this.props.collection.links.subjects &&
            <span className="collection-card__badge">{this.props.collection.links.subjects.length}</span>}
          <svg viewBox="0 0 2 1" width="100%" />
          <div className="details">
            <div className="owner">
              {this.props.shared ?
                <span><i className="fa fa-users" />{' '}</span> : null}
              {this.props.collection.links.owner.display_name}
            </div>
            <div className="name">
              <span>{this.props.collection.display_name}</span>
              {this.props.collection.private ? <i className="fa fa-lock" /> : null}
            </div>
            <p className="description">
              {this.props.collection.description}
            </p>
          </div>
        </div>
      </FlexibleLink>
    );
  }
}

CollectionCard.propTypes = {
  collection: PropTypes.shape({
    default_subject_src: PropTypes.string,
    display_name: PropTypes.string,
    id: PropTypes.string,
    links: PropTypes.object,
    private: PropTypes.bool,
    slug: PropTypes.string
  }).isRequired,
  linkTo: PropTypes.string.isRequired,
  shared: PropTypes.bool,
  translationObjectName: PropTypes.string.isRequired
};

CollectionCard.defaultProps = {
  collection: {},
  linkTo: '',
  shared: false,
  translationObjectName: ''
};