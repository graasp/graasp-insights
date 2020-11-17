<p align="center">
  <a href="https://graasp.org">
    <img alt="Graasp" src="https://avatars3.githubusercontent.com/u/43075056" width="300" />
  </a>
</p>

<h1 align="center">Graasp Insights</h1>

<p align="center">
  Cross-platform desktop client for processing Graasp datasets.
</p>

<p align="center">
  <a href="https://app.codeship.com/projects/315997">
    <img
      alt="CodeShip"
      src="https://app.codeship.com/projects/9044aa80-c503-0138-36a4-4e33c7c5a318/status?branch=master"
    />
  </a>
  <a href="https://conventionalcommits.org">
    <img
      alt="Conventional Commits"
      src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg"
    />
  </a>
  <a href="https://github.com/prettier/prettier">
    <img
      alt="Prettier"
      src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg"
    />
  </a>
  <a href="https://github.com/graasp/graasp-insights/blob/master/LICENSE">
    <img
      alt="License"
      src="https://img.shields.io/badge/license-AGPLv3.0-blue.svg"
    />
  </a>
</p>

## Official Distributions

You can get the latest official distribution from our [GitHub release channel](https://github.com/graasp/graasp-insights/releases).

## Getting Started

To run Graasp Insights locally you need to have [Node](https://nodejs.org) and
[NPM](https://www.npmjs.com) installed in your operating system. We strongly recommend that you
also have [Yarn](https://yarnpkg.com/). All of the commands that you will see here use `yarn`,
but they have an `npm` equivalent.

Download or clone the repository to your local machine, preferably using [Git](https://git-scm.com).

### Installation

Inside the project directory, run `yarn` to install the project dependencies.

You will also need to create a file called `.env.local` with the following contents.

```dotenv
GH_TOKEN=
BROWSER=none
REACT_APP_GOOGLE_KEY=
```

The `GH_TOKEN` environment variable is only used for releasing new versions of the Graasp Desktop
application. For advanced use, if you want to create your own distribution, you can add your
`GH_TOKEN` here and use `electron-builder` to manage releases on GitHub.

The `BROWSER=none` assignment simply tells Electron not to use a browser to load, but instead to
use the native OS windows.

When you first run or build the application, a file called `env.json` will be created under the
`public/` folder. If you update your `.env.local` and `.env` file with values for the variables
below, the contents of this file will also update the next time you run or build. This process is
handled by `scripts/setup.js`.

```json
{
  "GOOGLE_API_KEY": ""
}
```

### Running Locally

To run Graasp Desktop locally, run `yarn start`. This will launch an Electron window and the
Electron process in terminal.

## Contributing

We welcome contributions!

## Installing Dependencies

Make sure you have `node` and `yarn` installed on your local machine.

Run `yarn` from the project directory root to install all dependencies.

## Committing

We follow the standards put forth by [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/).

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

Example:

```
fix: minor typos in code

see the issue for details on the typos fixed

fixes #12
```

## Logs

Following the `electron-log` defaults, logs are written to the following locations:

- Linux: `~/.config/{app name}/logs/{process type}.log`
- macOS: `~/Library/Logs/{app name}/{process type}.log`
- Windows: `%USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log`
