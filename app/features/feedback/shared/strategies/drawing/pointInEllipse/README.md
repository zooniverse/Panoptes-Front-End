# Feedback Strategy: Point In Ellipse

Determines whether a point is within a specified ellipticakl region.

## Subject metadata fields

A single subject can have multiple feedback rules. To group the metadata fields for a single feedback rule together, `N` should be an integer that is identical for each rule, e.g.:

```
#feedback_1_id,#feedback_1_x,#feedback_1_y,feedback_1_toleranceA,feedback_1_toleranceB,#feedback_1_theta,#feedback_2_id,#feedback_2_x,#feedback_2_y,...
```

- `#feedback_N_id` (**required**) - ID of the corresponding workflow task rule.
- `#feedback_N_x` (**required**) - x value of the target ellipse.
- `#feedback_N_y` (**required**) - y value of the target ellipse.
- `#feedback_N_toleranceA` (**recommended**) - semimajor axis **diameter** of the target ellipse. Overrides the single default tolerance value set on the workflow task rule.
- `#feedback_N_toleranceB` (**recommended**) - semiminor axis **diameter** of the target ellipse. Overrides the single default tolerance value set on the workflow task rule.
- `#feedback_N_theta` (**recommended**) - rotation of the axes of the target ellipse in **clockwise** degrees. Default is 0.
- `#feedback_N_successMessage` (optional) - message to show when the target is correctly annotated. Overrides the default success message set on the workflow task rule.
- `#feedback_N_failureMessage` (optional) - message to show when the target is incorrectly annotated. Overrides the default failure message set on the workflow task rule.
