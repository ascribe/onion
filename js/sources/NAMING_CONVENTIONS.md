# Naming conventions for sources

## Introduction

When using alt.js's sources, we don't want the source's method to clash with the store/action's method names.

While actions will still be named by the following schema:

```
<verb><ObjectToManipulateInTheStore>
```

e.g.

```
fetchCurrentUser
logoutCurrentUser
fetchApplication
refreshApplicationToken
```

we cannot repeat this for a sources' methods as patterns like this would emerge in the stores:

```javascript
onFetchCurrentUser(invalidateCache) {
    this.invalidateCache = invalidateCache;

    if(!this.getInstance().isLoading()) {
        this.getInstance().fetchCurrentUser(); // does not call a flux "action" but a method in user_source.js - which is confusing
    }
}
```

Therefore we're introducing the following naming convention:

## Rules

1. All source methods that perform a data lookup of any kind (be it cached or not), are called `lookup<ObjectToManipulateInTheStore>`. As a mnemonic aid, "You *lookup* something in a *source*".
2. For all methods that do not fit 1.), we prepend `perform`.

## Examples

### Examples for Rule 1.)
*HTTP GET'ing the current User*

```javascript
UserActions.fetchCurrentUser
UserStore.onFetchCurrentUser
UserSource.lookupCurrentUser
```

### Examples for Rule 2.)
*HTTP GET'ing a certain user endpoint, that logs the user out :sad_face:(, as this should not be a GET request anyway)*

```javascript
UserActions.logoutCurrentUser
UserStore.onLogoutCurrentUser
UserSource.performLogoutCurrentUser
```