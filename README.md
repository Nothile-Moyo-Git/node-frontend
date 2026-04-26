# Nothile's full stack Application

## Front End Documentation

**Welcome :)**

This is the front end documentation for the application. You can find more in depth information about the front end here. Please view the rest of the README below on information on the tech stack, and working with the codebase.

Email [Me](mailto:nothile1@gmail.com) if you need a copy of the .env file for local use.

-----

### Tech Stack
The current technology stack for the front end is:

- React. React is used for the front end due to its increased interactivity with the end user, good performance and a strong ecosystem to support it. React also presents all the advantages of function based components.

- Vite. Vite is a build tool to improve the development experience. It improves the build time, faster local server & more access to bundler options which aren't available to CRA. It uses implements ESM for the projects, with ```import``` keyword.
> [Vite](https://vite.dev/)

> [React](https://react.dev)
> [React With TypeScript](https://react.dev/learn/typescript)

**NOTE:** You can install react by using the following script: 
```npm install @types/react @types/react-dom```

- Typescript. We use TypeScript as a transpiler because TypeScript allows us to write less buggy, more readable code. It significantly reduces runtime errors by flagging them up during development.
> [TypeScript](https://www.typescriptlang.org/)

- SCSS. Described further below.
> [SCSS](https://sass-lang.com/)

- React Router. We use this in order to handle our routes in the front end. We also use this to render our views.
> [React Router](https://reactrouter.com/en/main)

- Socket IO. This is used for any dynamic web chats in the near future.
> [Socket IO](https://socket.io/)

-----

### Request handling
The backend uses [multer](https://www.npmjs.com/package/multer) to parse file uploads in the local development environment. These use the type of "file" from the input found on forms.

For most requests, you'll be using GraphQL which will require you to write your query or mutation request on the front end, feel free to look at _"src/App.tsx"_ as an example.

Some features (such as **livechats**) use [Rest](https://www.codecademy.com/article/what-is-rest) because it would cause more dependencies than necessary in order to replicate similar functionality, and assuming that the requests aren't over or under fetching, REST is used where appropriate.

**Note: Use the _"baseUrl"_ property from the application context in order to get the baseUrl for all requests based on environments. This will ensure that you query the correct backend**

------

### Styling
This app uses SCSS with BEM.
> You can visit the SCSS website [here](https://sass-lang.com/)

BEM refers to "block", "element", "modifier". The block refers to the section of code you're doing. This could be a linked list, a custom web component, or a form.

The element refers to an element within the block. You'll notice that these element styles have the _"&__"_ prefix. 

The modifier refers to a style which is applied when you want a different styling "state". This could be an error mode for example, or a success mode which turns inputs green.

You visit the BEM website [here](https://getbem.com/) to find out more.

The _"scss"_ folder contains partials which can be referenced in any other stylesheet.

------

### State management
I use Context in this application due to the reduced complexity of it, if however, this was to be a more scalable app, then Redux, RTK with caching would be my choice.

There is the AppContext which can be found in _"./frontend/src/context/AppContext.tsx"_

The AppContext has a method which will validate whether the user has been authenticated or not, this should be used in pages where authentication is required.

If the user isn't authenticated, then you will be redirected to the login page.

> You can read more about useContext [here](https://react.dev/reference/react/useContext)

**Note: You should use the "useEffect" hook in order to handle this validation.**

------

### Validation
Cors is activated in the backend so we can request our node backend.

We also have a "userId" that we pass through that we retrieve from local storage and send through our requests

This will be queried against the backend and if the request is authenticated, it will be approved.

**Note: Please don't share your userId with anyone, sessions will expire after 2 weeks.**

------

### Routing
The routing for the frontend is handled using _**react-router**_. The Browser router is used for this instead of hash routing as that presents issues when dealing with parameters.

Since the backend uses express, the routing for the frontend is purely for components.

All routes use a basename. This is to make deployment of the front end work alongside other applications which may use a basename. The basename for this application is "typescript-fullstack".

The current "react-router" version is v6.23.1

> You can read more about react-router [here](https://reactrouter.com/en/main)

------

### Uploads
All files are uploaded to the _"./frontend/uploads"_.

The files are arranged by year/month and then the file. They are formatted.

You can find methods to help format files from _"./frontend/util/file.ts"_. This code is shared with the backend.

Images are rendered by requesting them using a try catch block in order to query them. **This is because the server will crash if the image request fails outside of a try catch**.

If the image exists, it is converted and rendered on the page. All image previews in create or edit post are formatted in a 64 bit encode.

------

### Testing
Functional tests for this app are done using Jest. These tests will perform mock requests, and also handle functionality such as form and button submissions.

You can find these tests with the extension *"test.tsx"*.

The current test coverage is **100%** of the entire projects across all different factors. This also includes utility files, mocked requests, mocked modules and accounting for both *devopment* and *production*.

The current coverage for the project is 100%. It's fully tested for all functionality. You can see the coverage report below.

<img width="727" height="133" alt="image" src="https://github.com/user-attachments/assets/0d4b58a5-125b-4000-ae5e-aa2c63a5daef" />

This projects has been fully tested except for a few configuration files. To test all the files. Execute the following command.
```npm run test:logs```

When running a test with explicit logs, you'll want to run a variation of the following command.
```npm run test:logs``` -- ```test-file```

*This will ensure that you get a full coverage report with a summary in your terminal.*

**Note: You'll only receive coverage based on the tests that ran. If you want a full coverage report, run the tests for every file with the command**

**Note: You can find your coverage files in lcov-report/coverage/<files>. Drag the file you're testing into your browser window to see it with styling for a better look at your coverage.**

- Jest
> [Learn about Jest](https://jestjs.io/)

- MSW
> [Learn about MSW](https://mswjs.io/)

------

### WebSockets
Socket.IO is used on the frontend along with the backend. The package being used is _"socket-io.client"_

The front end uses the client API for socket.IO along with React.js as the websocket solution for this project.

You can find out more about how to use the client API [here](https://socket.io/docs/v4/client-api/).

Subscribers are created in the front end for events which can be both emitted or broadcasted depending on the need.

This also applies to the live chat.

**Note: The live chat also keeps a record of messages sent using the backend and Mongoose**

**Note: You cannot reference state values when using sockets with the useEffect hook, but you can set them even with previous state**

------

### Linting

#### ESLint
**This application uses ESLint version 8.57**. ESLint is used as a code formatter which improves the quality of code through rules set in the config file. These rules can affect formatting rules such as _maximum length of files, no unused variables, ensure imports are handled properly_ and more.

This linter is made for TypeScript and React. 

-ESLint
>[Learn about eslint](https://eslint.org/)

_If you wish to install eslint on your machine without a specific version you wish to use, copy the following command and pick your options_

```
npm init @eslint/config@latest
```

You can find the config file in _"frontend/eslint.config.mjs"_. You have the configs which are the recommended for the dependencies, and the rules which come below. The React version is automatically detected for you. You can override rules by adding them to the rules object. You can find a reference for eslint rules [here](https://eslint.org/docs/latest/rules/)

ESLint comes with a few depencendies in order for it to work with our React codebase.

> eslint-config-prettier

> eslint-plugin-prettier

> eslint-plugin-react

#### Prettier
**This application uses Prettier version 3.4.2**. Prettier is a code formatter which often works alongside ESLint in order to improve the readability of code.

_Prettier and ESLint share the same config file_, so if you wish to edit your prettier options, go to _"frontend/eslint.config.mjs"_

**Note: eslint is used with prettier and husky for pre-commit hooks. These check the quality of code and fail the commit if they don't pass the standards**

------

### Deployments 

The production environment for live can be found [Here](https://lively-hotteok-99e04d.netlify.app/).

The devflow is to create a branch from ```develop```. Implement your work, and then create a PR against develop. Email [Me](mailto:nothile1@gmail.com) if you want your work reviewed and merged in

When creating a pull request, you'll find that some pre merge checks will run. You should allow these to conclude and pass before a merge is attempted as they check for initial errors.

Netlify handles CICD for us in this case, so all you need to do is create a PR, merge into master, and then a deployment automatically runs for you.

**Note: Creating manual builds isn't necessary since the CICD process does that for you, but deployments will fail if there are any errors in the console**

------

### Usage of AI

------

### Overall throughts
It was a worthwhile project to build :). I did enjoy it. The entire point of this project
