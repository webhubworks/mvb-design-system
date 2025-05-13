import * as path from "node:path";

/** @type { import('@storybook/server-webpack5').StorybookConfig } */
const config = {
    stories: [
        "../components/**/*.stories.@(json|yaml|yml)"
    ],
    addons: [
        "@storybook/addon-webpack5-compiler-swc",
        "@storybook/addon-essentials",
        "@storybook/addon-a11y"
    ],
    previewHead: (head) => {
        return head + `
            <style>
                [data-component="molecules.card"],
                [data-component="molecules.event-list"] {
                    max-width: 350px;
                }
            </style>
        `;
    },
    framework: {
        "name": "@storybook/server-webpack5",
        "options": {}
    },
    webpackFinal: async (config, {configType}) => {
        // Ensure the directory you want to watch is not ignored
        config.watchOptions = {
            ignored: /node_modules/,
            poll: 1000,
        };

        config.module.rules.push({
            test: /\.twig$/,
            include: path.resolve(__dirname, '../components'),
            use: 'raw-loader' // Treat twig files as raw text (basic option)
        });

        return config;
    },
};
export default config;
