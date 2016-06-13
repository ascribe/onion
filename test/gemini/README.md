Introduction
============

When in doubt, see [Gemini](https://github.com/gemini-testing/gemini) and [their
docs](https://github.com/gemini-testing/gemini/tree/master/doc) for more information as well as configuration options.

Contents
========

  1. [Installation](#installation)
  1. [Running Tests](#running-tests)
  1. [Gemini Usage and Writing Tests](#gemini-usage-and-writing-tests)
  1. [PhantomJS](#phantomjs)
  1. [TODO](#todo)


Installation
============

First make sure that you're using NodeJS 5.0+ as the tests are written using ES6 syntax.

Then, install [PhantomJS2](https://www.npmjs.com/package/phantomjs2):

```bash
# Until phantomjs2 is updated for the new 2.1 version of PhantomJS, use the following (go to https://bitbucket.org/ariya/phantomjs/downloads to find a build for your OS)
npm install phantomjs2 --phantomjs_downloadurl=https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-macosx.zip

# If using OSX, you may have to install upx and decompress the binary downloaded by npm manually:
brew install upx

# Navigate to the binary, ie. node_modules/phantomjs2/lib/phantom/bin/ (for the local installation)
upx -d phantomjs

# If using Linux or OSX, you may also have to convert the binary using `dos2unix`:
brew install dos2unix
dos2unix phantomjs
```

Finally, [install Gemini locally with npm](https://github.com/gemini-testing/gemini/blob/master/README.md#installation), if it
hasn't already been installed through `package.json`.


Running Tests
=============

Run Spool and Onion (on localhost.com:3000).

Run PhantomJS:

```bash
npm run vi-phantom
```

Gather your initial baseline (on the master branch, for example):

```bash
npm run vi-update
```

And then run Gemini tests (on your current branch with changes, to test for regressions):

```bash
npm run vi-test

# Run only main tests
npm run vi-test:main

# Run only whitelabel tests
npm run vi-test:whitelabel

# Run only specific whitelabel tests
npm run vi-test:cyland
```

Later on, if you've made changes and want them to be the new baseline (ie. it's a correct change--**make sure** to test
there are no regressions first!), use:

```bash
npm run vi-update

# Update just the main app for desktop and mobile
npm run vi-update -- --browser MainDesktop --browser MainMobile
```


Gemini Usage and Writing Tests
==============================

While Gemini itself is easy to use on simple, static pages, there are some nice to knows when dealing with a single page
app like ours (where much of it is behind an authentication barrier as well).

Command Line Interface
----------------------

See [the docs](https://github.com/gemini-testing/gemini/blob/master/doc/commands.md) on the commands that are available.
`npm run vi-*` is set up with some of these commands, but you may want to build your own or learn about some of the
other functions.

Authentication
--------------

Authentication presents a tricky problem with Gemini, since we can't inject any cookies or even run a start up script
through the browser before letting Gemini hook in. The solution is to script the log in process through Gemini, and put
waits for the log in to succeed, before testing parts of the app that require the authentication.

Browser Session States
----------------------

Gemini will start a new instance of the browser for each browser configuration defined in the .gemini.yml file when
Gemini's launched (ie. `gemini update`, `gemini test`, etc).

Although each new suite will cause the testing browser to be refreshed, the above means that cookies and other
persistent state will be kept across suites for a browser across all runs, even if the suites are from different files.

**What this comes down to is**: once you've logged in, you'll stay logged in until you decide to log out or the running
instance of Gemini ends. In general practice, it's a good idea to clear the state of the app at the end of each suite of
tests by logging out.

(**Note**: Persistent storage, such as local storage, has not been explicitly tested as to whether they are kept, but as
the cookies are cleared each time, this seems unlikely)

Test Reporting
--------------

Using the `--reporter html` flag with Gemini will produce a webpage with the test's results in `onion/gemini-report`
that will show the old, new, and diff images. Using this is highly recommended (and fun!) and is used by default in `npm
run vi-test`.

Writing Tests
-------------

See [the docs](https://github.com/gemini-testing/gemini/blob/master/doc/tests.md), and the [section on the available
actions](https://github.com/gemini-testing/gemini/blob/master/doc/tests.md#available-actions) for what scripted actions
are available.

Our tests are located in `onion/test/gemini/tests/`. For now, the tests use the environment defined in
`onion/test/gemini/tests/environment.js` for which user, piece, and edition to run tests against. In the future, it'd be
nice if we had some db scripts that we could use to populate a test db for these regression tests.

**It would also be nice if we kept the whitelabels up to date, so if you add one, please also test (at least) its landing
page.**

Some useful tips:
  * The `find()` method in the callbacks is equivalent to `document.querySelector`; it will only return the first
    element found that matches the selector. Use pseudo classes like `nth-of-type()`, `nth-child()`, and etc. to select
    later elements.
  * Nested suites inherit from their parent suites' configurations, but will **override** their inherited configuration
    if another is specified. For example, if `parentSuite` had a `.before()` method, all children of `parentSuite` would
    run its `.before()`, but if any of the children specified their own `.before()`, those children would **not** run
    `parentSuite`'s `.before()`.
  * Gemini takes a screenshot of the minimum bounding rect for all specified selectors, so this means you can't take a
    screenshot of two items far away from each other without the rest being considered (ie. trying to get the header and
    footer)
  * Unfortunately, `setCaptureElements` and `ignoreElements` will only apply for the first element found matching those
    selectors.

PhantomJS
=========

[PhantomJS](http://phantomjs.org/) is a headless browser that allows us to run tests and take screenshots without
needing a browser.

Its second version (PhantomJS2) uses a much more recent version of Webkit, and is a big reason why Gemini (as opposed to
other utilities, ie. PhantomCSS) was chosen. Due to the large number of breaking changes introduced between PhantomJS
1.9 to 2.0, a large number of tools (ie. CasperJS) are, at the time of writing, lacking support for 2.0.

While you don't need to know too much about PhantomJS to use and write Gemini tests, there are still a number of useful
things to know about.

Useful features
---------------

You can find the full list of CLI commands in the [documentation](http://phantomjs.org/api/command-line.html).

Flags that are of particular interest to us:
 * `--webdriver=4444`: sets the webdriver port to be 4444, the default webdriver port that Gemini expects.
 * `--ignore-ssl-errors=true`: ignores any SSL errors that may occur. Particular useful when hooking up the tests to
   staging, as the certificate we use is self-signed.
 * `--ssl-protocol=any`: allows any ssl protocol to be used. May be useful when `--ignore-ssl-errors=true` doesn't work.
 * '--remote-debugger-port`: allows for remote debugging the running PhantomJS instance. More on this later.

Troubleshooting and Debugging
-----------------------------

Remote debugging is possible with PhantomJS using the `--remote-debugger-port` option. See the [troubleshooting
docs](http://phantomjs.org/troubleshooting.html).

To begin using it, add `debugger;` statements to the file being run by `phantomjs`, and access the port number specified
after `--remote-debugger-port` on localhost:

```bash
phantomjs --remote-debugger-port=9000 debug.js
```

PhantomJS will start and then immediately breakpoint. Go to http://localhost:9000/webkit/inspector/inspector.html?page=1
and then to its console tab. Go to your first breakpoint (the first `debugger;` statement executed) by running `__run()`
in the console tab. Subsequent breakpoints can be reached by successively running `__run()` in that same console tab.

At each breakpoint, you can to http://localhost:9000 on a new browser tab and click on one of the links to go to the
current execution state of that breakpoint on the page you're on.

---

To simplify triaging simple issues and test if everything is working, The repo had a short test script that can be run
with PhantomJS to check if it can access the web app and log in. Find `onion/test/phantomjs/launch_app_and_login.js` in
the repo's history, restore it, and then run:

```bash
# In root /onion folder
phantomjs test/phantomjs/launch_app_and_login.js
```


TODO
====

* Write scripts to automate creation of test users (and modify tests to accomodate)
* Set scripts with rootUrls pointing to staging / live using environment variables
* Set up with Sauce Labs
