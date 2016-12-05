import React, { Component, PropTypes } from 'react';

import ClassificationsRibbon from 'classifications-ribbon';
import getUserClassificationCounts from '../lib/get-user-classification-counts';
import getColorFromString from '../lib/get-color-from-string';

class ClassificationsRibbonContainer extends Component {
  constructor(props) {
    super(props);
    this.getClassificationCounts = this.getClassificationCounts.bind(this);
    this.getColorFromString = this.getColorFromString.bind(this);
    this.state = {
      loading: false,
      projects: [],
      totalClassifications: 0,
    };
  }

  componentDidMount() {
    this.getClassificationCounts(this.props.user);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      this.getClassificationCounts(this.props.user);
    }
  }

  getClassificationCounts(user) {
    this.setState({ loading: true });
    getUserClassificationCounts(user)
      .then((projects) => {
        const pairs = [];
        projects.map(project =>
          pairs.push({
            projects: project.display_name,
            classifications: project.activity_count,
          }),
        );
        this.setState({
          loading: false,
          projects: pairs,
          totalClassifications: pairs.reduce((total, pair) => total + pair.classifications, 0),
        });
      });
  }

  render() {
    return (
      <div>
        {(this.state.loading) ?
          <span>Loading ribbon...</span> :
          <ClassificationsRibbon
            {...this.props}
            getColor={this.getColorFromString()}
            projects={this.state.projects}
            totalClassifications={this.state.totalClassifications}
          />
        }
      </div>
    );
  }
}

ClassificationsRibbonContainer.propTypes = {
  user: PropTypes.object.isRequired,
};

ClassificationsRibbonContainer.defaultProps = {
  user: null,
};

export default ClassificationsRibbonContainer;
