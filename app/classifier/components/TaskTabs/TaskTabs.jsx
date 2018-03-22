import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as userInterfaceActions from '../../../redux/ducks/userInterface';
import QuestionTab from './components/QuestionTab';
import TutorialTab from './components/TutorialTab';

export const TabsWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

// TODO: make QuestionTab and TutorialTab actual functional tabs according to design
export default function TaskTabs({ projectPreferences, tutorial, user, workflow }) {
  return (
    <TabsWrapper>
      <QuestionTab />
      <TutorialTab
        projectPreferences={projectPreferences}
        tutorial={tutorial}
        user={user}
        workflow={workflow}
      />
    </TabsWrapper>
  );
}

TaskTabs.propTypes = {
  projectPreferences: PropTypes.object,
  tutorial: PropTypes.object,
  user: PropTypes.object,
  workflow: PropTypes.object
};

