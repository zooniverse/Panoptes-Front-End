import RestartButton from './restart-button';
import Tutorial from '../lib/tutorial';

class TutorialButton extends RestartButton {
  shouldRender(state, props) {
    return (props.dialog) && (props.dialog.steps.length > 0);
  }

  getCallback(state, props, context) {
    return props.Dialog.start.bind(props.Dialog, props.dialog, props.user, props.preferences, context.geordi);
  }
}

TutorialButton.defaultProps = {
  Dialog: Tutorial,
};

export default TutorialButton;
