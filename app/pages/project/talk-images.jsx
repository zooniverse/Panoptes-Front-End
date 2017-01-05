import React from 'react';
import getSubjectLocation from '../../lib/get-subject-location.coffee';
import TalkStatus from './talk-status';
import Thumbnail from '../../components/thumbnail';

export default class TalkImages extends React.Component {

  render() {
    return (
      <div className="project-home-page__container">

        {this.props.images.map((image) => {
          const subject = getSubjectLocation(image);
          return (
            <div key={subject.id} className="project-home-page__talk-image">
              <Thumbnail alt="" src={subject.src} format={subject.format} controls={false} />
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
  images: []
};

TalkImages.propTypes = {
  project: React.PropTypes.shape({
    display_name: React.PropTypes.string,
    id: React.PropTypes.string,
    slug: React.PropTypes.string
  }).isRequired,
  images: React.PropTypes.arrayOf(React.PropTypes.object)
};
