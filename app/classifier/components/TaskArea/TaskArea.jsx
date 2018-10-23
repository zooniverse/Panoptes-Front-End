import styled from 'styled-components';
import theme from 'styled-theming';
import PropTypes from 'prop-types';
import { zooTheme } from '../../../theme';

const background = theme.variants('mode', 'variant', {
  goldStandardMode: {
    light: zooTheme.colors.lightTheme.background.goldStandard,
    dark: zooTheme.colors.darkTheme.background.goldStandard
  }
});

const TaskArea = styled.div`
  background: ${background};
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

TaskArea.propTypes = {
  variant: PropTypes.oneOf(['default', 'goldStandardMode'])
};

TaskArea.defaultProps = {
  variant: 'default'
};

export default TaskArea;
