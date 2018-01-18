import React from 'react';
import counterpart from 'counterpart';
import { Markdown } from 'markdownz';

const HowToBuildProject = () =>
  (<div className="on-secondary-page">
    <Markdown>{counterpart('lab.help.howToBuildProject.title')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.overview')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.sectionOverview')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.quickGuide')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.navigatingTheProjectBuilder')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.project')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.workflows')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.subjects')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.projectBuildingInDetail')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.projectDetails')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.about')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.collaborators')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.tutorials')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.media')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.visibility')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.workflow')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.createTasks')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.wiringTasksTogether')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.taskContent')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.questions')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.marking')}</Markdown>
    <Markdown>{counterpart('lab.help.howToBuildProject.subjectSets')}</Markdown>
  </div>);

export default HowToBuildProject;
