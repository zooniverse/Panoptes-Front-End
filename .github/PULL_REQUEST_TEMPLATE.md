Note: We are no longer actively developing new features for this app. Open a PR to fix a bug, edit translations, or propose code changes related to new features being developed over at [front-end-monorepo](https://github.com/zooniverse/front-end-monorepo/).

## Linked Issue and/or Talk Post

## Describe your changes

## How to Review
- What user actions should my reviewer step through to review this PR?
- Are there plans for follow up PR’s to further fix this bug or develop this feature?

## Checklist

### General UX
- [ ] Staging branch URL: https://pr-{NUMBER}.pfe-preview.zooniverse.org/lab
- [ ] The component is accessible (double check especially if adding new code to this codebase). We recognize that not all legacy components of PFE will pass accessibility guidelines.
  - Can be used with a screen reader [BBC guide to VoiceOver](https://bbc.github.io/accessibility-news-and-you/assistive-technology/testing-steps/voiceover-mac.html)
  - Can be used from the keyboard [WebAIM guide to keyboard testing](https://webaim.org/techniques/keyboard/#testing)

### Bug Fix
- [ ] The PR creator has listed user actions to use when testing if bug is fixed
- [ ] The bug is fixed
- [ ] Unit tests are added or updated

### Refactoring
- [ ] The PR creator has described the reason for refactoring
- [ ] The refactored component(s) continue to work as expected

### Maintenance
- [ ] If not from dependabot, the PR creator has described the update (major, minor, or patch version, changelog)
