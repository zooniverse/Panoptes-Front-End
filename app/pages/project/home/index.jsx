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

  fetchAllWorkflows(props, query) {
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

  showWorkflowButtons(props) {
    const workflowAssignment = this.props.project.experimental_tools.includes('workflow assignment');

    if ((props.project.configuration && props.project.configuration.user_chooses_workflow && !workflowAssignment) ||
      (workflowAssignment && props.user)) {
      this.setState({ showWorkflowButtons: true }, this.fetchAllWorkflows.bind(this, this.props, { active: true, fields: 'active,completeness,configuration,display_name' }));
    } else {
      this.setState({ showWorkflowButtons: false });
    }
  }

  render() {
    return (
      <ProjectHomePage
        activeWorkflows={this.state.activeWorkflows}
        background={this.props.background}
        onChangePreferences={this.props.onChangePreferences}
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
  onChangePreferences: () => {},
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
  background: React.PropTypes.shape({
    src: React.PropTypes.string
  }),
  onChangePreferences: React.PropTypes.func.isRequired,
  organization: React.PropTypes.shape({
    display_name: React.PropTypes.string,
    slug: React.PropTypes.string
  }),
  preferences: React.PropTypes.object,
  projectAvatar: React.PropTypes.shape({
    src: React.PropTypes.string
  }),
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
  projectRoles: React.PropTypes.array,
  splits: React.PropTypes.object,
  translation: React.PropTypes.shape({
    description: React.PropTypes.string,
    display_name: React.PropTypes.string,
    introduction: React.PropTypes.string,
    researcher_quote: React.PropTypes.string,
    title: React.PropTypes.string
  }),
  workflow: React.PropTypes.shape({
    id: React.PropTypes.string
  }),
  user: React.PropTypes.shape({
    id: React.PropTypes.string
  })
};
