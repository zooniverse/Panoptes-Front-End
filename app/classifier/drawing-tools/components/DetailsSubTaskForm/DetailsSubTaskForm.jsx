import React from 'react';
import PropTypes from 'prop-types';
import StickyModalForm from 'modal-form/sticky';
import { connect, Provider } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import Translate from 'react-translate-component';
import { pxToRem, zooTheme } from '../../../../theme';
import ModalFocus from '../../../../components/modal-focus';
import TaskTranslations from '../../../tasks/translations';
import { StyledNextButton } from '../../../components/TaskNavButtons/components/NextButton/NextButton';

export const StyledStickyModalForm = styled(StickyModalForm)`
  pointer-events: none;

  .modal-form {
    background: ${theme('mode', {
      dark: zooTheme.colors.darkTheme.background.default,
      light: 'white'
    })};
    border: solid thin ${theme('mode', {
      dark: zooTheme.colors.darkTheme.background.border,
      light: zooTheme.colors.lightTheme.background.border
    })};
    border-radius: 0;
    color: ${theme('mode', {
      dark: zooTheme.colors.darkTheme.font,
      light: zooTheme.colors.lightTheme.font
    })};
    pointer-events: all;
  }

  .modal-form-pointer {
    background: ${theme('mode', {
      dark: zooTheme.colors.darkTheme.background.default,
      light: 'white'
    })};
  }

  .details-sub-task-form__submit-button-wrapper {
    text-align: center;

    button[type="submit"] {
      width: 100%;
    }
  }
`

export class DetailsSubTaskForm extends React.Component {
  constructor() {
    super();
    this.handleDetailsChange = this.handleDetailsChange.bind(this);
    this.handleDetailsFormClose = this.handleDetailsFormClose.bind(this);
  }

  static defaultProps = {
    onFormClose: () => { },
    tasks: {},
    theme: 'light',
    toolProps: {
      details: [],
      taskKey: '',
      mark: {}
    }
  }

  static propTypes = {
    onFormClose: PropTypes.func,
    tasks: PropTypes.object,
    theme: PropTypes.string,
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
    const { theme, tasks, toolProps, translations, workflow } = this.props;

    const detailsAreComplete = this.areDetailsComplete(tasks, toolProps);

    return (
      <ThemeProvider theme={{ mode: theme }}>
        <StyledStickyModalForm
          ref={(node) => { this.detailsForm = node; }}
          onSubmit={this.handleDetailsFormClose}
          onCancel={this.handleDetailsFormClose}
        >
          <Provider store={this.context.store}>
            <ModalFocus onEscape={this.handleDetailsFormClose} preserveFocus={false}>
              {toolProps.details.map((detailTask, i) => {
                if (!detailTask._key) detailTask._key = Math.random();
                const TaskComponent = tasks[detailTask.type];
                const workflowTranslation = translations.strings.workflow[workflow.id]
                const detailTranslation = workflowTranslation ?
                  workflowTranslation.strings.tasks[toolProps.taskKey].tools[toolProps.mark.tool].details[i] :
                  detailTask;
                
                return (
                  <TaskComponent
                    key={detailTask._key}
                    autoFocus={i === 0}
                    task={detailTask}
                    translation={detailTranslation}
                    annotation={toolProps.mark.details[i]}
                    onChange={this.handleDetailsChange.bind(this, i)}
                    showRequiredNotice={true}
                  />
                )
              })}
              <hr />
              <p className="details-sub-task-form__submit-button-wrapper">
                <StyledNextButton
                  autoFocus={toolProps.details[0].type in ['single', 'multiple']}
                  disabled={!detailsAreComplete}
                  type="submit"
                >
                  <Translate content="classifier.detailsSubTaskFormSubmitButton" />
                </StyledNextButton>
              </p>
            </ModalFocus>
          </Provider>
        </StyledStickyModalForm>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  theme: state.userInterface.theme,
  translations: state.translations,
  workflow: state.classify.workflow
});

export default connect(mapStateToProps)(DetailsSubTaskForm);
