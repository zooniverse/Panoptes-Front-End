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
1. Start creating a new rule by clicking the button.
1. Define a unique id for the rule, check the boxes for whether you want feedback to be shown on success, failure or both. Where enabled, a default message must be defined.
1. Select a strategy for your rule. See the Strategies section below for more information.
1. Define any additional options required by the chosen strategy, and save the new rule.

### Subjects

1. Assemble your images, and create a `manifest.csv` file.
1. For each subject where you want a feedback rule enabled, add the following columns:

  - `#feedback_N_id` **(required)** - corresponds to the desired rule ID you created in the workflow.
  - `#feedback_N_successMessage` (optional) - a success message specific to this subject that overrides the default success message set on the workflow.
  - `#feedback_N_failureMessage` (optional) - a failure message specific to this subject that overrides the default failure message set on the workflow.

  `N` must be an integer. This lets you define multiple rules on one subject.

## Strategies

A strategy is the method for reconciling a user's annotations and the known data defined on the subject. The following strategies are available; please follow links to strategy-specific documentation:

- Drawing
    - [Radial](shared/strategies/drawing/radial/README.md)
    - [Point In Ellipse](shared/strategies/drawing/pointInEllipse/README.md)
    - [Column](shared/strategies/drawing/column/README.md)
- [Dud](shared/strategies/dud/README.md)
- [Single Answer Question](shared/strategies/single-answer-question/README.md)
- [Survey: Simple](shared/strategies/survey/simple/README.md)
- [Datavis: Graph2dRange](shared/strategies/datavis/graph2drange/README.md)
