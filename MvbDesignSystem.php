<?php

namespace webhubworks\mvbdesignsystem;

use Craft;
use craft\base\Event;
use craft\events\RegisterTemplateRootsEvent;
use craft\events\RegisterUrlRulesEvent;
use craft\i18n\PhpMessageSource;
use craft\web\UrlManager;
use craft\web\View;
use Twig\Extra\Intl\IntlExtension;
use webhubworks\mvbdesignsystem\services\RenderComponentService;
use webhubworks\mvbdesignsystem\web\twig\RenderComponentExtension;
use yii\base\Module as BaseModule;

/**
 * MvbDesignSystem module
 *
 * @method static MvbDesignSystem getInstance()
 * @property-read RenderComponentService $renderComponent
 */
class MvbDesignSystem extends BaseModule
{
    /**
     * Path to the components directory (supports only a single, one level directory)
     */
    const COMPONENTS_PATH = 'components';

    public function init(): void
    {
        Craft::setAlias('@webhubworks/mvbdesignsystem', __DIR__);

        // Set the controllerNamespace based on whether this is a console or web request
        if (Craft::$app->request->isConsoleRequest) {
            $this->controllerNamespace = 'webhubworks\\mvbdesignsystem\\console\\controllers';
        } else {
            $this->controllerNamespace = 'webhubworks\\mvbdesignsystem\\controllers';
        }

        parent::init();

        Craft::$app->i18n->translations['mvbdesignsystem'] = [
            'class' => PhpMessageSource::class,
            'sourceLanguage' => 'en',
            'basePath' => __DIR__ . '/translations',
            'allowOverrides' => true,
        ];

        $this->setComponents([
            'renderComponent' => RenderComponentService::class,
        ]);

        $this->attachEventHandlers();

        Craft::$app->view->registerTwigExtension(new IntlExtension());

        Craft::$app->onInit(function () {

        });

        Craft::$app->view->registerTwigExtension(new RenderComponentExtension());
    }

    private function attachEventHandlers(): void
    {
        Event::on(
            UrlManager::class,
            UrlManager::EVENT_REGISTER_SITE_URL_RULES,
            function (RegisterUrlRulesEvent $event) {
                $event->rules['storybook-api/components/<componentId>'] = 'mvbdesignsystem/components/index';
            }
        );

        Event::on(
            View::class,
            View::EVENT_REGISTER_SITE_TEMPLATE_ROOTS,
            function (RegisterTemplateRootsEvent $event) {
                // ToDo: Does this conflict with the default Craft template roots? templates/components?
                $event->roots[self::COMPONENTS_PATH] = __DIR__ . '/' . self::COMPONENTS_PATH;
            }
        );
    }
}
