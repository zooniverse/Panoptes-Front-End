import React from 'react';
import { string } from 'prop-types';

import PublicationsPage from './publications-page';
import Loading from '../../components/loading-indicator';

export default class PublicationsPageContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      error: null,
      loading: false,
      publications: null
    };
  }

  componentDidMount() {
    this.loadPublications();
  }

  loadPublications() {
    this.setState({ loading: true });
    fetch(this.props.publicationsUrl)
      .then(response => response.json())
      .then(json => this.setState({
        loading: false,
        publications: json
      }))
      .catch(error => this.setState({
        error,
        loading: false
      }))
  }

  render() {
    const { error, loading, publications } = this.state;
    const { publicationsUrl, ...props } = this.props;

    if (loading || !loading && !publications && !error) {
      return <Loading />
    }

    if (error) {
      return <div>Error loading publications :(</div>
    }

    return <PublicationsPage {...props} publications={publications} />
  }
}

PublicationsPageContainer.propTypes = {
  publicationsUrl: string
}

PublicationsPageContainer.defaultProps = {
  publicationsUrl: 'https://static.zooniverse.org/publications/publications.json'
}
