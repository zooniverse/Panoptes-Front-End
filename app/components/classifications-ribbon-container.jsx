import React, { Component, PropTypes } from 'react';

import ClassificationsRibbon from 'classifications-ribbon';
import getUserClassificationCounts from '../lib/get-user-classification-counts';

class ClassificationsRibbonContainer extends Component {
  constructor(props) {
    super(props);
    this.getClassificationCounts = this.getClassificationCounts.bind(this);
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
      .then((data) => {
        let lastX = 0;
        const projects = [];
        const totalClassifications = data.reduce((total, project) => {
          return total + project.activity_count;
        }, 0);
        data.map(project =>
          projects.push({
            projectName: project.display_name,
            classifications: project.activity_count,
            width: project.activity_count / totalClassifications,
            x: 1 - (lastX += (project.activity_count / totalClassifications)),
          }),
        );
        this.setState({
          loading: false,
          projects,
          totalClassifications,
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
