/** @type { import('@storybook/server').Preview } */

const url = new URL('/storybook-api/components', process.env.STORYBOOK_URL);

const preview = {
    tags: ['autodocs'],
    globalTypes: {
      locale: {
          description: 'Locale',
          toolbar: {
              // The label to show for this toolbar item
              title: 'Locale',
              icon: 'globe',
              // Array of plain string values or MenuItem shape (see below)
              items: ['de', 'en', 'fr', 'it', 'ru', 'es', 'pt'],
              // Change title based on selected value
              dynamicTitle: true,
          },
      }
    },
    parameters: {
        server: {
            url: url.toString(),
        },
        backgrounds: {
            values: [
                {name: 'cobblestone-50', value: '#F1F1F1'},
                {name: 'white', value: '#FFF'},
            ],
            default: 'cobblestone-50',
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
