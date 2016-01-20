Introduction
============

Onion is the web client for Ascribe. The idea is to have a well documented, modern, easy to test, easy to hack, JavaScript application.

The code is JavaScript 2015 / ECMAScript 6.


Getting started
===============

Install some nice extension for Chrom(e|ium):

- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Alt Developer Tools](https://github.com/goatslacker/alt-devtool)

```bash
git clone git@github.com:ascribe/onion.git
cd onion
npm install
sudo npm install -g gulp
gulp serve
```

Additionally, to work on the white labeling functionality, you need to edit your `/etc/hosts` file and add:

```
127.0.0.1   localhost.com
127.0.0.1   cc.localhost.com
127.0.0.1   cyland.localhost.com
127.0.0.1   ikonotv.localhost.com
127.0.0.1   sluice.localhost.com
127.0.0.1   lumenus.localhost.com
127.0.0.1   portfolioreview.localhost.com
127.0.0.1   23vivi.localhost.com
```


JavaScript Code Conventions
===========================

For this project, we're using:

* 4 Spaces
* ES6
* We don't use ES6's class declaration for React components because it does not support Mixins as well as Autobinding ([Blog post about it](http://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#autobinding))
* We don't use camel case for file naming but in everything Javascript related
* We use `momentjs` instead of Javascript's `Date` object, as the native `Date` interface previously introduced bugs and we're including `momentjs` for other dependencies anyway

Make sure to check out the [style guide](https://github.com/ascribe/javascript).

Linting
-------

We use [ESLint](https://github.com/eslint/eslint) with our own [custom ruleset](.eslintrc).


SCSS Code Conventions
=====================
Install [lint-scss](https://github.com/brigade/scss-lint), check the [editor integration docs](https://github.com/brigade/scss-lint#editor-integration) to integrate the lint in your editor.

Some interesting links:
* [Improving Sass code quality on theguardian.com](https://www.theguardian.com/info/developer-blog/2014/may/13/improving-sass-code-quality-on-theguardiancom)


Branch names
============

Since we moved to Github, we cannot create branch names automatically with JIRA anymore.
To not lose context, but still be able to switch branches quickly using a ticket's number, we're recommending the following rules when naming our branches in onion.

```
AD-<JIRA-ticket-id>-brief-and-sane-description-of-the-ticket
```

where `brief-and-sane-description-of-the-ticket` does not need to equal to the ticket's title.
This allows JIRA to still track branches and pull-requests while allowing us to keep our peace of mind.


Example
-------

**JIRA ticket name:** `AD-1242 - Frontend caching for simple endpoints to measure perceived page load <more useless information>`

**Github branch name:** `AD-1242-caching-solution-for-stores`


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

We're using [Gemini](https://github.com/gemini-testing/gemini) for visual regression tests because it supports PhantomJS and SauceLabs.


Workflow
========

Generally, when you're runing `gulp serve`, all tests are being run.
If you want to test exclusively (without having the obnoxious ES6Linter warnings), you can just run `gulp jest:watch`.


Troubleshooting
===============

Q: OMG nothing works

A: try `npm install`. Someone may have updated some dependencies

Q: ZOMG, I'm getting this error:
```
[09:58:56] 'sass:watch' errored after 6.68 ms
[09:58:56] Error: watch ENOSPC
    at errnoException (fs.js:1031:11)
    at FSWatcher.start (fs.js:1063:11)
    at Object.fs.watch (fs.js:1088:11)
    at Gaze._watchDir (/home/tim/ascribe/onion/node_modules/gulp/node_modules/vinyl-fs/node_modules/glob-watcher/node_modules/gaze/lib/gaze.js:289:30)
    at /home/tim/ascribe/onion/node_modules/gulp/node_modules/vinyl-fs/node_modules/glob-watcher/node_modules/gaze/lib/gaze.js:358:10
    at iterate (/home/tim/ascribe/onion/node_modules/gulp/node_modules/vinyl-fs/node_modules/glob-watcher/node_modules/gaze/lib/helper.js:52:5)
    at Object.forEachSeries (/home/tim/ascribe/onion/node_modules/gulp/node_modules/vinyl-fs/node_modules/glob-watcher/node_modules/gaze/lib/helper.js:66:3)
    at Gaze._initWatched (/home/tim/ascribe/onion/node_modules/gulp/node_modules/vinyl-fs/node_modules/glob-watcher/node_modules/gaze/lib/gaze.js:354:10)
    at Gaze.add (/home/tim/ascribe/onion/node_modules/gulp/node_modules/vinyl-fs/node_modules/glob-watcher/node_modules/gaze/lib/gaze.js:177:8)
    at new Gaze (/home/tim/ascribe/onion/node_modules/gulp/node_modules/vinyl-fs/node_modules/glob-watcher/node_modules/gaze/lib/gaze.js:74:10)

events.js:72
        throw er; // Unhandled 'error' event
              ^
Error: watch ENOSPC
    at errnoException (fs.js:1031:11)
    at FSWatcher.start (fs.js:1063:11)
    at Object.fs.watch (fs.js:1088:11)
    at createFsWatchInstance (/home/tim/ascribe/onion/node_modules/browser-sync/node_modules/chokidar/lib/nodefs-handler.js:37:15)
    at setFsWatchListener (/home/tim/ascribe/onion/node_modules/browser-sync/node_modules/chokidar/lib/nodefs-handler.js:80:15)
    at EventEmitter.NodeFsHandler._watchWithNodeFs (/home/tim/ascribe/onion/node_modules/browser-sync/node_modules/chokidar/lib/nodefs-handler.js:228:14)
    at EventEmitter.NodeFsHandler._handleDir (/home/tim/ascribe/onion/node_modules/browser-sync/node_modules/chokidar/lib/nodefs-handler.js:403:23)
    at EventEmitter.<anonymous> (/home/tim/ascribe/onion/node_modules/browser-sync/node_modules/chokidar/lib/nodefs-handler.js:450:19)
    at EventEmitter.<anonymous> (/home/tim/ascribe/onion/node_modules/browser-sync/node_modules/chokidar/lib/nodefs-handler.js:455:16)
    at Object.oncomplete (fs.js:108:15)

```
A: Use `npm dedupe` to remove duplicates in npm. This might fix that you're not [running out of watchers in your system (read the comments)](http://stackoverflow.com/a/17437601/1263876).

Q: How can I use a local copy of SPOOL and Onion?
A: Easily by starting the your gulp process with the following command:
```
ONION_BASE_URL='/' ONION_SERVER_URL='http://localhost.com:8000/' gulp serve
```

Or, by adding these two your environment variables:
```
ONION_BASE_URL='/'
ONION_SERVER_URL='http://localhost.com:8000/'
```

Q: I want to know all dependencies that get bundled into the live build.
A: ```browserify -e js/app.js --list > webapp-dependencies.txt```


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
