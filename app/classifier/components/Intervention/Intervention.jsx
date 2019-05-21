import React, { memo, useEffect } from 'react';
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

function Intervention(props) {
  const { onUnmount, intervention, user } = props;
  const { message } = intervention;
  const checkbox = React.createRef();

  useEffect(() => {
     /* the return value of an effect will be called to clean up after the component.
     Passing an empty array ([]) as a second argument tells React that your effect doesn’t depend on any values from props or state
     so it never needs to re-run, https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects */
    return onUnmount;
  }, []);

  function onChange() {
    // Invert the checked value because true means do not send me messages.
    user
      .update({ intervention_notifications: !checkbox.current.checked })
      .save();
  }
  return (
    <StyledInterventionMessage>
      <Markdown>{message}</Markdown>
      <div className="classification-intervention-message-with-optOut">
        <Markdown>
          {counterpart('classifier.interventions.studyInfo')}
        </Markdown>
        <label>
          <input
            ref={checkbox}
            autoFocus={true}
            type="checkbox"
            onChange={onChange}
          />
          {counterpart('classifier.interventions.optOut')}
        </label>
      </div>
    </StyledInterventionMessage>
  );
}

Intervention.defaultProps = {
  onUnmount: () => true
};

Intervention.propTypes = {
  intervention: PropTypes.shape({
      message: PropTypes.string
    }).isRequired,
    onUnmount: PropTypes.func,
  user: PropTypes.shape({
    intervention_notifications: PropTypes.bool
  }).isRequired
};

export default memo(Intervention);
export { Intervention }
