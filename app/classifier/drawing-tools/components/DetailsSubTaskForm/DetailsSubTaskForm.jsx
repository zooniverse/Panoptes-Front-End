import React from 'react';
import PropTypes from 'prop-types';
import StickyModalForm from 'modal-form/sticky';
import { Provider } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import Translate from 'react-translate-component';
import { pxToRem, zooTheme } from '../../../../theme';
import ModalFocus from '../../components/modal-focus';

const SEMI_MODAL_FORM_STYLE = {
  pointerEvents: 'all'
};

const SEMI_MODAL_UNDERLAY_STYLE = {
  backgroundColor: 'rgba(0, 0, 0, 0)',
  pointerEvents: 'none'
};

class DetailsSubTaskForm extends React.Component {
  areDetailsComplete(tasks, toolProps) {
    return toolProps.details.every((detailTask, i) => {
      const TaskComponent = tasks[detailTask.type];
      if (TaskComponent.isAnnotationComplete) {
        return TaskComponent.isAnnotationComplete(detailTask, toolProps.mark.details[i]);
      }

      return true;
    });
  }

  render() {
    const { handleDetailsChange, handleDetailsFormClose, tasks, toolProps } = this.props;

    const detailsAreComplete = this.areDetailsComplete(tasks, toolProps);

    return (
      <StickyModalForm
        ref="detailsForm"
        style={SEMI_MODAL_FORM_STYLE}
        underlayStyle={SEMI_MODAL_UNDERLAY_STYLE}
        onSubmit={handleDetailsFormClose}
        onCancel={handleDetailsFormClose}
      >
        <Provider store={this.context.store}>
          <ModalFocus onEscape={handleDetailsFormClose} preserveFocus={false}>
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
                    onChange={handleDetailsChange.bind(this, i)}
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