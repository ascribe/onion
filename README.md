Introduction
============

Onion is the web client for Ascribe. The idea is to have a well documented,
easy to test, easy to hack, JavaScript application.

The code is JavaScript ECMA 6.


Getting started
===============
Install some nice extension for Chrom(e|ium):

- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
  
```bash
git clone git@bitbucket.org:ascribe/onion.git
cd onion
npm install
sudo npm install -g gulp
gulp serve
```

Additionally, to work on the white labeling functionality, you need to edit your `/etc/hosts` file and add:

```
127.0.0.1 localhost.com
127.0.0.1 cc.localhost.com
```


Code Conventions
================
For this project, we're using:

* 4 Spaces
* We use ES6
* We don't use ES6's class declaration for React components because it does not support Mixins as well as Autobinding ([Blog post about it](http://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#autobinding))
* We don't use camel case for file naming but in everything Javascript related
* We use `let` instead of `var`: [SA Post](http://stackoverflow.com/questions/762011/javascript-let-keyword-vs-var-keyword) 

Testing
===============
We're using Facebook's jest to do testing as it integrates nicely with react.js as well.

Tests are always created per directory by creating a `__tests__` folder. To test a specific file, a `<file_name>_tests.js` file needs to be created.

Since we're using mixed syntax, test files are not linted using ES6Lint.
This is due to the fact that jest's function mocking and ES6 module syntax are [fundamentally incompatible](https://github.com/babel/babel-jest/issues/16).

Therefore, to require a module in your test file, you need to use CommonJS's `require` syntax. Except for this, all tests can be written in ES6 syntax.

## Workflow
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