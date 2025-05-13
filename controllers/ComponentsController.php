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

            if (! Vite::getInstance()->vite->devServerRunning()) { // ToDo: Not working??
                ray(Vite::getInstance()->vite->script('app.js'));
                return implode([
                    '<style>',
//                    Vite::getInstance()->vite->fetch(Vite::getInstance()->vite->asset('app.css')),
                    '</style>',
                    Vite::getInstance()->vite->script('app.js'),
                    MvbDesignSystem::getInstance()->renderComponent->render($componentId, $queryParams)
                ]);
            }

            if (Vite::getInstance()->vite->devServerRunning()) {
                return implode([
                    Vite::getInstance()->vite->script('app.js'),
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
