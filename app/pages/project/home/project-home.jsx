import React from 'react';
import { Link } from 'react-router';
import { Markdown } from 'markdownz';
import Translate from 'react-translate-component';
import getSubjectLocation from '../../../lib/get-subject-location.coffee';
import Thumbnail from '../../../components/thumbnail';
import FinishedBanner from '../finished-banner';
import ProjectMetadata from './metadata';
import ProjectHomeWorkflowButtons from './home-workflow-buttons';
import TalkStatus from './talk-status';

import translations from '../translations';

const ProjectHomePage = (props) => {
  const avatarSrc = props.researcherAvatar || '/assets/simple-avatar.png';
  const renderTalkSubjectsPreview = props.talkSubjects.length > 2;

  return (
    <div className="project-home-page">
      {props.projectIsComplete &&
        (<div className="call-to-action-container">
          <FinishedBanner project={props.project} />
        </div>)}

      <div className="project-home-page__description">{translations.strings.project.description || props.project.description}</div>

      <ProjectHomeWorkflowButtons
        activeWorkflows={props.activeWorkflows}
        onChangePreferences={props.onChangePreferences}
        preferences={props.preferences}
        project={props.project}
        projectIsComplete={props.projectIsComplete}
        showWorkflowButtons={props.showWorkflowButtons}
        workflowAssignment={props.project.experimental_tools.includes('workflow assignment')}
        splits={props.splits}
      />

      {renderTalkSubjectsPreview && (
        <div className="project-home-page__container">
          {props.talkSubjects.map((subject) => {
            const location = getSubjectLocation(subject);
            return (
              <div className="project-home-page__talk-image" key={subject.id}>
                <Link to={`/projects/${props.project.slug}/talk/subjects/${subject.id}`} >
                  <Thumbnail
                    alt=""
                    controls={false}
                    format={location.format}
                    height={240}
                    src={location.src}
                    width={600}
                  />
                </Link>
              </div>
            );
          })}
          <TalkStatus project={props.project} />
        </div>
      )}

      <ProjectMetadata
        project={props.project}
        activeWorkflows={props.activeWorkflows}
        showTalkStatus={!renderTalkSubjectsPreview}
      />

      <div className="project-home-page__container">
        {props.project.researcher_quote && (
          <div className="project-home-page__researcher-words">
            <h4><Translate content="project.home.researcher" /></h4>

            <div>
              <img role="presentation" src={avatarSrc} />
              <span>&quot;{props.project.researcher_quote}&quot;</span>
            </div>
          </div>)}

        <div className="project-home-page__about-text">
          <h4>
            <Translate
              content="project.home.about"
              with={{
                title: translations.strings.project.title || props.project.display_name
              }}
            />
          </h4>
          {props.project.introduction &&
            <Markdown project={props.project}>
              {translations.strings.project.introduction || props.project.introduction}
            </Markdown>}
        </div>
      </div>
    </div>
  );
};

ProjectHomePage.contextTypes = {
  user: React.PropTypes.object
};

ProjectHomePage.defaultProps = {
  activeWorkflows: [],
  onChangePreferences: () => {},
  preferences: {},
  project: {},
  projectIsComplete: false,
  showWorkflowButtons: false,
  splits: {},
  talkSubjects: []
};

ProjectHomePage.propTypes = {
  activeWorkflows: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
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
  researcherAvatar: React.PropTypes.string,
  showWorkflowButtons: React.PropTypes.bool,
  splits: React.PropTypes.object,
  talkSubjects: React.PropTypes.arrayOf(React.PropTypes.object)
};

export default ProjectHomePage;
