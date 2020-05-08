# Node POC

### To enable ES6 features add below libraries as devDependencies and add a .babelrc file
  1. babel-cli
  2. babel-preset-env

### To run server without compiling run babel-node with `npx`.
npx package will look for required module deep inside node_modules folder.
  ```
  npx babel-node basic-server.js
  ```