import React from 'react';
import PropTypes from 'prop-types';
import counterpart from 'counterpart';
import styled from 'styled-components';
import { Markdown } from 'markdownz';

const StyledInterventionMessage = styled.div`
  border-bottom: solid 1px;
  margin: 0 2em 1em;
  padding: 0 0 .7em;
  
  label: {
    font-size: 0.7em;
  }
`;

function Intervention({ intervention, user }) {
  const { message } = intervention;
  const checkbox = React.createRef();

  function onChange() {
    // Invert the checked value because true means do not send me messages.
    user
      .update({ intervention_notifications: !checkbox.current.checked })
      .save();
  }
  return (
    <StyledInterventionMessage>
      <Markdown>{message}</Markdown>
      <label>
        <input
          ref={checkbox}
          autoFocus={true}
          type="checkbox"
          onChange={onChange}
        />
        {counterpart('classifier.interventions.optOut')}
      </label>
    </StyledInterventionMessage>
  );
}

Intervention.propTypes = {
  intervention: PropTypes.shape({
      message: PropTypes.string
    }).isRequired,
  user: PropTypes.shape({
    intervention_notifications: PropTypes.bool
  }).isRequired
};

export default Intervention;
