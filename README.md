<p align='center'><img src='public/logo.svg' data-canonical-src='public/logo.svg' width='150' height='150' align='center'/></p>

# ICU Message Format Helper for Crowdin

This repository contains source code for the ICU Message Helper App for Crowdin. The Helper assists translators with the translation of strings with an [ICU Message](https://unicode-org.github.io/icu/userguide/format_parse/messages/).

The App is available for installation through the official [Crowdin Marketplace](https://store.crowdin.com/icu-helper).

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
$ git clone https://github.com/Martin005/crowdin-icu-helper.git
$ cd crowdin-icu-helper
$ yarn install
$ yarn start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

Make sure you have [Heroku CLI](https://cli.heroku.com/) installed.

```
$ heroku create
$ git push heroku main
$ heroku open
```

or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
