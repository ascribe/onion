# Welcome to our test suite, let me be your guide

Dear reader, first of all thanks for taking your time reading this document.
The purpose of this document is to give you an overview on what we want to test
and how we are doing it.


# How it works (bird's-eye view)

You will notice that the setup is a bit convoluted. This section will explain
you why.  Testing single functions in JavaScript is not that hard (if you don't
need to interact with the DOM), and can be easily achieved using frameworks
like [Mocha](https://mochajs.org/). Integration and cross browser testing is,
on the other side, a huge [PITA](https://saucelabs.com/selenium/selenium-grid).
Moreover, "browser testing" includes also "mobile browser testing". Moreover,
the same browser (type and version) can behave in a different way on different
operating systems.

To achieve that you can have your own cluster of machines with different
operating systems and browsers or, if you don't want to spend the rest of your
life configuring an average of 100 browsers for each different operating
system, you can pay someone else to do that.

We decided to use [saucelabs](https://saucelabs.com/) cloud (they support [over
700 combinations](https://saucelabs.com/platforms/) of operating systems and
browsers) to run our tests.


## Components and tools

Right now we are just running the test locally, so no Continuous Integration™.

The components involved are:
 - **[Selenium WebDriver](https://www.npmjs.com/package/wd)**: it's a library
   that can control a browser.  You can use the **WebDriver** to load new URLs,
   click around, fill out forms, submit forms etc.  It's basically a way to
   control remotely a browser. There are other implementations in Python, PHP,
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
   it allows Saucelabs to connect to your `localhost` to test the app.  (There
   is also a [Node.js wrapper](https://www.npmjs.com/package/sauce-connect), so
   you can use it programmatically within your code for tests).


On the JavaScript side, we use:
 - [Mocha](https://mochajs.org/): a test framework running on Node.js.

 - [chai](http://chaijs.com/): a BDD/TDD assertion library for node that can be
   paired with any javascript testing framework.

 - [chaiAsPromised](https://github.com/domenic/chai-as-promised/): an extension
   for Chai with a fluent language for asserting facts about promises. The
   extension is actually quite cool, we can do assertions on promises without
   writing callbacks but just chaining operators. Check out their `README` on
   GitHub to see an example.

 - [dotenv](https://github.com/motdotla/dotenv): a super nice package to loads
   environment variables from `.env` into `process.env`.


## Anatomy of a test

```javascript
'use strict';

require('dotenv').load();

const wd = require('wd');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();
```


```javascript
describe('Login logs users in', function() {
    let browser;

    before(function() {
        browser = wd.promiseChainRemote('ondemand.saucelabs.com', 80,
                                        process.env.ONION_SAUCELABS_USER || 'ascribe',
                                        process.env.ONION_SAUCELABS_APIKEY || 'b072b4f2-6302-42f6-a25d-47162666ca66');

                                        return browser.init({ browserName: 'chrome' });
    });

    beforeEach(function() {
        return browser.get('http://www.ascribe.ninja/app/login');
    });

    after(function() {
        return browser.quit();
    });

    it('should contain "Log in" in the title', function() {
        return browser.title().should.become('Log in');
    });

});
```
