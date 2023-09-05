# Launch the development environment

To launch the development environment you must have 

- npm
- Node.js >= 18.x

Install packages
```
npm install
```

```
npm run dev
```

If you want to specify a particular port you can use the following command:
```
npx vite run --port=MY_PORT
```

If you ever need to modify the api endpoint, you can do so by modifing the `src/env.json` file:
```json
{
    "api": "https://api-staging.duckpass.ch"
}
```

# How to run tests

Packages must be installed: `npm install`

Run tests with `jest`:
```
npm run test
```

# How to build
Packages must be installed: `npm install`

```
npm run build
```

The files will be then stored in the `dist/` directory.

# How to Contribute

Please refer to the `CONTRIBUTING.md` file.