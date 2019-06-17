import PropTypes from 'prop-types';
import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';
import ProjectHomePage from './project-home';
import getWorkflowsInOrder from '../../../lib/get-workflows-in-order';

export default class ProjectHomeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeWorkflows: [],
      showWorkflowButtons: false,
      researcherAvatar: null,
      talkSubjects: []
    };

    this.fetchResearcherAvatar = this.fetchResearcherAvatar.bind(this);
    this.fetchTalkSubjects = this.fetchTalkSubjects.bind(this);
    this.showWorkflowButtons = this.showWorkflowButtons.bind(this);
  }

  componentDidMount() {
    this.showWorkflowButtons(this.props);
    this.fetchResearcherAvatar(this.props);
    this.fetchTalkSubjects(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user !== nextProps.user) {
      this.showWorkflowButtons(nextProps);
    }

    if (this.props.project !== nextProps.project) {
      this.fetchResearcherAvatar(nextProps);
    }
  }

  fetchWorkflows(props, query) {
    if (this.state.activeWorkflows.length === 0) {
      const newQuery = query;
      newQuery.complete = false;
      getWorkflowsInOrder(props.project, newQuery)
        .then((incompleteWorkflows) => {
          if (incompleteWorkflows.length > 0) {
            this.setState({ activeWorkflows: incompleteWorkflows });
          } else {
            delete newQuery.complete;
            getWorkflowsInOrder(props.project, newQuery)
              .then((activeWorkflows) => {
                this.setState({ activeWorkflows });
              });
          }
        });
    }
  }

  fetchTalkSubjects(props) {
    talkClient.type('comments').get({ section: `project-${props.project.id}`, page_size: 10, sort: '-created_at', focus_type: 'Subject' })
      .then((comments) => {
        if (comments.length > 0) {
          const subjectIds = comments.map(x => x.focus_id);
          const uniqueSubjects = subjectIds.filter((el, i, arr) => { return arr.indexOf(el) === i; });
          uniqueSubjects.splice(3, 7);
          apiClient.type('subjects').get(uniqueSubjects)
            .then((subjects) => {
              this.setState({ talkSubjects: subjects });
            });
        }
      }).catch(error => console.error(error));
  }

  fetchResearcherAvatar(props) {
    if (props.project.configuration && props.project.configuration.researcherID) {
      if (props.project.configuration.researcherID === props.project.display_name) {
        if (props.projectAvatar && props.projectAvatar.src) {
          this.setState({ researcherAvatar: props.projectAvatar.src });
        }
      } else {
        apiClient.type('users').get(this.props.project.configuration.researcherID)
          .then((researcher) => {
            researcher.get('avatar').then(([avatar]) => {
              if (avatar.src) {
                this.setState({ researcherAvatar: avatar.src });
              }
            });
          }).catch(error => console.error(error));
      }
    }
  }

  showWorkflowButtons(props) {
    const workflowAssignment = this.props.project.experimental_tools.includes('workflow assignment');

    if ((props.project.configuration && props.project.configuration.user_chooses_workflow && !workflowAssignment) ||
      (workflowAssignment && props.user)) {
      this.setState({ showWorkflowButtons: true }, this.fetchWorkflows.bind(this, this.props, { active: true, fields: 'active,completeness,configuration,display_name' }));
    } else {
      this.setState({ showWorkflowButtons: false });
    }
  }

  render() {
    return (
      <ProjectHomePage
        activeWorkflows={this.state.activeWorkflows}
        background={this.props.background}
        organization={this.props.organization}
        preferences={this.props.preferences}
        project={this.props.project}
        projectAvatar={this.props.projectAvatar}
        projectIsComplete={this.props.projectIsComplete}
        projectRoles={this.props.projectRoles}
        researcherAvatar={this.state.researcherAvatar}
        showWorkflowButtons={this.state.showWorkflowButtons}
        splits={this.props.splits}
        talkSubjects={this.state.talkSubjects}
        translation={this.props.translation}
        workflow={this.props.workflow}
        user={this.props.user}
      />
    );
  }
}

ProjectHomeContainer.defaultProps = {
  background: {
    src: ''
  },
  organization: null,
  preferences: {},
  project: {},
  projectAvatar: {
    src: ''
  },
  projectIsComplete: false,
  projectRoles: [],
  splits: {},
  translation: {
    description: '',
    display_name: '',
    introduction: '',
    researcher_quote: '',
    title: ''
  },
  user: null
};

ProjectHomeContainer.propTypes = {
  background: PropTypes.shape({
    src: PropTypes.string
  }),
  organization: PropTypes.shape({
    display_name: PropTypes.string,
    slug: PropTypes.string
  }),
  preferences: PropTypes.object,
  projectAvatar: PropTypes.shape({
    src: PropTypes.string
  }),
  project: PropTypes.shape({
    configuration: PropTypes.object,
    description: PropTypes.string,
    display_name: PropTypes.string,
    experimental_tools: PropTypes.arrayOf(PropTypes.string),
    id: PropTypes.string,
    introduction: PropTypes.string,
    researcher_quote: PropTypes.string
  }).isRequired,
  projectIsComplete: PropTypes.bool.isRequired,
  projectRoles: PropTypes.array,
  splits: PropTypes.object,
  translation: PropTypes.shape({
    description: PropTypes.string,
    display_name: PropTypes.string,
    introduction: PropTypes.string,
    researcher_quote: PropTypes.string,
    title: PropTypes.string
  }),
  workflow: PropTypes.shape({
    id: PropTypes.string
  }),
  user: PropTypes.shape({
    id: PropTypes.string
  })
};