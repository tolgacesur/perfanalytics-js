## Perfanalytics Js

[![CircleCI](https://circleci.com/gh/tolgacesur/perfanalytics-js/tree/master.svg?style=shield&circle-token=cd068c8a9e6f1b5093de193726ef3b4eb1d4a0cb)](https://circleci.com/gh/tolgacesur/perfanalytics-js/tree/master) [![npm](https://img.shields.io/npm/v/perfanalytics.js.svg)](https://www.npmjs.com/package/perfanalytics.js)

This is a client-side library, which collects some performance related key metrics from browser and sends to the PerfAnalytics.API.

### Usage

```html
<!-- Import client side script -->
<script src="path/to/perfanalytics.min.js"></script>

<!-- Initialize -->
<script>
    Perfanalytics({token : 'XXXXXX'});
</script>
```

### About

>It operates **token-based** to provide validation in the production environment in the future and to facilitate the addition of library configuration features.

- Bundle size of library is **2,7 kB (2.671 bytes)**
- This library measure timing of TTFB, FCP, Dom Load, Window Load events and Network resources
- Written using **ES6**
- Used **webpack** and **babel**
- Sends performance metrics to API with related `token` and `url`


### Development

Check the `.env.dev` file before development and make sure that the `API_BASE_URL` variable is set correctly. If it's ok, you can run the following commands.

```shell
npm install

npm run dev
```

### Deployment


We use **CircleCI** for the CI/CD pipeline. The bundle created by running the following command is pushed to the NPM repository. Necessary configurations were made in `.circleci/config.yml` file.

##### Build


```shell
npm run build
```