# Refactor TODO

*This should be a living document. So if you have any ideas for refactoring stuff, then feel free to add them to this document*

- Make all standalone components independent from things like global utilities (GeneralUtils is maybe used in table for example)
- Extract all standalone components to their own folder structure and write application independent tests (+ figure out how to do that in a productive way) (fetch lib especially)
- Check for mobile compatibility: Is site responsive anywhere?
queryParams of the piece_list_store should all be reflected in the url and not a single component each should manipulate the URL bar (refactor pagination, use actions and state)
- Refactor string-templating for api_urls
- Use classNames plugin instead of if-conditional-classes
- Instead of using `currentUser && currentUser.email` in an validation that checks whether we user is logged in or now, in the `UserStore` on login we set a boolean property called `isLoggedIn` that can then be used instead of `email`
- Refactor AclProxy to be a generic hide/show element component. Have it take data input and a validation function to assess whether it should show or hide child elements. Move current Acl checks to another place, eg. acl_utils.js.
- Convert all fetchers to [alt.js's sources](http://alt.js.org/docs/async/)

# Refactor DONE
- Refactor forms to generic-declarative form component ✓
- Get rid of all Mixins (inject head is fine) ✓
- Check if all polyfills are appropriately initialized and available: Compare to this ✓

## React-S3-Fineuploader
- implementation should enable to define all important methods outside
- and: maybe create a utility class for all methods to avoid code duplication
- filesToUpload CRUD methods are dirty
