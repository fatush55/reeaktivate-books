# Reeaktivate Books

This is a web application built with React, MobX, TypeScript, and Vite. Below you will find instructions on how to set up the environment, run the app, run tests, and understand the repository rules.

## 🛠 Environment Setup (Node.js & NVM)

This project requires Node.js version `22.22.1`. It is highly recommended to use NVM (Node Version Manager) to manage your Node versions.

### 1. Install NVM

You can install NVM using either cURL or Git.

**Using cURL:**

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.35.3/install.sh | bash
```

**Using Git:**

1. Clone the repo into your user profile: `git clone https://github.com/nvm-sh/nvm.git ~/.nvm`.
2. Navigate to the directory and check out the correct version: `cd ~/.nvm && git checkout v0.39.5`.
3. Activate NVM: `. ./nvm.sh`.
4. Add these lines to your `~/.bashrc`, `~/.profile`, or `~/.zshrc` file to load it automatically:
   ```sh
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
   [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
   ```

### 2. Install Node.js & Yarn

Once NVM is installed, install the required Node.js version and Yarn:

```bash
nvm install v22.22.1
nvm use v22.22.1
npm install --global yarn
```

Then, install the project dependencies:

```bash
yarn install
```

## 🐶 Husky & Pre-commit Hooks

Husky is configured to run checks before every commit.
It initializes automatically after running `yarn install` via the `"prepare": "husky"` script in `package.json`. On every commit, `lint-staged` will automatically run ESLint and Prettier to format and check all staged files (`*.ts, *.tsx, *.css, *.json, *.md`).

## 🚀 Running the App

### Development Mode

To start the local development server with Hot Module Replacement (HMR):

```bash
yarn dev
```

This uses Vite under the hood.

### Production Build

To compile TypeScript and build the project for production, then preview it locally:

```bash
yarn build
yarn preview
```

All these scripts are pre-configured in `package.json`.

## 🧪 Testing & Coverage

The testing philosophy for this project is **strictly focused on business logic**. All UI components (`.tsx` and `.jsx` files) are explicitly excluded from the test environment and coverage reports. We only test MobX stores, controllers, utilities, and integrations.

### Coverage Thresholds

Vitest is configured to require strict coverage of at least **90%** for lines, functions, branches, and statements.

### Test Commands

- `yarn test` — Runs all tests once.
- `yarn test:watch` — Runs tests in watch mode.
- `yarn test:coverage` — Runs tests and generates a v8 coverage report.

### How to Write Tests

1. Test files must have the `.spec.ts` extension and should be located close to their modules.
2. We use Mock Service Worker (MSW) to mock HTTP requests. The `testSetup.ts` file globally configures the MSW server to throw an error (`onUnhandledRequest: "error"`) if an unhandled API request occurs during a test.
3. The server resets all handlers (`server.resetHandlers()`) after each test case (`afterEach`) to ensure test isolation.
4. The `crypto.randomUUID` method is globally stubbed in the setup file for predictable test execution.
5. When testing asynchronous controller logic, mock the API gateway directly or use artificial Promises to verify intermediate states (e.g., `isSubmitting`).

## 📝 Commit Conventions (Commitlint)

This project enforces strict commit message formatting using `@commitlint/config-conventional`.

Husky will reject your commit if it does not match the following rules:

- **Scope:** Must be in **UPPER-CASE** and cannot be empty (`scope-empty: never`, `scope-case: always, upper-case`).
- **Subject:** Cannot be empty, must be at least 5 characters, and no more than 100 characters long.

**Valid Example:**

```bash
git commit -m "feat(BOOK_STORE): implement private books calculation"
```

_(Here `feat` is the type, `BOOK_STORE` is the uppercase scope, and the rest is the subject)._

## ⚙️ Continuous Integration (CI)

We use GitHub Actions (`ci.yml`) to ensure code quality on every push and pull request to the `main` and `master` branches.

The CI pipeline runs on `ubuntu-latest` with Node.js `22.22.1` and executes three separate jobs:

1. **Lint:** Runs `yarn lint:ci` (ESLint). It will fail the pipeline if there are any warnings (`--max-warnings 0`).
2. **Test:** Runs `yarn test:coverage`. The pipeline will fail if the test coverage drops below 90%.
3. **Build:** Runs `yarn build` to run the TypeScript compiler and Vite build, ensuring there are no type errors.
