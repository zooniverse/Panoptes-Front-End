import RestartButton from './restart-button';
import Tutorial from '../lib/tutorial';

class TutorialButton extends RestartButton {
  shouldRender(state) {
    return (state.dialog) && (state.dialog.steps.length > 0);
  }

  getCallback(state, props) {
    return props.Dialog.start.bind(props.Dialog, state.dialog, props.user);
  }
}

TutorialButton.defaultProps = {
  Dialog: Tutorial,
};

export default TutorialButton;
