# Chameleon Components

Chameleon components is Ebury's vue.js components library.
The library is in its initial phase, more components are added regularly.

You can check the current status of the library [here](https://docs.google.com/spreadsheets/d/101NhAtDJ_6YLybdmWnhTvfem9yCtCeHJK5LtCZcX6Rk/edit#gid=0).

Also, check out the latest version deployed in [Storybook](https://chameleon.ebury.now.sh/).

## Installation

Install @ebury/chameleon-components in your project with npm:

```sh
npm install @ebury/chameleon-components --save
```

## Usage

All of our components are exported by name from @ebury/chameleon-components, so you can import them with:

```js
import { ComponentName } from '@ebury/chameleon-components';
```

## Contributing

For the development of @ebury/chameleon-components, we use storybook [Storybook](https://storybook.js.org/).
If you want to contribute to the library then you must do the following to set up your local environment:

### Storybook

1\. Clone chameleon-components repo

2\. Install all dependencies with:

```sh
npm install
```

3\. Run Storybook with:

```sh
npm start
```

That's it!
By now you should be up and running. You can check the existing components or create new ones.

### CSS

For chameleon components, we use ITCSS with BEM and currently our preprocessor is SASS.
Please don't add any CSS styles without following the rules below.

The single-file Vue components should not use scoped files as is not necessary since we follow BEM!

#### BEM

Is just of methodology on how to name your classes
http://getbem.com/introduction/

```css
/* Block component */
.btn {}

/* Element that depends upon the block */
.btn__price {}

/* Modifier that changes the style of the block */
.btn--orange {}
.btn--big {}
```

#### ITCSS

https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/

Following the ITCSS our CSS structure should look like

1. Settings -
only preprosessor stuff in here! Fonts definitions, color definitions and other vars.

2. Tools -
Only preprosessor stuff in here! Mixins, functions etc.

3. Generic -
No classes, IDs, or elements! CSS resets, box-sizing etc.

4. Elements -
Only pure HTML elements like p, h1, h2, div etc.

5. Objects -
Layouts and grids

6. Components -
Classes for specific UI components, most likely you want to add your classes in here.

7. Utilities -
Extremely specific styles that can override all the above

### Vue app

If you would like to consume and test the behavior of your newly developed components in your local Vue app:

1\. You must create a symlink that will connect the two repos via the npm global folder. On chameleon-components folder run:

```sh
npm link
```

3\. On your Vue app folder run:

```sh
npm link @ebury/chameleon-components
```

4\. All of our components are exported by name so you can import them with:

```js
import { ComponentName } from '@ebury/chameleon-components';
```

### Testing

To run your tests:

```sh
npm run test
```

The test coverage is set to 100%, but if you think the test for a particular piece of code is not necessary, then mark the code with
`/* istanbul ignore */` flags and get prepared to defend it during the PR. This process gives us visibility that every exclusion has
been approved. For more information see the [istanbul docs](https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md)

### Linting

To lint and fix errors in files:

```sh
npm run lint
```

### Build

To build your Storybook:

```sh
npm run build-storybook
```

To build your app (Vue CLI):

```sh
npm run build
```

## References

Vue.js:

[Vue](https://vuejs.org/)

[Vue CLI](https://cli.vuejs.org/)

Storybook:

[Storybook](https://storybook.js.org/)

Jest:

[Jest](https://jestjs.io/)

SCSS:

[SCSS](https://sass-lang.com/documentation/syntax)
