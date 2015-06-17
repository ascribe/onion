# Git Submodule Workflow

**ATTENTION: Adding submodules at the wrong place of the project will actually f&%k up your git if you want to remove them again. So please take all those steps with care!!!**

1. Create a new repository on bitbucket
2. Clone it and create the main file: `my_component.js`
```javascript
    import React from 'react';

    let MyComponent = React.createClass({
        render() {
            return (
                <div></div>
            );
        }
    });

export default MyComponent;
```

3. Commit and push to your newly created repository
4. Open `.gitignore` and add your future package folder to *NOT* to be ignored by git `!node_modules/<my-repository-name>`
5. Copy the repository's SSH link from bitbucket
6. Open a shell and go to `cd onion/node_modules`
7. Do `git submodule add <your-ssh-link>`
8. Git will clone the repository and add it to `node_modules`
9. open `package.json` inside of onion and adjust the `browser` field
```
"browser": {
    "MyComponent": "./node_modules/my_component/my_component.js"
  }
```
10. (Optional) If you have browserify-shims in your newly created module, then add them in the `browserify-shim` as well. Check `package.json` for example.
11. Open `gulpfile.js` and find the `filesToWatch` property of `var config`. Add your newly added `my_component` folder to it: `'node_modules/<my_component>/*.js'`
12. THAT'S IT! YOU'RE AWESOME!
