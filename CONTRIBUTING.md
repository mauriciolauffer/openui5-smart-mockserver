# How to Contribute

Patches and contributions are welcome to this project. There are just a few small guidelines you need to follow.

Contributions to this project are [released](https://help.github.com/articles/github-terms-of-service/#6-contributions-under-repository-license) to the public under the [project's open source license](LICENSE.md).

When you contribute code, you affirm that the contribution is your original work and that you license the work to the project under the project's open source license. Whether or not you state this explicitly, by submitting any copyrighted material via pull request, email, or other means you agree to license the material under the project's open source license and warrant that you have the legal authority to do so.

## Code of Conduct

Please note that this project is released with a [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Versioning

This library follows [Semantic Versioning](http://semver.org).

## Code Reviews

All submissions, including submissions by project members, require review. The project uses GitHub pull requests for this purpose. Consult [GitHub Help](https://help.github.com/articles/about-pull-requests/) for more information on using pull requests.

## Contributing

1. Look through the existing issues and see if your idea is something new.
2. Create a new issue, or comment on an existing issue that you would like to help solve:
    * it's usually best to get some feedback before proceeding to write code.
3. fork the repo, and clone it to your computer:
    * GitHub has [great documentation](https://help.github.com/articles/using-pull-requests/) regarding writing your first pull request.
4. make sure that you write unit-test for any code that you write for the project:
    * ESLint is the main SAST tool in this project.
    * look through the test suite in `/test` folder to get an idea for how to write unit-tests for this codebase.

## Before you begin

1. [Install Node.js LTS](https://nodejs.org/en/).

### How to test

1. Install dependencies:

        npm install

2. Lint the codebase:

        npm run lint

3. Run the tests:

        npm test

### How to build

Built code will be available in `/dist` folder.

1. Install dependencies:

        npm install

2. Build the production code:

        npm run build

### CI/CD

The project uses GitHub Actions for its CI/CD pipeline. There is no need to build and publish from local machines as this will be taken care by CI/CD. However, one should build locally for testing purposes.
