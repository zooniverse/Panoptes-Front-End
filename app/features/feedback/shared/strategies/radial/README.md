# Feedback Strategy: Radial

Determines whether a point is within a given tolerance.

## Subject metadata fields

- `#feedback_N_id` (**required**) - ID of the corresponding workflow task rule.
- `#feedback_N_x` (**required**) - x value of the target circle.
- `#feedback_N_y` (**required**) - y value of the target circle.
- `#feedback_N_tolerance` (optional) - radius of the target circle. Overrides the default tolerance set on the workflow task rule.
- `#feedback_N_successMessage` (optional) - message to show when the target is correctly annotated. Overrides the default success message set on the workflow task rule.
- `#feedback_N_failureMessage` (optional) - message to show when the target is incorrectly annotated. Overrides the default failure message set on the workflow task rule.
