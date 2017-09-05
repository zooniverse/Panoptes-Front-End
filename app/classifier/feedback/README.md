## Generalised Feedback

  Feedback is enabled per-task - there's a checkbox under the answer editing box that toggles it on and off.

  ![Enable feedback toggle](/assets/feedback-toggle.png)

  Once enabled, you can add a feedback type by hitting the button:

  ![Add information for feedback types](/assets/feedback-details.png)

  You can then add information for that feedback type. All fields are required.

  - `ID` - a unique field to identify the type of feedback, e.g. SIM, DUD etc.
  - `Default success message` - shown if the correct answer is selected
  - `Default success message` - shown if an incorrect answer is selected
  - `Answer` - links the correct answer to that feedback type

  In the subject manifest, you can then add the following columns:

  - `#feedback_N_type` - corresponds to the ID field above
  - `#feedback_N_successMessage` - overrides the default success message
  - `#feedback_N_failureMessage` - overrides the default failure message

  `N` is an integer - you can have as many feedback fields as you like (currently they'll all be checked when running feedback). Only `#feedback_N_type` is required.

  For the "single question required" workflow, the manifest looks like this:

  ```csv
  image_name_1,#feedback_1_type,#feedback_1_successMessage,#feedback_1_failureMessage,
  foo.jpg,"FOO","","",
  bar.jpg,"BAR","","",
  baz.jpg,"BAZ","this is a custom success message","this is a custom failure message",
  ```

  ### Feedback summary

  The summary is generated at the end of a classification, based on the subject feedback fields, the active rules, and the task:

  ![Feedback summary](/assets/feedback-summary.png)
