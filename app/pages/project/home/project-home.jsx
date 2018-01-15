import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import { Markdown } from 'markdownz';
import Translate from 'react-translate-component';
import getSubjectLocation from '../../../lib/get-subject-location.coffee';
import Thumbnail from '../../../components/thumbnail';
import FinishedBanner from '../finished-banner';
import ProjectMetadata from './metadata';
import ProjectHomeWorkflowButtons from './home-workflow-buttons';
import TalkStatus from './talk-status';
import ProjectNavbar from '../project-navbar';

const ProjectHomePage = (props) => {
  const avatarSrc = props.researcherAvatar || '/assets/simple-avatar.png';
  const descriptionClass = classnames(
    'project-home-page__description',
    { 'project-home-page__description--top-padding': !props.organization }
  );
  const renderTalkSubjectsPreview = props.talkSubjects.length > 2;
  return (
    <div className="project-home-page">
      <div className="project-page project-background" style={{ backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)), url(${props.background.src})` }}>
        <ProjectNavbar {...props} />

        {props.projectIsComplete &&
          (<div className="project-home-page__finished-banner-container">
            <FinishedBanner project={props.project} />
          </div>)}

        {props.project.configuration && props.project.configuration.announcement &&
          (<div className="informational project-announcement-banner">
            <Markdown>{props.project.configuration.announcement}</Markdown>
          </div>)}

        {props.organization &&
          <Link
            to={`/organizations/${props.organization.slug}`}
            className="project-home-page__organization"
          >
            <Translate content="project.home.organization" />: {props.organization.display_name}
          </Link>}

        <div className={descriptionClass}>
          {props.translation.description}
        </div>

        <div className="project-home-page__call-to-action">
          {props.project && !props.project.redirect &&
            <Link to={`/projects/${props.project.slug}/about`} className="project-home-page__button call-to-action__button call-to-action__button--learn-more">
              <Translate content="project.home.learnMore" />
            </Link>}
          {!props.showWorkflowButtons && props.project && !props.project.redirect &&
            <Link
              to={`/projects/${props.project.slug}/classify`}
              className="project-home-page__button call-to-action__button call-to-action__button--get-started"
            >
              <Translate content="project.home.getStarted" />
            </Link>}
          {props.project && props.project.redirect &&
            <a href={props.project.redirect} className="project-home-page__button">
              <strong><Translate content="project.home.visitLink" /></strong>
              <i className="fa fa-external-link" />
            </a>}
        </div>

        <ProjectHomeWorkflowButtons
          activeWorkflows={props.activeWorkflows}
          onChangePreferences={props.onChangePreferences}
          preferences={props.preferences}
          project={props.project}
          projectIsComplete={props.projectIsComplete}
          showWorkflowButtons={props.showWorkflowButtons}
          workflowAssignment={props.project.experimental_tools.includes('workflow assignment')}
          splits={props.splits}
          user={props.user}
        />
      </div>

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
          <TalkStatus
            project={props.project}
            translation={props.translation}
          />
        </div>
      )}

      <ProjectMetadata
        project={props.project}
        activeWorkflows={props.activeWorkflows}
        showTalkStatus={!renderTalkSubjectsPreview}
        translation={props.translation}
      />

      <div className="project-home-page__container">
        {props.project.researcher_quote && (
          <div className="project-home-page__researcher-words">
            <h4 className="project-home-page__small-header"><Translate content="project.home.researcher" /></h4>

            <div>
              <img role="presentation" src={avatarSrc} />
              <span>&quot;{props.translation.researcher_quote}&quot;</span>
            </div>
          </div>)}

        <div className="project-home-page__about-text">
          <h4 className="project-home-page__small-header">
            <Translate
              content="project.home.about"
              with={{
                title: props.translation.display_name
              }}
            />
          </h4>
          {props.project.introduction &&
            <Markdown project={props.project}>
              {props.translation.introduction}
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
  organization: null,
  preferences: {},
  project: {},
  projectIsComplete: false,
  showWorkflowButtons: false,
  splits: {},
  talkSubjects: [],
  user: null
};

ProjectHomePage.propTypes = {
  activeWorkflows: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  background: React.PropTypes.shape({
    src: React.PropTypes.string
  }).isRequired,
  onChangePreferences: React.PropTypes.func.isRequired,
  organization: React.PropTypes.shape({
    display_name: React.PropTypes.string,
    slug: React.PropTypes.string
  }),
  preferences: React.PropTypes.object,
  project: React.PropTypes.shape({
    configuration: React.PropTypes.object,
    description: React.PropTypes.string,
    display_name: React.PropTypes.string,
    experimental_tools: React.PropTypes.arrayOf(React.PropTypes.string),
    id: React.PropTypes.string,
    introduction: React.PropTypes.string,
    redirect: React.PropTypes.string,
    researcher_quote: React.PropTypes.string,
    slug: React.PropTypes.string
  }).isRequired,
  projectIsComplete: React.PropTypes.bool.isRequired,
  researcherAvatar: React.PropTypes.string,
  showWorkflowButtons: React.PropTypes.bool,
  splits: React.PropTypes.object,
  talkSubjects: React.PropTypes.arrayOf(React.PropTypes.object),
  translation: React.PropTypes.shape({
    description: React.PropTypes.string,
    display_name: React.PropTypes.string,
    introduction: React.PropTypes.string,
    researcher_quote: React.PropTypes.string,
    title: React.PropTypes.string
  }).isRequired,
  user: React.PropTypes.object
};

export default ProjectHomePage;
