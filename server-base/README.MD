# Node POC

## Folder and file naming conventions
```
  |--- config
    |--- database.config.js
    |--- server.config.js
  |--- middleware
    |--- auth.middleware.js
  |--- model
    |--- user.model.js
  |--- repository
    |--- user.repo.js
  |--- route
    |--- user.route.js
  |--- service
    |--- user.service.js
  |--- utils
    |--- cookie-utils.js
```
### Running application
  *npm run dev-server*

### To enable ES6 features add below libraries as devDependencies and add a .babelrc file
  1. babel-cli
  2. babel-preset-env

### To run server without compiling run babel-node with `npx`.
npx package will look for required module deep inside node_modules folder.
  ```
  npx babel-node basic-server.js
  ```