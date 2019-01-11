function getQuestionIDs(task, choiceID) {
  if (task.choices[choiceID].noQuestions) {
    return [];
  }
  if (!(task.questionsMap && Object.keys(task.questionsMap).indexOf(choiceID) >= 0)) {
    return task.questionsOrder;
  }
  return task.questionsMap[choiceID];
}

export { getQuestionIDs };
