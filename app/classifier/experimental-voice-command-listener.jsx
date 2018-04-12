/*
Experimental Voice Command Listener
-----------------------------------

This is a hackday experiment that utilises HTML5's experimental new (as of Apr
2018) web speech API to receive voice commands from the user. Basically, instead
of using the mouse/keyboard to interact with the project, you can just shout out
"Spiral Galaxy!", "Giraffes!", "42!" to classify subjects. This will work well
and cannot possibly end badly, especially if you're shouting at your computer in
a public space.

This component will be tied to the TaskNav component, which handles user input
for workflow tasks. (Saying yes/no to a question, clicking survey task buttons,
etc.)

If anything goes wrong, blame Coleman, Darryl, Tim L, and Shaun.

(@shaun.a.noordin 20180412)
 */

import PropTypes from 'prop-types';
import React from 'react';

class ExperimentalVoiceCommandListener extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div>
        <button>LISTEN</button>
      </div>
    );
  }
}

export default ExperimentalVoiceCommandListener;