/* eslint multiline-ternary: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';
import styled from 'styled-components';

const StyledProgressBar = styled.div`
  background-color: #EFF2F5;
  height: ${props => (props.height === 'small' ? '1.4em' : '2.4em')};
  margin-bottom: 1em;
`;

const StyledProgressBarMeter = styled.span`
  background: linear-gradient(270deg, #D46256 0%, #F0B200 100%);
  display: block;
  height: 100%;
`;

const StyledText = styled.span`
  color: #000000;
  font-size: 14px;
  margin-left: 12px;
`;

function ProgressBar({ resource, height }) {
  const hideStat = resource && resource.configuration && resource.configuration.stats_hidden;

  return (
    <StyledProgressBar height={height}>
      {hideStat ? (
        <Translate
          component={StyledText}
          content="organization.stats.hidden"
        />
      ) : (
        <StyledProgressBarMeter
          style={{ width: `${Math.round(resource.completeness * 100)}%` }}
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
  height: PropTypes.string
};

ProgressBar.defaultProps = {
  height: ''
};

export default ProgressBar;
