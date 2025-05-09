<?php

namespace modules\mvbdesignsystem\controllers;

use Craft;
use craft\helpers\Template;
use craft\web\Controller;
use modules\mvbdesignsystem\MvbDesignSystem;
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
                    'Origin' => ['https://mvb-online-v3.ddev.site:6006'], // The URL of your Storybook instance
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
            $queryParams = $this->parseQueryParams($this->request->getQueryParams());

            if (! Vite::getInstance()->vite->devServerRunning()) { // Working
                return implode([
                    '<style>',
                    Template::raw(Vite::getInstance()->vite->fetch(Vite::getInstance()->vite->asset('app.css'))),
                    '</style>',
                    '<script>',
                    Template::raw(Vite::getInstance()->vite->fetch(Vite::getInstance()->vite->asset('app.js'))),
                    '</script>',
                    MvbDesignSystem::getInstance()->renderComponent->render($componentId, $queryParams)
                ]);
            }

            if (Vite::getInstance()->vite->devServerRunning()) { // Working
                return implode([
                    Vite::getInstance()->vite->script('app.js'),
                    MvbDesignSystem::getInstance()->renderComponent->render($componentId, $queryParams)
                ]);
            }
        } catch (Exception|LoaderError|SyntaxError|RuntimeError $e) {
            return implode([
                '<h1>Error rendering component: ' . $componentId . '</h1>',
                '<p>' . $e->getMessage() . '</p>'
            ]);
        }
    }

    private function parseQueryParams(array $queryParams): array
    {
        return array_map(function ($value) {
            // Cast booleans
            if ($value === 'true') return true;
            if ($value === 'false') return false;
            if ($value === 'null') return null;
            if ($value === 'undefined') return null;

            if (
                (StringHelper::startsWith($value, '{') && StringHelper::endsWith($value, '}')) ||
                (StringHelper::startsWith($value, '[') && StringHelper::endsWith($value, ']'))
            ) {
                // Try to decode JSON objects
                $json = json_decode($value, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    return $json;
                }
            }

            // Cast numeric values
            if (is_numeric($value)) {
                return $value + 0; // cast to int or float automatically
            }

            // Return as string by default
            return $value;
        }, $queryParams);
    }
}
