import RestartButton from './restart-button';
import MiniCourse from '../lib/mini-course';

class MiniCourseButton extends RestartButton {
  shouldRender(state, props) {
    return (state.dialog) && (state.dialog.steps.length > 0) && (props.user);
  }

  getCallback(state, props) {
    return props.Dialog.restart.bind(props.Dialog, state.dialog, props.preferences, props.project, props.user);
  }
}

MiniCourseButton.defaultProps = {
  Dialog: MiniCourse,
};

export default MiniCourseButton;
