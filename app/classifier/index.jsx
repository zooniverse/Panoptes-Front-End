import React from 'react';
import Classifier from './classifier';
import isAdmin from '../lib/is-admin.coffee';

class ClassifierWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.loadClassification = this.loadClassification.bind(this);
    this.checkExpertClassifier = this.checkExpertClassifier.bind(this);
    this.state = {
      subject: null,
      expertClassifier: null,
      userRoles: [],
    };
  }

  componentDidMount() {
    this.checkExpertClassifier();
    this.loadClassification(this.props.classification);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user !== nextProps.user) {
      this.setState({ expertClassifier: null }, this.checkExpertClassifier.bind(this, nextProps));
    }
    if (nextProps.classification !== this.props.classification) {
      this.loadClassification(nextProps.classification);
    }
  }

  loadClassification(classification) {
    this.setState({ subject: null });
    // TODO: These underscored references are temporary stopgaps.
    Promise.resolve(classification._subjects || classification.get('subjects')).then(([subject]) => {
      this.setState({ subject });
    });
  }

  checkExpertClassifier(props = this.props) {
    if (props.project && props.user && (this.state.expertClassifier === null)) {
      props.project.get('project_roles', { user_id: props.user.id }).then((projectRoles) => {
        const getProjectRoleHavers = Promise.all(projectRoles.map((projectRole) => {
          return projectRole.get('owner');
        }));
        getProjectRoleHavers.then((projectRoleHavers) => {
          const setsOfUserRoles = [];
          let i = 0;
          for (const user of projectRoleHavers) {
            if (user === props.user) {
              setsOfUserRoles.push(projectRoles[i].roles);
            }
            i++;
          }
          return setsOfUserRoles;
        }).then((setsOfUserRoles) => {
          // flatten setsOfUserRoles
          const userRoles = [];
          for (const setOfUserRoles of setsOfUserRoles) {
            for (const userRole of setOfUserRoles) {
              userRoles.push(userRole);
            }
          }
          return userRoles;
        }).then((userRoles) => {
          const expertClassifier = isAdmin() || (userRoles.indexOf('owner') > -1) || (userRoles.indexOf('collaborator') > -1) || (userRoles.indexOf('expert') > -1);
          this.setState({ expertClassifier, userRoles });
        });
      });
    }
  }

  render() {
    let output = <span>Loading classifier...</span>;
    if (this.props.workflow && this.state.subject) {
      output = (
        <Classifier
          {...this.props}
          workflow={this.props.workflow}
          subject={this.state.subject}
          expertClassifier={this.state.expertClassifier}
          userRoles={this.state.userRoles}
        />
      );
    }
    return output;
  }
}

ClassifierWrapper.defaultProps = {
  classification: {},
  onLoad: Function.prototype,
  onComplete: Function.prototype,
  onCompleteAndLoadAnotherSubject: Function.prototype,
  onClickNext: Function.prototype,
  workflow: null,
  user: null,
  tutorial: null,
  minicourse: null
};

ClassifierWrapper.propTypes = {
  classification: React.PropTypes.object,
  onLoad: React.PropTypes.func,
  onComplete: React.PropTypes.func,
  onCompleteAndLoadAnotherSubject: React.PropTypes.func,
  onClickNext: React.PropTypes.func,
  workflow: React.PropTypes.object,
  user: React.PropTypes.object,
  tutorial: React.PropTypes.object,
  minicourse: React.PropTypes.object
};

export default ClassifierWrapper;
