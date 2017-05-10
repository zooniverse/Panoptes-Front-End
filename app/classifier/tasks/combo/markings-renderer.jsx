import React from 'react';

export default function MarkingsRenderer(props) {
  // a list that holds the annotations for the current combo task
  let currentComboAnnotations = [];
  const allTaskTypes = props.classification.annotations.map( annotation => props.workflow.tasks[annotation.task].type);
  const i = allTaskTypes.lastIndexOf('combo');
  if (i > -1) {
    currentComboAnnotations = props.classification.annotations[i].value;
  }
  // a list that holds the annotations for all combo tasks
  let allComboAnnotations = [];
  const allComboTypes = [];
  props.classification.annotations.map( (annotation) => {
    const taskDescription = props.workflow.tasks[annotation.task];
    if (taskDescription.type === 'combo') {
      allComboAnnotations = allComboAnnotations.concat(annotation.value);
      annotation.value.map((a) => {
        allComboTypes.push(props.workflow.tasks[a.task].type);
      });
    }
  });


  return (
    <g className="combo-task-persist-inside-subject-container">
      {Object.keys(props.taskTypes)
        .filter((taskType) => { return taskType !== 'combo'; })
        .map((taskType) => {
          const TaskComponent = props.taskTypes[taskType];
          if (TaskComponent.PersistInsideSubject) {
            // when a combo annotation changes make sure the combo annotation updated correctly with only the
            // curreny combo task's annotatons.  This is a hack to make drawing tasks work in a combo task.
            function fauxChange(annotation) {
              props.onChange(Object.assign({}, props.annotation, { value: currentComboAnnotations }));
            };
            let fauxAnnotation = props.annotation;
            if (props.annotation && props.annotation.task && props.workflow.tasks && props.workflow.tasks[props.annotation.task].type === 'combo') {
              const idx = allComboTypes.lastIndexOf(taskType);
              if (idx > -1) {
                // if the current annotation is for the combo task pass in the `inner` annotations
                //This is a hack to make drawing tasks work in a combo task.
                fauxAnnotation = allComboAnnotations[idx];
              }
            }
            return (
              <TaskComponent.PersistInsideSubject
                key={taskType}
                {...props}
                onChange={fauxChange}
                annotations={allComboAnnotations}
                annotation={fauxAnnotation}
              />
            );
          }
        })
      }
  </g>
  );
}
