/* eslint multiline-ternary: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';
import styled from 'styled-components';

import getCompleteness from '../helpers/getCompleteness';

const StyledProgressBar = styled.div`
  background-color: #EFF2F5;
  height: ${props => (props.size === 'small' ? '1.4em' : '2.4em')};
  margin-bottom: ${props => (props.size === 'small' ? '1.4em' : '1.8em')};
`;

export const StyledProgressBarMeter = styled.span`
  background: linear-gradient(270deg, #D46256 0%, #F0B200 100%);
  display: block;
  height: 100%;
`;

export const StyledText = styled.span`
  color: #000000;
  font-size: 14px;
  margin-left: 12px;
`;

function ProgressBar({ resource, size }) {
  const hideStat = resource && resource.configuration && resource.configuration.stats_hidden;

  const completeness = getCompleteness(resource);

  return (
    <StyledProgressBar size={size}>
      {hideStat ? (
        <Translate
          component={StyledText}
          content="organization.stats.hidden"
        />
      ) : (
        <StyledProgressBarMeter
          style={{ width: `${Math.floor(completeness * 100)}%` }}
        />
      )}
    </StyledProgressBar>
  );
}

ProgressBar.propTypes = {
  resource: PropTypes.shape({
    completeness: PropTypes.number,
    configuration: PropTypes.shape({
      stats_hidden: PropTypes.bool
    })
  }).isRequired,
  size: PropTypes.string
};

ProgressBar.defaultProps = {
  size: ''
};

export default ProgressBar;
