/*
Checks if a Step is considered a "Fixed Step".
A "Fixed Step" is a "pre-packaged deal", i.e. it contains a specific set of
Tasks that are added together, and must be deleted together. A good example of
this is the "Transcription Task", which actually a Step/Page that contains
1x Transcription-type Task and 1x Question-type Task.

- Returns true if:
  - Step contains a Transcription Task.
  - (uh, and that's it as of May 2025)
- Returns false otherwise.
 */

export default function checkIsFixedStep(tasksInStep) {
  if (!Array.isArray(tasksInStep)) return false

  console.log('+++ ', tasksInStep)

  return tasksInStep.some(task => task.type === 'transcription')
}
