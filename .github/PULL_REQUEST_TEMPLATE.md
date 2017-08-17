Fixes # .

Describe your changes.

# Review Checklist

- [ ] Does it work in all major browsers: Firefox, Chrome, Edge, Safari?
- [ ] Does it work on mobile?
- [ ] Can you `rm -rf node_modules/ && npm install` and app works as expected?
- [ ] Did you deploy a staging branch?
- [ ] If the component is in coffeescript, is it converted to ES6? Is it free of eslint errors? Is the conversion its own commit?
- [ ] Are the tests passing locally and on Travis?


## Optional

- [ ] Have you replaced any `ChangeListener` or `PromiseRenderer` components with code that updates component state?
- [ ] If changes are made to the classifier, does the dev classifier still work?
- [ ] Have you added in [flow type annotations](https://flowtype.org/docs/type-annotations.html)?
- [ ] Have you followed the [Springer guidelines for commit messages](https://github.com/springernature/frontend-playbook/blob/master/git/git.md#commit-messages)?
