import React, { Component, PropTypes } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import Translate from 'react-translate-component';

import ProjectCardList from './project-card-list';
import Filmstrip from '../../components/filmstrip';
import SearchSelector from './projects-search-selector';
import SortSelector from './projects-sort-selector';
import PageSelector from './projects-page-selector';

class ProjectFilteringInterface extends Component {
  constructor(props) {
    super(props);
    this.handleDisciplineChange = this.handleDisciplineChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.loadProjects = this.loadProjects.bind(this);
    this.renderCounter = this.renderCounter.bind(this);
    this.renderPageSelector = this.renderPageSelector.bind(this);
    this.state = {
      error: null,
      loading: false,
      projects: [],
      pages: 0,
      projectCount: 0,
      query: {},
    };
  }

  componentDidMount() {
    const { discipline, page, sort, status } = this.props;
    this.loadProjects(discipline, page, sort, status);
  }

  componentWillReceiveProps(nextProps) {
    const { discipline, page, sort, status } = nextProps;
    if (discipline !== this.props.discipline ||
        page !== this.props.page ||
        sort !== this.props.sort ||
        status !== this.props.status) {
      this.loadProjects(discipline, page, sort, status);
    }
  }

  loadProjects(discipline, page, sort, status) {
    this.setState({
      error: null,
      loading: true,
    });
    const query = {
      tags: discipline || undefined,
      page,
      sort: sort || this.props.sort,
      launch_approved: !apiClient.params.admin ? true : null,
      cards: true,
      include: ['avatar'],
      state: status,
    };
    if (!query.tags) {
      delete query.tags;
    }
    apiClient.type('projects').get(query)
      .then(projects => {
        if (projects.length > 0) {
          const hasMeta = (projects[0] !== null && projects[0].getMeta() !== null);
          let pages = 0, projectCount = 0;
          if (hasMeta) {
            const meta = projects[0].getMeta();
            pages = meta.page_count;
            projectCount = meta.count;
          }
          this.setState({ projects, pages, projectCount });
        } else {
          this.setState({ projects: [], pages: 0, projectCount: 0 });
        }
      })
      .catch(error => {
        this.setState({ error });
      })
      .then(() => {
        this.setState({ loading: false });
      });
  }

  handleDisciplineChange(discipline) {
    const page = '1';
    this.props.onChangeQuery({ discipline, page });
  }

  handleSortChange(sort) {
    const page = '1';
    this.props.onChangeQuery({ sort, page });
  }

  handlePageChange(page) {
    this.props.onChangeQuery({ page });
  }

  renderCounter() {
    let showingMessage = '';
    let pageStart = null;
    let pageEnd = null;
    if (this.state.projectCount > 0) {
      pageStart = this.props.page * 20 - 20 + 1;
      pageEnd = Math.min(this.props.page * 20, this.state.projectCount);
      showingMessage = 'projects.countMessage';
    } else {
      showingMessage = 'projects.notFoundMessage';
    }
    return (
      <p className="showing-projects">
        <Translate
          pageStart={pageStart}
          pageEnd={pageEnd}
          count={this.state.projectCount}
          content={showingMessage}
        />
      </p>
    );
  }

  renderPageSelector() {
    const { page } = this.props;
    return (this.state.pages > 1)
      ? <PageSelector
          currentPage={+page}
          totalPages={this.state.pages}
          onChange={this.handlePageChange}
        />
      : null;
  }

  render() {
    const { discipline, sort } = this.props;
    return (
      <section className="resources-container">
        <Filmstrip
          increment={350}
          value={discipline}
          onChange={this.handleDisciplineChange}
        />
        <div className="resource-results-counter">
          <SearchSelector />
          <SortSelector value={sort} onChange={this.handleSortChange} />
        </div>
        {this.renderCounter()}
        {this.renderPageSelector()}
        <ProjectCardList projects={this.state.projects} />
        {this.renderPageSelector()}
      </section>
    );
  }
}

ProjectFilteringInterface.propTypes = {
  discipline: PropTypes.string.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  page: PropTypes.string.isRequired,
  sort: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

ProjectFilteringInterface.defaultProps = {
  discipline: '',
  page: '1',
  sort: '-launch_date',
  status: 'live',
};

export default ProjectFilteringInterface;
