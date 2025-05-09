/** @type { import('@storybook/server').Preview } */

const url = new URL('/storybook-api/components', process.env.STORYBOOK_URL);

const preview = {
    tags: ['autodocs'],
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
