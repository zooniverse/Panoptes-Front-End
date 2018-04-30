import styled from 'styled-components';
import theme from 'styled-theming';
import { zooTheme } from '../../../theme';

const TaskArea = styled.div`
  background-color: ${theme('mode', {
    dark: zooTheme.colors.darkTheme.background.default,
    light: 'white'
  })};
  border: solid thin ${theme('mode', {
    dark: zooTheme.colors.darkTheme.background.border,
    light: zooTheme.colors.lightTheme.background.border
  })};
  color: ${theme('mode', {
    dark: zooTheme.colors.darkTheme.font,
    light: zooTheme.colors.lightTheme.font
  })};
  flex: 0 0 45ch;
  margin-bottom: 1em;
  max-width: 100%;
  padding: 0 0 2em 0;

  @media (min-width: 900px) {
    margin-left: 1em;
  }
`;

export default TaskArea;
