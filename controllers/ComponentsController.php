<?php

namespace webhubworks\mvbdesignsystem\controllers;

use Craft;
use craft\helpers\Template;
use craft\web\Controller;
use webhubworks\mvbdesignsystem\MvbDesignSystem;
use nystudio107\vite\Vite;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;
use yii\base\Exception;
use yii\filters\Cors;
use yii\helpers\StringHelper;
use yii\web\ForbiddenHttpException;

class ComponentsController extends Controller
{
    protected array|bool|int $allowAnonymous = true;

    public function behaviors(): array
    {
        return [
            'corsFilter' => [
                'class' => Cors::class,
                'cors' => [
                    'Origin' => ['*'], // The URL of your Storybook instance
                ],
            ],
        ];
    }

    public function beforeAction($action): bool
    {
        if (Craft::$app->getConfig()->getGeneral()->devMode === false) {
            throw new ForbiddenHttpException();
        }

        return parent::beforeAction($action);
    }

    public function actionIndex(string $componentId): string
    {
        try {
            $queryParams = json_decode($this->request->getQueryParam('params'), true);

            if (isset($queryParams['locale'])) {
                Craft::$app->language = $queryParams['locale'];
            }

            $brandColorStyle = MvbDesignSystem::getInstance()->brandColors->getBrandColorStyleAsRoot($queryParams['brand'] ?? null);

            if (! Vite::getInstance()->vite->devServerRunning()) { // ToDo: Not working??
                return implode([
                    Craft::$app->view->renderString("<style>$brandColorStyle</style>"),
                    Vite::getInstance()->vite->script('js/app.js'),
                    MvbDesignSystem::getInstance()->renderComponent->render($componentId, $queryParams)
                ]);
            }

            if (Vite::getInstance()->vite->devServerRunning()) {
                return implode([
                    Craft::$app->view->renderString("<style>$brandColorStyle</style>"),
                    Vite::getInstance()->vite->script('js/app.js'),
                    MvbDesignSystem::getInstance()->renderComponent->render($componentId, $queryParams)
                ]);
            }
        } catch (Exception|LoaderError|SyntaxError|RuntimeError $e) {
            return implode([
                '<h1>Error rendering component: ' . $componentId . '</h1>',
                '<div style="font-family: monospace">',
                '<p>' . $e->getMessage() . '</p>',
                '<p>' . $e->getFile() . ':' . $e->getLine() . '</p>',
                '</div>',
            ]);
        }
    }
}
