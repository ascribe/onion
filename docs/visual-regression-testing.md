Introduction
============

When in doubt, see [Gemini](https://github.com/gemini-testing/gemini) and [their docs](https://github.com/gemini-testing/gemini/tree/master/doc) for more information as well as configuration options.

Contents
========

  1. [Installation](#installation)
  1. [Running Tests](#running-tests)
  1. [Gemini Usage](#gemini-usage)
  1. [PhantomJS](#phantomjs)


Installation
============

First install [PhantomJS2](https://www.npmjs.com/package/phantomjs2):

```bash
npm install -g phantomjs2

# If using OSX, install upx and decompress the binary downloaded by npm manually:
brew install upx
# Navigate to the binary, ie. /Users/Brett/.nvm/v5.4.0/lib/node_modules/phantomjs2/lib/phantom/bin
upx -d phantomjs

```

Then [install Gemini globally and locally with npm](https://github.com/gemini-testing/gemini/blob/master/README.md#installation).


Running Tests
=============

Run PhantomJS:

```bash
phantomjs --webdriver=4444
```

And then run Gemini tests:

```bash
# In root onion/
gemini test gemini/* --report html
```

If you've made changes and want them to be the new baseline (ie. it's a correct change--**make sure** to test there are no regressions first!), use

```bash
# In root onion/
gemini update gemini/*
```


Gemini Usage
============

While Gemini itself is easy to use on simple, static pages, there are some nice to knows when dealing with a single page app like ours (where much of it is behind an authentication barrier as well).

Authentication
--------------

Authentication presents a tricky problem with Gemini, since we can't inject any cookies or even run a start up script through the browser before letting Gemini hook in. The solution is to script the log in process through Gemini, and put waits for the log in to succeed, before testing parts of the app that require the authentication.

Browser Session States
----------------------

Gemini will start a new instance of the browser for each browser configuration defined in the .gemini.yml file when Gemini's launched (ie. `gemini update`, `gemini test`, etc).

Although each new suite will cause the testing browser to be refreshed, the above means that cookies and other persistent state will be kept across suites for a browser across all runs, even if the suites are from different files.

**What this comes down to is**: once you've logged in, you'll stay logged in until you decide to log out or the running instance of Gemini ends. In general practice, it's a good idea to clear the state of the app at the end of each suite of tests by logging out.

(**Note**: Persistent storage, such as local storage, has not been explicitly tested as to whether they are kept, but as the cookies are cleared each time, this seems unlikely)

Test Reporting
--------------

Using the `--report html` flag with Gemini will produce a webpage with the test's results in /gemini-report that will show the old, new, and diff images. Using this is highly recommended (and fun!).


PhantomJS
=========

[PhantomJS](http://phantomjs.org/) is a headless browser that allows us to run tests and take screenshots without needing a browser.

Its second version (PhantomJS2) uses a much more recent version of Webkit, and is a big reason why Gemini (as opposed to other utilities, ie. PhantomCSS) was chosen. Due to the large number of breaking changes introduced between PhantomJS 1.9 to 2.0, a large number of tools (ie. CasperJS) are, at the time of writing, lacking support for 2.0.

While you don't need to know too much about PhantomJS to use and write Gemini tests, there are still a number of useful things to know about.

Useful features
---------------

You can find the full list of CLI commands in the [documentation](http://phantomjs.org/api/command-line.html).

Flags that are of particular interest to us:
 * `--webdriver=4444`: sets the webdriver port to be 4444, the default webdriver port that Gemini expects.
 * `--ignore-ssl-errors=true`: ignores any SSL errors that may occur. Particular useful when hooking up the tests to staging, as the certificate we use is self-signed.
 * `--ssl-protocol=any`: allows any ssl protocol to be used. May be useful when `--ignore-ssl-errors=true` doesn't work.
 * '--remote-debugger-port`: allows for remote debugging the running PhantomJS instance. More on this later.

Troubleshooting and Debugging
-----------------------------

Remote debugging is possible with PhantomJS using the `--remote-debugger-port` option. See the [troubleshooting docs](http://phantomjs.org/troubleshooting.html).

To begin using it, add `debugger;` statements to the file being run by `phantomjs`, and access the port number specified after `--remote-debugger-port` on localhost:

```bash
phantomjs --remote-debugger-port=9000 debug.js
```

PhantomJS will start and then immediately breakpoint. Go to http://localhost:9000/webkit/inspector/inspector.html?page=1 and then to its console tab. Go to your first breakpoint (the first `debugger;` statement executed) by running `__run()` in the console tab. Subsequent breakpoints can be reached by successively running `__run()` in that same console tab.

At each breakpoint, you can to http://localhost:9000 on a new browser tab and click on one of the links to go to the current execution state of that breakpoint on the page you're on.

---

To simplify triaging simple issues and test if everything is working, I've added a short test script that can be run with PhantomJS to check if it can access the web app and log in. You can edit the `lauch_app_and_login.js` file to change the environment to run against.

```bash
# In root /onion folder
phantomjs phantomjs/launch_app_and_login.js
```
