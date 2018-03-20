import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Translate from 'react-translate-component';
import { pxToRem } from '../../../theme';

// TODO: add a TutorialTab
// TODO: add onClick functionality

export const TabsWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

export const QuestionTab = styled.button.attrs({
  type: 'button'
})`
  background-color: white;
  border: none;
  color: black;
  display: inline-block;
  flex: 0 0 50%;
  font-size: ${pxToRem(14)};
  font-weight: bold;
  letter-spacing: ${pxToRem(1)};
  padding: ${pxToRem(16)};
  text-transform: uppercase;
`;

// TODO: make QuestionTab and TutorialTab actual functional tabs according to design
export default function TaskTabs({ projectPreferences, tutorial, user, workflow }) {
  return (
    <TabsWrapper>
      <QuestionTab><Translate content="classifier.question" /></QuestionTab>
    </TabsWrapper>
  );
}
