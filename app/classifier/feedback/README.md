    ## Generalised Feedback

      Feedback is enabled per-task - there's a checkbox under the answer editing box that toggles it on and off.

      ![screen shot 2017-04-13 at 14 29 36](https://cloud.githubusercontent.com/assets/2725841/25006659/b8d81398-2055-11e7-8cb6-8c660b4173b7.png)

      Once enabled, you can add a feedback type by hitting the button:

      ![screen shot 2017-04-13 at 14 30 40](https://cloud.githubusercontent.com/assets/2725841/25006686/d02e5f20-2055-11e7-8647-83bc343cb1fe.png)

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

      ![screen shot 2017-04-13 at 14 41 11](https://cloud.githubusercontent.com/assets/2725841/25007130/46a18cda-2057-11e7-8215-3c2ceeb0a2bc.png)
