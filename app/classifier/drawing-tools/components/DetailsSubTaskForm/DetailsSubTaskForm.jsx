import React from 'react';
import PropTypes from 'prop-types';
import StickyModalForm from 'modal-form/sticky';
import { Provider } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import Translate from 'react-translate-component';
import { pxToRem, zooTheme } from '../../../../theme';
import ModalFocus from '../../../../components/modal-focus';
import TaskTranslations from '../../../tasks/translations';

const SEMI_MODAL_FORM_STYLE = {
  pointerEvents: 'all'
};

const SEMI_MODAL_UNDERLAY_STYLE = {
  backgroundColor: 'rgba(0, 0, 0, 0)',
  pointerEvents: 'none'
};

class DetailsSubTaskForm extends React.Component {
  constructor() {
    super();
    this.handleDetailsChange = this.handleDetailsChange.bind(this);
    this.handleDetailsFormClose = this.handleDetailsFormClose.bind(this);
  }

  static defaultProps = {
    onFormClose: () => { },
    tasks: {},
    toolProps: {
      details: [],
      taskKey: '',
      mark: {}
    }
  }

  static propTypes = {
    onFormClose: PropTypes.func,
    tasks: PropTypes.object,
    toolProps: PropTypes.shape({
      details: PropTypes.array,
      taskKey: PropTypes.string,
      mark: PropTypes.object
    })
  }

  static contextTypes = {
    store: PropTypes.object
  }

  componentDidUpdate() {
    // What is this even doing? When this was in the root component, it was always being called for any update
    // Only thing changing is the transform prop. 
    // I've passed all of the parent's props to this because I don't know what this was reacting to
    // In the modal-form code, this method is for repositioning the underlay's width and height
    // But the opacity is 0, so we can't see it!
    // The class for the StickyForm is updating the styles for the pointer and form position
    // but the behavior seems the same if I comment out the following line:
    if (this.detailsForm) this.detailsForm.reposition();
  }

  areDetailsComplete(tasks, toolProps) {
    return toolProps.details.every((detailTask, i) => {
      const TaskComponent = tasks[detailTask.type];
      if (TaskComponent.isAnnotationComplete) {
        return TaskComponent.isAnnotationComplete(detailTask, toolProps.mark.details[i]);
      }

      return true;
    });
  }

  handleDetailsChange(detailIndex, annotation) {
    this.props.tool.props.mark.details[detailIndex] = annotation;
    this.props.tool.props.onChange(this.props.tool.props.mark);
  }

  handleDetailsFormClose() {
    // TODO: Check if the details tasks are complete.
    if (this.props.tool && this.props.tool.props && this.props.tool.props.onDeselect) {
      this.props.tool.props.onDeselect();
    }
    this.props.onFormClose();
  }
  
  render() {
    const { tasks, toolProps } = this.props;

    const detailsAreComplete = this.areDetailsComplete(tasks, toolProps);

    return (
      <StickyModalForm
        ref={(node) => { this.detailsForm = node; }}
        style={SEMI_MODAL_FORM_STYLE}
        underlayStyle={SEMI_MODAL_UNDERLAY_STYLE}
        onSubmit={this.handleDetailsFormClose}
        onCancel={this.handleDetailsFormClose}
      >
        <Provider store={this.context.store}>
          <ModalFocus onEscape={this.handleDetailsFormClose} preserveFocus={false}>
            {toolProps.details.map((detailTask, i) => {
              if (!detailTask._key) detailTask._key = Math.random();
              const TaskComponent = tasks[detailTask.type];
              const taskKey = `${toolProps.taskKey}.tools.${toolProps.mark.tool}.details.${i}`;
              
              return (
                <TaskTranslations
                  key={detailTask._key}
                  taskKey={taskKey}
                  task={detailTask}
                >
                  <TaskComponent
                    autoFocus={i === 0}
                    task={detailTask}
                    annotation={toolProps.mark.details[i]}
                    onChange={this.handleDetailsChange.bind(this, i)}
                    showRequiredNotice={true}
                  />
                </TaskTranslations>
              )
            })}
            <hr />
            <p style={{ textAlign: 'center' }}>
              <button
                autoFocus={toolProps.details[0].type in ['single', 'multiple']}
                type="submit"
                className="standard-button"
                disabled={!detailsAreComplete}>
                  OK
              </button>
            </p>
          </ModalFocus>
        </Provider>
      </StickyModalForm>
    );
  }
}

export default DetailsSubTaskForm;
