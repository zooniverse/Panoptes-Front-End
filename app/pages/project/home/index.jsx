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
    this.showWorkflowButtons();
    this.fetchResearcherAvatar(this.props);
    this.fetchTalkSubjects(this.props);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.context.user !== nextContext.user) {
      this.showWorkflowButtons(nextProps, nextContext);
    }

    if (this.props.project !== nextProps.project) {
      this.fetchResearcherAvatar(nextProps);
    }
  }

  fetchAllWorkflows(props = this.props, query = { active: true, fields: 'active,completeness,configuration,display_name' }) {
    if (this.state.activeWorkflows.length === 0) {
      getWorkflowsInOrder(props.project, query)
        .then((activeWorkflows) => {
          this.setState({ activeWorkflows });
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

  showWorkflowButtons(props = this.props, context = this.context) {
    const workflowAssignment = this.props.project.experimental_tools.includes('workflow assignment');

    if ((props.project.configuration && props.project.configuration.user_chooses_workflow && !workflowAssignment) ||
      (workflowAssignment && context.user)) {
      this.setState({ showWorkflowButtons: true }, this.fetchAllWorkflows);
    } else {
      this.setState({ showWorkflowButtons: false });
    }
  }

  render() {
    return (
      <ProjectHomePage
        activeWorkflows={this.state.activeWorkflows}
        onChangePreferences={this.props.onChangePreferences}
        preferences={this.props.preferences}
        project={this.props.project}
        projectIsComplete={this.props.projectIsComplete}
        researcherAvatar={this.state.researcherAvatar}
        showWorkflowButtons={this.state.showWorkflowButtons}
        splits={this.props.splits}
        talkSubjects={this.state.talkSubjects}
      />
    );
  }
}

ProjectHomeContainer.contextTypes = {
  geordi: React.PropTypes.object,
  user: React.PropTypes.object
};

ProjectHomeContainer.defaultProps = {
  onChangePreferences: () => {},
  preferences: {},
  project: {},
  projectIsComplete: false,
  splits: {}
};

ProjectHomeContainer.propTypes = {
  onChangePreferences: React.PropTypes.func.isRequired,
  preferences: React.PropTypes.object,
  project: React.PropTypes.shape({
    configuration: React.PropTypes.object,
    description: React.PropTypes.string,
    display_name: React.PropTypes.string,
    experimental_tools: React.PropTypes.arrayOf(React.PropTypes.string),
    id: React.PropTypes.string,
    introduction: React.PropTypes.string,
    researcher_quote: React.PropTypes.string
  }).isRequired,
  projectIsComplete: React.PropTypes.bool.isRequired,
  splits: React.PropTypes.object
};
