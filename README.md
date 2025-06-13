# MVB Design System

This is a Storybook based design system packaged as a Craft CMS module for integrating with any Craft CMS project. Built on:

- Twig 3
- Vanilla JS
- Tailwind CSS 4
- Vite 5

With this module you can:
- Use the MVB Design System components in your Craft CMS templates.
- Use the provided Vite build script (You don't need to set up a build script yourself).
- Use the provided Storybook for discovering and testing the components.

## Setup

### Install the Craft module
```shell
composer require webhubworks/mvb-design-system
# or
ddev composer require webhubworks/mvb-design-system
```

### Load the module
```php
// config/app.php

'modules' => [
    // other modules...
    'mvbdesignsystem' => [
        'class' => \webhubworks\mvbdesignsystem\MvbDesignSystem::class
    ]
],
// ...
'bootstrap' => ['mvbdesignsystem']
```

### Enable Vite and Freeform
```shell
craft plugin/enable vite
craft plugin/enable freeform
```

### Add the Craft Vite plugin config
Copy the Craft Vite plugin config with this command:
```shell
cp vendor/webhubworks/mvb-design-system/stubs/vite.php ./config/vite.php
```

### Add your theme.css
Copy the default `theme.css` file from the `webhubworks/mvb-design-system` module to the root directory of your Craft CMS project. This file is required to define your primary color and can be used to override the default styles of the design system.

```shell
cp vendor/webhubworks/mvb-design-system/stubs/theme.css ./theme.css
```

### Required env variables
Make sure that your `.env` file contains the following variables:

```dotenv
CRAFT_ENVIRONMENT
PRIMARY_SITE_URL
```

## Usage
### Include the design system in your templates
```twig
{# In the <head> of your layout template #}
{{ craft.vite.script('js/app.js', false) }}
```

### Render your first component
```twig
{{ render('atoms.button', {
    label: 'Click me',
}) }}
```

## Build for production
There are two CLI commands ready to build the project for production:
```shell
# use this to build the assets of the design system and your own tempaltes
craft mvbdesignsystem/vite/build

# use this to build the storybook for static hosting
craft mvbdesignsystem/storybook/build
```

## Develop

### Configure DDEV
The dev servers run within DDEV, so you need to ensure that your DDEV project is set up correctly. Make sure you have the following in your `.ddev/config.yaml`:

```yaml
# ...
web_extra_exposed_ports:
  - name: node-vite
    container_port: 5173
    http_port: 5172
    https_port: 5173
  - name: storybook
    container_port: 6006
    http_port: 6005
    https_port: 6006
# ...
```

### Run dev servers
To develop the design system, you can use the following command, which you typically run at the same time in two terminal windows:
```shell
# use this to start the development server for the design system
craft mvbdesignsystem/vite/dev

# use this to start the storybook for the design system
craft mvbdesignsystem/storybook/dev
```
