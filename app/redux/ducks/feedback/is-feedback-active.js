function isFeedbackActive(project) {
  return project &&
    project.experimental_tools &&
    project.experimental_tools.includes('general feedback');
}

export default isFeedbackActive;
