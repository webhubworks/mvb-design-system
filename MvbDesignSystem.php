<?php

namespace modules\mvbdesignsystem;

use Craft;
use craft\base\Event;
use craft\events\RegisterTemplateRootsEvent;
use craft\events\RegisterUrlRulesEvent;
use craft\i18n\PhpMessageSource;
use craft\web\UrlManager;
use craft\web\View;
use modules\mvbdesignsystem\services\AssetService;
use modules\mvbdesignsystem\services\RenderComponentService;
use modules\mvbdesignsystem\web\twig\RenderComponentExtension;
use yii\base\Module as BaseModule;

/**
 * MvbDesignSystem module
 *
 * @method static MvbDesignSystem getInstance()
 * @property-read RenderComponentService $renderComponent
 * @property-read AssetService $assets
 */
class MvbDesignSystem extends BaseModule
{
    /**
     * Path to the components directory (supports only a single, one level directory)
     */
    const COMPONENTS_PATH = 'components';

    public function init(): void
    {
        Craft::setAlias('@modules/mvbdesignsystem', __DIR__);

        // Set the controllerNamespace based on whether this is a console or web request
        if (Craft::$app->request->isConsoleRequest) {
            $this->controllerNamespace = 'modules\\mvbdesignsystem\\console\\controllers';
        } else {
            $this->controllerNamespace = 'modules\\mvbdesignsystem\\controllers';
        }

        Event::on(
            UrlManager::class,
            UrlManager::EVENT_REGISTER_SITE_URL_RULES,
            function (RegisterUrlRulesEvent $event) {
                $event->rules['storybook-api/components/<componentId>'] = 'mvb-design-system/components/index';
            }
        );

        parent::init();

        Craft::$app->i18n->translations['mvbdesignsystem'] = [
            'class' => PhpMessageSource::class,
            'sourceLanguage' => 'en',
            'basePath' => __DIR__ . '/translations',
            'allowOverrides' => true,
        ];

        Event::on(
            View::class,
            View::EVENT_REGISTER_SITE_TEMPLATE_ROOTS,
            function (RegisterTemplateRootsEvent $event) {
                // ToDo: Does this conflict with the default Craft template roots? templates/components?
                $event->roots[self::COMPONENTS_PATH] = __DIR__ . '/' . self::COMPONENTS_PATH;
            }
        );

        $this->setComponents([
            'renderComponent' => RenderComponentService::class,
            'assets' => AssetService::class,
        ]);

        $this->attachEventHandlers();

        // Any code that creates an element query or loads Twig should be deferred until
        // after Craft is fully initialized, to avoid conflicts with other plugins/modules
        Craft::$app->onInit(function () {
            // ...
        });
        Craft::$app->view->registerTwigExtension(new RenderComponentExtension());
    }

    private function attachEventHandlers(): void
    {
        // Register event handlers here ...
        // (see https://craftcms.com/docs/5.x/extend/events.html to get started)
    }
}
