import PropTypes from 'prop-types';
import React from 'react';
import talkClient from 'panoptes-client/lib/talk-client';
import { Link } from 'react-router';


const ProjectTag = (props) => {
  const tag = props.tag.name;
  return (
    <div className="truncated">
      <Link to={`/projects/${props.project.slug}/talk/tags/${tag}`} onClick={props.onClick} >
        {tag}
      </Link>
      {' '}
    </div>
  );
};

const TalkTag = (props) => {
  const tag = props.tag.name;
  return (
    <div className="truncated">
      <Link to={`/talk/search/?query=${tag}`} onClick={props.onClick} >
        {tag}
      </Link>
      {' '}
    </div>
  );
};

export default class PopularTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: []
    };
  }

  componentWillMount() {
    this.tagsRequest(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.section !== this.props.section) {
      this.tagsRequest(nextProps);
    }
  }

  tagsRequest(props) {
    const query = {
      section: props.section,
      limit: 20,
      page_size: 20
    };

    if (props.type && props.id) {
      query.taggable_type = props.type;
      query.taggable_id = props.id;
    }

    return talkClient.type('tags/popular').get(query)
      .then((tags) => {
        this.setState({ tags });
      });
  }

  render() {
    let tagType;
    const logClick = this.context.geordi && this.context.geordi.makeHandler ? this.context.geordi.makeHandler('hashtag-sidebar') : null;

    if (this.props.project) {
      tagType = tag => <ProjectTag key={tag.id} project={this.props.project} tag={tag} onClick={logClick ? logClick.bind(this, tag.name) : null} />;
    } else {
      tagType = tag => <TalkTag key={tag.id} tag={tag} onClick={logClick ? logClick.bind(this, tag) : null} />;
    }

    return (
      <div className="talk-popular-tags">
        {!!this.state.tags.length && (
          <div>
            {this.props.header ? this.props.header : null}
            <p>
              {this.state.tags.map(tag => tagType(tag))}
            </p>
          </div>
        )}
      </div>
    );
  }
}

PopularTags.propTypes = {
  header: PropTypes.shape({
    props: PropTypes.object,
    type: PropTypes.string
  }),
  project: PropTypes.shape({
    slug: PropTypes.string
  }),
  section: PropTypes.string.isRequired
};

PopularTags.contextTypes = {
  geordi: PropTypes.object
};
