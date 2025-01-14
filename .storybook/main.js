module.exports = {
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
    enableCrashReports: false,
  },
  staticDirs: ['../public', '../src/assets', {
    from: '../node_modules/svg-country-flags/png100px/',
    to: '/icons/country-flags/100',
  }],
  stories: ['../src/**/*.story.mdx', '../src/**/*.story.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-cssresources', '@storybook/addon-essentials', '@storybook/addon-links', '@storybook/addon-styling'],
  docs: {
    // Docs tab was changed for a docs page in the sidebar, to
    // create this new page we need the following property enabled
    // (this apply to all stories)
    autodocs: true,
  },
};
