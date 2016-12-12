import React from 'react';
import getSubjectLocation from '../../lib/get-subject-location.coffee';
import TalkStatus from './talk-status';

export default class TalkImages extends React.Component {

  render() {
    return (
      <div className="project-home-page__section">

        {this.props.images.map((image) => {
          if (typeof (image) === 'string') {
            return (
              <div key={image.id} className="project-home-page__talk-image">
                <img alt="" src={image} />
              </div>
            );
          }
          return (
            <div key={image.id} className="project-home-page__talk-image">
              <img alt="" src={getSubjectLocation(image).src} />
            </div>
          );
        })}

        <TalkStatus project={this.props.project} />

      </div>
    );
  }
}

TalkImages.defaultProps = {
  project: {},
  images: [],
};

TalkImages.propTypes = {
  project: React.PropTypes.shape({
    display_name: React.PropTypes.string,
    id: React.PropTypes.string,
    slug: React.PropTypes.string,
  }).isRequired,
  images: React.PropTypes.arrayOf(React.PropTypes.object),
};
