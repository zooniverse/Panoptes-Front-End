import RestartButton from './restart-button';
import MiniCourse from '../lib/mini-course';

class MiniCourseButton extends RestartButton {
  shouldRender(state, props) {
    return (props.dialog) && (props.dialog.steps.length > 0) && (props.user);
  }

  getCallback(state, props, context) {
    return props.Dialog.restart.bind(props.Dialog, props.dialog, props.preferences, props.project, props.user, context.geordi);
  }
}

MiniCourseButton.defaultProps = {
  Dialog: MiniCourse,
};

export default MiniCourseButton;
