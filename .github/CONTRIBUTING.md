## Contributing

Thanks a bunch for wanting to help Zooniverse. Here are few quick guidelines to start working on our project:

### Issue

Hey you found something wrong with one of our sites, thanks for taking the time to let us know.

0. Please be as descriptive as possible.
0. Include your Browser and Operating System combination.
0. Screenshots are triple bonus Zoo points.

### Pull Requests

Say you have some documentation or code you want to add:

0. Fork the Project on Github.
0. Clone the code and follow one of the above guides to setup a dev environment.
0. Create a new git branch and make your changes.
0. Make sure the tests still pass by running `bundle exec rspec` in our Rails projects or `npm test` in the JavaScript ones.
0. Add tests if you introduced new functionality.
0. Commit your changes. Try to make your commit message [informative](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html), but we're not sticklers about it. Do try to to add `Closes #issue` or `Fixes #issue` somewhere in your message if it's addressing a specific open issue.
0. Submit a Pull Request (PR)
0. Wait for feedback or a merge!
0. If your PR is open for a while, it may get out of synch with the master branch. In that case, pull the latest master branch and run `git rebase master` – while in your _feature_ branch – to update your feature branch to the latest master. You may need to use `git push --force-with-lease` to update your PR after rebasing.

## PFE Pull Request Roles

Please see [Github's docs](https://help.github.com/articles/reviewing-changes-in-pull-requests) for more info and details on reviewing changes in pull requests.

Note: The use and implementation of Reviewers and Assignees for Panoptes Front End may be different than the way Reviewers and Assignees are used in other Zooniverse repos.

### Reviewer
- A Reviewer is a team member who provides thoughts, feedback, insight, or comments on a PR, but is not responsible for ensuring that the PR is ready for merging into the master branch.
- If you add a general inline comment, you automatically are added as a reviewer. General PR comments do not do this. See Github's docs for more detail on this.
- The developer creating the PR can optionally assign a Reviewer to the PR, if they desire their input on it, but it's ok for a PR to only have an Assignee and no Reviewer.
- It's also ok for a PR to have the same person as both the Assignee and the Reviewer.
- Also ok to have more than one Reviewer on a PR.

### Assignee
- The Assignee is the team member who deeply and thoroughly reviews the PR, ensuring that it is ready to merge into the Panoptes-Front-End master branch.
- Every PR should be given an Assignee by the developer when creating the PR.
- After any requested changes are made and approved by the Assignee, the Assignee merges the PR into the master branch, and decides whether to delete the merged branch.
  - Best practice is to delete the PR's branch after it has been merged into master.
