Staging branch URL: https://pr-{NUMBER}.pfe-preview.zooniverse.org

Fixes # .

Describe your changes.

# Required Manual Testing

- [ ] Does the non-logged in home page render correctly?
- [ ] Does the logged in home page render correctly?
- [ ] Does the projects page render correctly?
- [ ] Can you load project home pages?
- [ ] Can you load the classification page?
- [ ] Can you submit a classification?
- [ ] Does talk load correctly?
- [ ] Can you post a talk comment?

# Review Checklist

- [ ] Does it work in all major browsers: Firefox, Chrome, Edge, Safari?
- [ ] Does it work on mobile?
- [ ] Can you `rm -rf node_modules/ && npm install` and app works as expected?
- [ ] If the component is in coffeescript, is it converted to ES6? Is it free of eslint errors? Is the conversion its own commit?
- [ ] Are the tests passing locally and on Travis?

# Optional

- [ ] Have you replaced any `ChangeListener` or `PromiseRenderer` components with code that updates component state?
- [ ] If changes are made to the classifier, does the dev classifier still work?
- [ ] Have you [resized and compressed](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/image-optimization) any image you've added?
- [ ] Have you added in [flow type annotations](https://flowtype.org/docs/type-annotations.html)?
- [ ] Have you followed the [Springer guidelines for commit messages](https://github.com/springernature/frontend-playbook/blob/master/git/git.md#commit-messages)?
