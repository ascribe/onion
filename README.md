Introduction
============

Onion is the web client for Ascribe. The idea is to have a well documented,
easy to test, easy to hack, JavaScript application.

The code is JavaScript ECMA 6.


Getting started
===============
Install some nice extensions for Chrom(e|ium):
- [Allow-Control-Allow-Origin](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi):
  we need this to open connection to external hosts ([staging.ascribe.io](http://staging.ascribe.io/) in our case)
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
  
```bash
git clone git@bitbucket.org:ascribe/onion.git
cd onion
npm install
gulp serve
```



Code Conventions
================
For this project, we're using:

* 4 Spaces
* We use ES6
* We don't use ES6's class declaration for React components because it does not support Mixins as well as Autobinding ([Blog post about it](http://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#autobinding))
* We don't use camel case for file naming but in everything Javascript related
* We use `let` instead of `var`: [SA Post](http://stackoverflow.com/questions/762011/javascript-let-keyword-vs-var-keyword) 


Troubleshooting
===============

Q: OMG nothing works
A: try `npm install`. Someone may have updated some dependencies


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
