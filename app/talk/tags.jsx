import React from  'react';
import PropTypes from  'prop-types';
import { Link } from  'react-router';
import talkClient from  'panoptes-client/lib/talk-client';
import apiClient from  'panoptes-client/lib/api-client';
import Paginator from  './lib/paginator';
import getSubjectLocation from  '../lib/get-subject-location';
import resourceCount from  './lib/resource-count';
import ProjectLinker from  './lib/project-linker';
import Loading from '../components/loading-indicator';

import ActiveUsers from './active-users';
import PopularTags from './popular-tags';
import Thumbnail from '../components/thumbnail';

export default class TalkTags extends React.Component {
  constructor() {
    super()

    this.state = {
      meta: {},
      tags: null
    }
  }

  componentDidMount() {
    const { params, project } = this.props
    const slugInURL = (params) ? `${params.owner}/${params.name}` : '';
    const slugInProject = (project) ? project.slug : '';
    console.log('cdm slugInProject', slugInProject)
    console.log('cdm slugInURL', slugInURL)
    if (slugInURL === slugInProject) {
      console.log('cdm calling getTags')
      this.getTags()
    }
  }

  componentWillReceiveProps(nextProps) {
    const pageChanged = nextProps.location.query.page !== this.props.location.query.page
    const differentTag = nextProps.params.tag !== this.props.params.tag
    const differentProject = nextProps.project !== this.props.project
    const { params, project } = this.props
    const slugInURL = (params) ? `${params.owner}/${params.name}` : '';
    const slugInProject = (project) ? project.slug : '';
    console.log('cwrp slugInProject', slugInProject)
    console.log('cwrp slugInURL', slugInURL)

    if (pageChanged || differentTag || differentProject) {
      const nextPage = (differentTag) ? 1 : nextProps.location.query.page
      console.log('cwrp calling getTags')
      this.getTags(nextPage, nextProps.params.tag)
    }
  }

  getTags(page = this.props.location.query.page, name = this.props.params.tag) {
    page || (page = 1);
    const taggable_type = 'Subject'
    const section = `project-${this.props.project.id}`
    return talkClient.type('tags/popular').get({ page, taggable_type, section, name })
      .then((tags) => {
        const meta = (tags && tags[0]) ? tags[0].getMeta() : {}
        return Promise.all(tags.map((tag) => {
          return apiClient.type('subjects').get(tag.taggable_id.toString())
            .then((subject) => {
              const taggable_id = subject.id
              return talkClient.type('tags/popular').get({ taggable_type, taggable_id })
                .then((subjectTags) => {
                  return tag.update({ subject, subjectTags })
                })
            })
        })).then((tags) => {
          return this.setState({ meta, tags })
        })
      })
  }

  render () {
    const tagsExist = this.state.tags && this.state.tags.length > 0;
    const searchCount = (tagsExist) ? resourceCount(this.state.meta.count, 'subjects') : 0;

    return (
      <div className="talk-search">
        <h1>Subjects tagged with {this.props.params.tag}</h1>

        <button className="link-style" type="button" onClick={this.context.router.goBack}>
        <i className="fa fa-backward" /> Back
      </button>

      {tagsExist &&
        <div className="talk-search-container">
          <div className="talk-search-counts">
            Your search returned {searchCount}.
          </div>

          <Paginator page={+this.state.meta.page} pageCount={this.state.meta.page_count} />

          <div className="talk-search-results">
            <div className="talk-list-content">
              <section className="tagged-results">
                {this.state.tags.map((tag) => {
                  const subjectLocation = getSubjectLocation(tag.subject) || {}
                  return (
                    <div className="tagged-subject talk-module" key={`tag-${tag.id}`}>
                      <p>
                        <Link
                          to={`/projects/${this.props.params.owner}/${this.props.params.name}/talk/subjects/${tag.subject.id}`}
                        >
                          Subject {tag.subject.id}
                        </Link>
                      </p>
                      <Thumbnail
                        src={subjectLocation.src}
                        width={300}
                        type={subjectLocation.type}
                        format={subjectLocation.format}
                      />
                      <ul className="tag-list">
                        {tag.subjectTags.map((subjectTag) => {
                          return (
                            <li key={`tag-${tag.id}-${subjectTag.id}`}>
                              <Link
                                to={`/projects/${this.props.params.owner}/${this.props.params.name}/talk/tags/${subjectTag.name}`}
                                {...this.props}
                              >
                                {subjectTag.name}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })}
              </section>
      
              <div className="talk-sidebar">
                <section>
                  <PopularTags
                    header={<h3>Popular Tags:</h3>}
                    section={this.props.section}
                    project={this.props.project}
                  />
                </section>

                <section>
                  <ActiveUsers section={this.props.section} project={this.props.project} />
                </section>

                <section>
                  <h3>Projects:</h3>
                  <ProjectLinker user={this.props.user} />
                </section>
              </div>
            </div>

            <Paginator page={+this.state.meta.page} pageCount = {this.state.meta.page_count} />
          </div>
        </div>}
      
      {this.state.tags && this.state.tags.length < 1 &&
        <p>No tags found.</p>}

      {this.state.tags === null &&
        <Loading />}
      </div>
    )
  }
}

TalkTags.contextTypes = {
  router: PropTypes.object
}

TalkTags.defaultProps = {
  project: null,
  section: '',
  user: null
}

TalkTags.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.shape({
      page: PropTypes.number
    })
  }).isRequired,
  params: PropTypes.shape({
    name: PropTypes.string,
    owner: PropTypes.string,
    tag: PropTypes.string
  }).isRequired,
  project: PropTypes.shape({
    id: PropTypes.string,
    slug: PropTypes.string
  }),
  section: PropTypes.string,
  user: PropTypes.object
}
