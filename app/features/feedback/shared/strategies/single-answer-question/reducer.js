function singleAnswerQuestionReducer(rule, annotations) {
  const answerId = annotations || -1
  const result = rule.answer === answerId.toString()
  return Object.assign({}, rule, {
    success: result
  });
}

export default singleAnswerQuestionReducer;
