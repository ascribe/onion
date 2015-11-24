# README

Recently, we've been discovering [alt.js's sources](http://alt.js.org/docs/async/). As it allows us to implement caching as well as avoid a lot of unnecessary boilerplate code, we do not want to write any more NEW `fetcher`s.

So if you need to query an endpoint, or if you make active changes to one of the `fetcher`s, please consider refactoring it to a `source`.

Also, please read the `NAMING_CONVENTIONS.md` file in there first.

Thanks