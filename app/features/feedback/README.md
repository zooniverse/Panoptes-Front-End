# Feedback

## Architecture

- `lab` - Containers and components related to setting feedback settings in the Project Builder.
- `classifer` - Containers and components for the feedback modal in the classifier.
- `shared` - Shared code used by both the project builder and the classifier.

  - `strategies` - the different methods for reconciling subject metadata and the workflow-defined rules. Each exports the code for both the lab and classifier, keeping all related code in the same place.

## How to set up feedback on a project

**Requires the general feedback experimental option to be enabled.**

### Workflow

1. In the project builder, navigate to your workflow, and find the feedback section in the bottom right.
2. Start creating a new rule by clicking the button.
3. Define a unique id for the rule, check the boxes for whether you want feedback to be shown on success, failure or both. Where enabled, a default message must be defined.
4. Select a strategy for your rule. See the Strategies section below for more information.
5. Define any additional options required by the chosen strategy, and save the new rule.

### Subjects

1. Assemble your images, and create a `manifest.csv` file.
2. For each subject where you want a feedback rule enabled, add the following columns:

  - `#feedback_N_id` **(required)** - corresponds to the desired rule ID you created in the workflow.
  - `#feedback_N_successMessage` (optional) - a success message specific to this subject that overrides the default success message set on the workflow.
  - `#feedback_N_failureMessage` (optional) - a failure message specific to this subject that overrides the default failure message set on the workflow.

  `N` must be an integer. This lets you define multiple rules on one subject.

## Strategies

A strategy is the method for reconciling a user's annotations and the known data defined on the subject. The following strategies are available:

### Radial

Uses the point tool. Determines whether any points lie within a defined tolerance of a point defined on the subject metadata.

#### Additional workflow options

- **Default tolerance** - a default tolerance value around the point defined on the subject.

#### Additional Subject metadata fields

- `#feedback_N_x` **(required)** - the X coordinate for the known point.
- `#feedback_N_y` **(required)** - the Y coordinate for the known point.
- `#feedback_N_tolerance` (optional) - the radius around the known point for a valid annotation. Defaults the the value defined on the workflow if not set.

#### Support for pluralised feedback messages

Pluralised feedback messages can be enabled in the project builder and workflow defaults can be specified in the rule editor. These defaults can be overridden for specific subjects using metadata.

- `#feedback_N_pluralSuccessMessage` (optional) - message to show when several targets are correctly annotated. Overrides the default plural success message set on the workflow task rule.
- `#feedback_N_pluralFailureMessage` (optional) - message to show when several targets are incorrectly annotated. Overrides the default plural failure message set on the workflow task rule.

The pluralised messages can include the special placeholder value `${count}` which will be replaced by the number of marks to which the pluralised feedback message applies.

#### Support for customised marker colours

Sets of allowable marker colours for unique (possibly pluralised) feedback messages can be specified for success and failure categories in the project builder. The feedback messages will also be colorised to match the marks.

#### Support for different shapes to indicate success and failure

Instead of showing circles for both success and failure marks, the project builder includes a toggle which will mark successes using circles and failures using squares. Since the failure markers should always lie precisely at the point of interest it is less important that the tolerance radius be displayed accurately in all directions (the sides of the square have a length which is double the tolerance radius).

### Dud

Determines whether there should be any annotations or not. There are no additional workflow options or subject fields required.
