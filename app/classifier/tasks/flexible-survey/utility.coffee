module.exports =
  getQuestionIDs: (task, choiceID) ->
    return [] if task.choices[choiceID].noQuestions
    return task.questionsOrder unless task.questionsMap? and choiceID of task.questionsMap
    task.questionsMap[choiceID]
  getQuestions: (task, choiceID) ->
    @getQuestionIDs(task, choiceID).map (idx) ->
      task.questions[idx]
