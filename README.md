Introduction
============

Onion is the web client for Ascribe. The idea is to have a well documented, modern, easy to test, easy to hack, JavaScript application.

The code is JavaScript 2015 / ECMAScript 6.


Getting started
===============

Install some nice extensions for Chrom(e|ium):

- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Alt Developer Tools](https://github.com/goatslacker/alt-devtool)

```bash
# Using node v5+, and if you aren't already, preferrably with nvm
git clone git@github.com:ascribe/onion.git
cd onion
cp .env_template .env
npm install
npm run start:dev
```

Additionally, to work on the white labeling functionality, you need to edit your `/etc/hosts` file and add:

```
127.0.0.1   localhost.com
127.0.0.1   cc.localhost.com
127.0.0.1   cyland.localhost.com
127.0.0.1   ikonotv.localhost.com
127.0.0.1   lumenus.localhost.com
127.0.0.1   23vivi.localhost.com
127.0.0.1   polline.localhost.com
127.0.0.1   artcity.localhost.com
127.0.0.1   demo.localhost.com
127.0.0.1   liquidgallery.localhost.com
```


JavaScript Code Conventions
===========================

For this project, we're using:

* 4 Spaces
* ES6
* We don't use ES6's class declaration for React components because it does not support Mixins as well as Autobinding ([Blog post about it](http://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#autobinding))
* We don't use camel case for file naming but in everything else Javascript related
* We use `momentjs` instead of Javascript's `Date` object, as the native `Date` interface previously introduced bugs and we're including `momentjs` for other dependencies anyway

Make sure to check out the [style guide](https://github.com/ascribe/javascript).

Linting
-------

We use [ESLint](https://github.com/eslint/eslint) with our own [custom config](https://www.npmjs.com/package/eslint-config-ascribe).


SCSS Code Conventions
=====================

Install [lint-scss](https://github.com/brigade/scss-lint), check the [editor integration docs](https://github.com/brigade/scss-lint#editor-integration) to integrate the lint in your editor.

Some interesting links:
* [Improving Sass code quality on theguardian.com](https://www.theguardian.com/info/developer-blog/2014/may/13/improving-sass-code-quality-on-theguardiancom)


Branch names
============

To allow Github and JIRA to track branches while still allowing us to switch branches quickly using a ticket's number (and keep our peace of mind), we have the following rules for naming branches:

```
// For issues logged in Github:
AG-<Github-issue-id>-brief-and-sane-description-of-the-ticket

// For issues logged in JIRA:
AD-<JIRA-ticket-id>-brief-and-sane-description-of-the-ticket
```

where `brief-and-sane-description-of-the-ticket` does not need to equal to the issue or ticket's title.


Example
-------

**JIRA ticket name:** `AD-1242 - Frontend caching for simple endpoints to measure perceived page load <more useless information>`

**Github branch name:** `AG-1242-caching-solution-for-stores`


Testing
=======

Unit Testing
------------

We're using Facebook's jest to do testing as it integrates nicely with react.js as well.

Tests are always created per directory by creating a `__tests__` folder. To test a specific file, a `<file_name>_tests.js` file needs to be created.

Since we're using mixed syntax, test files are not linted using ES6Lint.
This is due to the fact that jest's function mocking and ES6 module syntax are [fundamentally incompatible](https://github.com/babel/babel-jest/issues/16).

Therefore, to require a module in your test file, you need to use CommonJS's `require` syntax. Except for this, all tests can be written in ES6 syntax.

Visual Regression Testing
-------------------------

We're using [Gemini](https://github.com/gemini-testing/gemini) for visual regression tests because it supports both PhantomJS2 and SauceLabs.

See the [helper docs](test/gemini/README.md) for information on installing Gemini, its dependencies, and running and writing tests.

Integration Testing
-------------------

We're using [Sauce Labs](https://saucelabs.com/home) with [WD.js](https://github.com/admc/wd) for integration testing across browser grids with Selenium.

See the [helper docs](test/integration/README.md) for information on each part of the test stack and how to run and write tests.


Workflow
========

TODO


Troubleshooting
===============

Q: OMG nothing works

A: Try `npm install` and `npm dedupe`. Someone may have updated some dependencies.

Q: How can I use a local copy of SPOOL and Onion?
A: You should already be set up if you copied [.env_template](./.env_template) as `.env`, however, if you don't want to do this, you can also start your dev server with the following command:

```
# Assuming your SPOOL instance is on localhost:8000, otherwise adjust accordingly
ONION_API_URL='http://localhost.com:8000/' ONION_SERVER_URL='http://localhost.com:8000' npm run start:dev
```

If you are using `.env` and your local SPOOL instance is not running on the default `localhost:8000` set up, you should adjust `.env` accordingly.

Q: I want to know all dependencies that get bundled into the live build.
A: `npm run build -- --json > stats.json` and upload `stats.json` to [webpack-visualizer](https://chrisbateman.github.io/webpack-visualizer/)


Reading list
============

Start here
----------

- [ReactJS for stupid people](http://blog.andrewray.me/reactjs-for-stupid-people/)
- [Flux for stupid people](http://blog.andrewray.me/flux-for-stupid-people/)
- [ReactJS](https://facebook.github.io/react/)
- [alt.js](http://alt.js.org/)
- [alt.js readme](https://github.com/goatslacker/alt)

Moar stuff
----------

- [ReactJS: Reusable Components](https://facebook.github.io/react/docs/reusable-components.html#es6-classes)
- [24ways.org: JavaScript Modules the ES6 Way](http://24ways.org/2014/javascript-modules-the-es6-way/)
- [Babel: Learn ES6](https://babeljs.io/docs/learn-es6/)
- [egghead's awesome reactjs and flux tutorials](https://egghead.io/)
- [Crockford's genious Javascript: The Good Parts (Tim has a copy)](http://www.amazon.de/JavaScript-Parts-Working-Shallow-Grain/dp/0596517742)
