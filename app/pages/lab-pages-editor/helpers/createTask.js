/*
Creates an empty/placeholder Task that's ready to be inserted into a Workflow.
NOTE: the Task Key isn't handled by this function. Whatever's calling this
function needs to assign the appropriate Task Key to this Task, and then add it
to the Workflow.
 */

import tasks from '../../../classifier/tasks'

export default function createTask(taskType) {

  // Special type: transcription
  if (taskType === 'transcription') {
    throw new Error('createTask(): a "Transcription Task" is actually a Fixed Step that contains a two Tasks. createTask() only creates one Task at a time, so please specify either taskType=transcription-pt1 or taskType=transcription-pt2')

  } else if (taskType === 'transcription-pt1') {
    return {
      help: '**To underline and transcribe**: Click a dot at the start and end of a row of text to create an underline mark. Adjust the mark by clicking and dragging the dots at the start and end of the line. Delete the mark by clicking on the X. Type into the pop-up box to transcribe the text you’ve underlined.      **To interact with previous annotations**: Click on a pink underline mark to see previous transcriptions. Select a transcription from the dropdown menu to populate the text box. Submit as is, or edit the text by clicking into the text box. If you don’t agree with any of the previous options, transcribe directly into the box.',
      instruction: 'Welcome to the new Transcription Task! There are two ways to transcribe, depending on whether anyone else has seen this image previously.      1. If the document has no previous volunteer-made marks: underline a single row of text by clicking at the start and end of the line (please draw your marks in the order you’re reading the text), and follow the instructions on the pop-up for transcribing the text you’ve just underlined.      2. If the document has previous annotations: click on an underline mark to view, select, edit, and/or submit previous transcriptions.',
      tools: [
        {
          color: '',
          details: [
            {
              help: '',
              instruction: 'Transcribe the line of text that you\'ve marked.',
              required: 'true',
              type: 'text'
            }
          ],
          label: 'Single line of text',
          type: 'transcriptionLine'
        }
      ],
      type: 'transcription'
    }

  } else if (taskType === 'transcription-pt2') {
    return {
      answers: [{label: 'Yes'}, {label: 'No'}],
      help: 'If all the volunteer-made underline marks are **grey**, that indicates that consensus (agreement) has been achieved for all lines on the page and it is now ready to be retired from the project: **click YES**. ↵↵If there are non-grey underline marks on the page, that means those lines have not yet reached consensus: **click NO**.',
      question: 'Have all the volunteer-made underline marks turned grey?',
      required: 'true',
      type: 'single'
    }
  }

  // Standard tasks: this covers 90% of Task types!
  return tasks[taskType]?.getDefaultTask()
}
