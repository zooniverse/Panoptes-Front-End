import React from 'react';
import { Link } from 'react-router';
import getWorkflowsInOrder from '../../lib/get-workflows-in-order';

const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

export default class FinishedBanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasResultsPage: false,
      hide: false,
    };

    this.getResultsPageExistence = this.getResultsPageExistence.bind(this);
    this.hide = this.hide.bind(this);
    this.refresh = this.refresh.bind(this);
    this.renderResultsPage = this.renderResultsPage.bind(this);
  }

  componentDidMount() {
    this.refresh(this.props.project);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project !== this.props.project) {
      this.refresh(this.props.project);
    }
  }

  getResultsPageExistence(project) {
    return project.get('pages').then((pages) => {
      const resultsPages = pages.filter((page) => {
        return (page.url_key === 'results' ? page : null);
      });
      return (!!resultsPages[0]);
    });
  }

  hide() {
    const finishedProjectDismissals = localStorage.getItem('finished-project-dismissals');
    const dismissals = finishedProjectDismissals ? JSON.parse(finishedProjectDismissals) : {};
    dismissals[this.props.project.id] = Date.now();
    localStorage.setItem('finished-project-dismissals', JSON.stringify(dismissals));
    this.setState({ hide: true });
  }

  refresh(project) {
    this.setState({
      hasResultsPage: false,
      hide: false,
    });

    this.getResultsPageExistence(project)
      .then((hasResultsPage) => {
        this.setState({ hasResultsPage });
      });
  }

  renderResultsPage() {
    const [owner, name] = this.props.project.slug.split('/');

    return (
      <span>
        <strong>
          <Link to={`/projects/${owner}/${name}/results`}>See the results</Link>
        </strong>{' '}
        <small>
          or{' '}
          <button type="button" className="secret-button" onClick={this.hide}><u>dismiss this message</u></button>
        </small>
      </span>
    );
  }

  render() {
    const finishedProjectDismissals = localStorage.getItem('finished-project-dismissals');
    const dismissals = finishedProjectDismissals ? JSON.parse(finishedProjectDismissals) : {};
    const recentlyDismissed = Date.now() - dismissals[this.props.project.id] < this.props.dismissFor;

    if (recentlyDismissed || this.state.hide) {
      return null;
    }

    return (
      <div className="successful project-announcement-banner">
        <p>
          <strong>Great work!</strong>{' '}
          Looks like this project is out of data at the moment!<br />
          {this.state.hasResultsPage ? this.renderResultsPage() : null}
        </p>
      </div>
    );
  }
}

FinishedBanner.defaultProps = {
  dismissFor: THREE_DAYS,
  project: {},
};

FinishedBanner.propTypes = {
  dismissFor: React.PropTypes.number,
  project: React.PropTypes.shape({
    id: React.PropTypes.string,
    slug: React.PropTypes.string,
  }),
  projectIsComplete: React.PropTypes.bool
};
