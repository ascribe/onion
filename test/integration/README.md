# TL;DR
Copy the contents of `.env_template` to `.env` and [fill up the missing keys with
information from your SauceLabs account](#how-to-set-up-your-env-config-file).

```bash
$ npm install
$ npm run tunnel
$ npm test && git commit
```


# TODO
* Use gulp to parallelize mocha invocations with different browsers
* Figure out good system for changing subdomain through test scripts


# Welcome to our test suite, let me be your guide

Dear reader, first of all thanks for taking your time reading this document.
The purpose of this document is to give you an overview on what we want to test
and how we are doing it.


# How it works (bird's-eye view)

You will notice that the setup is a bit convoluted. This section will explain
you why.  Testing single functions in JavaScript is not that hard (if you don't
need to interact with the DOM), and can be easily achieved using frameworks
like [Mocha](https://mochajs.org/). Integration and cross browser testing is,
on the other side, a huge PITA.  Moreover, "browser testing" includes also
"mobile browser testing". On the top of that the same browser (type and
version) can behave in a different way on different operating systems.

To achieve that you can have your own cluster of machines with different
operating systems and browsers or, if you don't want to spend the rest of your
life configuring an average of 100 browsers for each different operating
system, you can pay someone else to do that. Check out [this
article](https://saucelabs.com/selenium/selenium-grid) if you want to know why
using Selenium Grid is better than a DIY approach.

We decided to use [saucelabs](https://saucelabs.com/) cloud (they support [over
700 combinations](https://saucelabs.com/platforms/) of operating systems and
browsers) to run our tests.


## Components and tools

Right now we are just running the test locally, so no Continuous Integration™.

The components involved are:
 - **[Selenium WebDriver](https://www.npmjs.com/package/wd)**: it's a library
   that can control a browser.  You can use the **WebDriver** to load new URLs,
   click around, fill out forms, submit forms etc.  It's basically a way to
   control remotely a browser. The protocol (language agnostic) is called
   [JsonWire](https://code.google.com/p/selenium/wiki/JsonWireProtocol), `wd`
   wraps it and gives you a nice
   [API](https://github.com/admc/wd/blob/master/doc/jsonwire-full-mapping.md)
   you can use in JavaScript. There are other implementations in Python, PHP,
   Java, etc. Also, a **WebDriver** can be initialized with a list of [desired
   capabilities](https://code.google.com/p/selenium/wiki/DesiredCapabilities)
   describing which features (like the platform, browser name and version) you
   want to use to run your tests.

 - **[Selenium Grid](https://github.com/SeleniumHQ/selenium/wiki/Grid2)**: it's
   the controller for the cluster of machines/devices that can run browsers.
   Selenium Grid is able to scale by distributing tests on several machines,
   manage multiple environments from a central point, making it easy to run the
   tests against a vast combination of browsers / OS, minimize the maintenance
   time for the grid by allowing you to implement custom hooks to leverage
   virtual infrastructure for instance.

 - **[Saucelabs](https://saucelabs.com/)**: a private company providing a
   cluster to run your tests on over 700 combinations of browsers/operating
   systems. (They do other things, check out their websites).

 - **[SauceConnect](https://wiki.saucelabs.com/display/DOCS/Setting+Up+Sauce+Connect)**:
   is a Java software by Saucelabs to connect to your `localhost` to test the
   application. There is also a Node.js wrapper
   [sauce-connect-launcher](https://www.npmjs.com/package/sauce-connect-launcher),
   so you can use it programmatically within your code for tests. Please note
   that this module is just a wrapper around the actual software. Running `npm
   install` should install the additional Java software as well.


On the JavaScript side, we use:
 - [Mocha](https://mochajs.org/): a test framework running on Node.js.

 - [chai](http://chaijs.com/): a BDD/TDD assertion library for node that can be
   paired with any javascript testing framework.

 - [chaiAsPromised](https://github.com/domenic/chai-as-promised/): an extension
   for Chai with a fluent language for asserting facts about promises. The
   extension is actually quite cool, we can do assertions on promises without
   writing callbacks but just chaining operators. Check out their `README` on
   GitHub to see an example.

 - [dotenv](https://github.com/motdotla/dotenv): a super nice package to load
   environment variables from `.env` into `process.env`.


## How to set up your `.env` config file
In the root of this repository there is a file called `.env_template`. Create a
copy and call it `.env`. This file will store some values we need to connect to
Saucelabs.

There are two values to be set:
 - `SAUCE_ACCESS_KEY`
 - `SAUCE_USERNAME`

The two keys are the [default
ones](https://github.com/admc/wd#environment-variables-for-saucelabs) used by
many products related to Saucelabs. This allow us to keep the configuration
fairly straightforward and simple.

After logging in to https://saucelabs.com/, you can find your **api key** under
the **My Account**. Copy paste the value in your `.env` file.


## Anatomy of a test

First, you need to learn how [Mocha](https://mochajs.org/) works. Brew a coffee
(or tea, if coffee is not your cup of tea), sit down and read the docs.

Done? Great, let's move on and analyze how a test is written.

From a very high level, the flow of a test is the following:
 1. load a page with a specific URL
 2. do something on the page (click a button, submit a form, etc.)
 3. maybe wait some seconds, or wait if something has changed
 4. check if the new page contains some text you expect to be there

This is not set in stone, so go crazy if you want. But keep in mind that we
have a one page application, there might be some gotchas on how to wait for
stuff to happen. I suggest you to read the section [Wait for
something](https://github.com/admc/wd#waiting-for-something) to understand
better which tools you have to solve this problem.
Again, take a look to the [`wd` implementation of the JsonWire
protocol](https://github.com/admc/wd/blob/master/doc/jsonwire-full-mapping.md)
to know all the methods you can use to control the browser.


Import the libraries we need.

```javascript
'use strict';

require('dotenv').load();

const wd = require('wd');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
```


Set up `chai` to use `chaiAsPromised`.

```javascript
chai.use(chaiAsPromised);
chai.should();
```

`browser` is the main object to interact with Saucelab "real" browsers. We will
use this object a lot. It allows us to load pages, click around, check if a
specific text is present, etc.

```javascript
describe('Login logs users in', function() {
    let browser;
```

Create the driver to control the browser. `before` will be executed once at the
start of the test before any `it` functions. Use `beforeEach` instead if you'd
like to run some code before each `it` function.

```javascript
    before(function() {
        browser = wd.promiseChainRemote('ondemand.saucelabs.com', 80);

        // Start the browser, go to /login, and wait for the react app to render
        return browser
            .init({ browserName, version, platform })
            .get(config.APP_URL + '/login')
            .waitForElementByCss('.ascribe-default-app', asserters.isDisplayed, 10000);
    });
```

Close the browser after finishing all tests. `after` will be executed at the end
of all `it` functions. Use `afterEach` instead if you'd like to run some code
after each `it` function.

```javascript
    after(function() {
        // Destroys the browser session
        return browser.quit();
    });
```

The actual test. We query the `browser` object to get the title of the page.
Note that `.title()` returns a `promise` **but**, since we are using
`chaiAsPromised`, we have some syntactic sugar to handle the promise in line,
without writing new functions.

```javascript
    it('should contain "Log in" in the title', function() {
        return browser.title().should.become('Log in');
    });
});
```

All together:

```javascript
function testSuite(browserName, version, platform) {
    describe(`[${browserName} ${version} ${platform}] Login logs users in`, function() {
        // Set timeout to zero so Mocha won't time out.
        this.timeout(0);
        let browser;

        before(function() {
            // No need to inject `username` or `access_key`, by default the constructor
            // looks up the values in `process.env.SAUCE_USERNAME` and `process.env.SAUCE_ACCESS_KEY`
            browser = wd.promiseChainRemote('ondemand.saucelabs.com', 80);

            // Start the browser, go to /login, and wait for the react app to render
            return browser
                .init({ browserName, version, platform })
                .get(config.APP_URL + '/login')
                .waitForElementByCss('.ascribe-default-app', asserters.isDisplayed, 10000);
        });

        after(function() {
            return browser.quit();
        });

        it('should contain "Log in" in the title', function() {
            return browser.title().should.become('Log in');
        });
    });
}
```

## How to run the test suite
To run the tests, type:
```bash
$ mocha
```

By default the test suite runs on `http://www.localhost.com:3000/`, if you
want to change the URL, change the `APP_URL` env variable.


# How to have fun
Try this!
```bash
$ mocha -R nyan
```
