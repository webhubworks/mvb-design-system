<?php

namespace modules\mvbdesignsystem;

class Installer
{
    public static function copyViteConfigStub(): void
    {
        $viteConfigStub = __DIR__ . '/config/vite.php';
        $viteConfigTargetLocation = __DIR__ . '/../../config/vite.php';

        if (file_exists($viteConfigTargetLocation)) {
            echo PHP_EOL;
            echo 'Config file in ' . $viteConfigTargetLocation . ' already exists, skipping copy. Please review and update it manually.' . PHP_EOL;
            echo PHP_EOL;
        } else {
            copy($viteConfigStub, $viteConfigTargetLocation);
        }
    }

    public static function checkDependencies(): void
    {
        if (! class_exists('\Craft')) {
            echo 'Craft CMS is not installed. Please install Craft CMS first.' . PHP_EOL;
            return;
        }
        if (! \Craft::$app->plugins->isPluginInstalled('vite')) {
            echo 'Craft Vite is not installed. Please install Craft Vite first.' . PHP_EOL;
        }
    }
}
