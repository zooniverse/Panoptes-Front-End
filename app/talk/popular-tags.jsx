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

export default class TalkPopularTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: []
    };
  }

  componentWillMount() {
    this.tagsRequest();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.section !== this.props.section) {
      this.tagsRequest();
    }
  }

  tagsRequest() {
    const query = {
      section: this.props.section,
      limit: 20,
      page_size: 20
    };

    if (this.props.type && this.props.id) {
      query.taggable_type = this.props.type;
      query.taggable_id = this.props.id;
    }

    return talkClient.type('tags/popular').get(query)
      .then((tags) => {
        this.setState({ tags });
      });
  }

  render() {
    let tagType;
    const logClick = this.context.geordi.makeHandler('hashtag-sidebar');

    if (this.props.project) {
      tagType = (tag) => {
        return <ProjectTag key={tag.id} project={this.props.project} tag={tag} onClick={logClick.bind(this, tag)} />
      };
    } else {
      tagType = (tag) => {
        return <TalkTag key={tag.id} tag={tag} onClick={logClick.bind(this, tag)} />
      };
    }

    return (
      <div className="talk-popular-tags">
        {this.state.tags.length && (
          <div>
            {this.props.header ? this.props.header : null}
            <section>
              {this.state.tags.map((tag) => {
                return tagType(tag);
              })}
            </section>
          </div>
        )}
      </div>
    );
  }
}

TalkPopularTags.propTypes = {
  header: React.PropTypes.object,
  project: React.PropTypes.object,
  section: React.PropTypes.string.isRequired
};

TalkPopularTags.contextTypes = {
  geordi: React.PropTypes.object
};
