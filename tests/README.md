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

The components involved are:
 - **[Selenium WebDriver](https://www.npmjs.com/package/wd)**: it's a library
   that can control a browser.  You can use the **WebDriver** to load new URLs,
   click around, fill out forms, submit forms etc.  It's basically a way to
   control remotely a browser. There are other implementations in Python, PHP,
   Java, etc.

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


## Anatomy of a test
A test is a `.js` file. We use [Mocha](https://mochajs.org/) and [Should](https://shouldjs.github.io/).

