# Feedback Strategy: Column

Determines whether a column is within a given tolerance.

## Subject metadata fields

- `#feedback_N_id` (**required**) - ID of the corresponding workflow task rule.
- `#feedback_N_x` (**required**) - x value of the target column.
- `#feedback_N_width` (**required**) - width value of the target column.
- `#feedback_N_tolerance` (optional) - Margin of error around the target column. Overrides the default tolerance set on the workflow task rule.
- `#feedback_N_successMessage` (optional) - message to show when the target is correctly annotated. Overrides the default success message set on the workflow task rule.
- `#feedback_N_failureMessage` (optional) - message to show when the target is incorrectly annotated. Overrides the default failure message set on the workflow task rule.
- `#feedback_N_falsePosMode` (optional) - if `true`, specifies that a click within the specified columnar region should be interpreted as a false positive and no failure message will be displayed. False positives will render as red columns with blue tolerance regions in the modal feedback window if clicked on and will not render otherwise. The default is `false`.
