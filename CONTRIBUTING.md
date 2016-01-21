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
