<?php

namespace webhubworks\mvbdesignsystem\console\controllers;

use craft\console\Controller;
use craft\helpers\FileHelper;
use yii\base\ErrorException;
use yii\base\Exception;
use yii\console\ExitCode;

class AssetsController extends Controller
{
    public function actionPublish(): int
    {
        $source = \Craft::getAlias('@webhubworks/mvbdesignsystem/assets/');
        $target = \Craft::getAlias('@webroot/mvbdesignsystem/assets/');

        try {
            FileHelper::removeDirectory($target);
        } catch (ErrorException $e) {
            $this->stderr($e->getMessage());
            $this->stderr("\n");
            $this->stderr("❌ Failed to remove the target directory. Make sure you have write permissions.\n", \yii\helpers\Console::FG_RED);
            $this->stderr("Directory: " . $target . "\n");
            return ExitCode::UNSPECIFIED_ERROR;
        }

        try {
            FileHelper::createDirectory($target);
        } catch (Exception $e) {
            $this->stderr($e->getMessage());
            $this->stderr("\n");
            $this->stderr("❌ Failed to create the target directory. Make sure you have write permissions.\n", \yii\helpers\Console::FG_RED);
            $this->stderr("Directory: " . $target . "\n");
            return ExitCode::UNSPECIFIED_ERROR;
        }

        $copiedPaths = [];

        FileHelper::copyDirectory($source, $target, [
            'only' => ['*.svg', '*.png', '*.jpg', '*.jpeg', '*.gif', '*.webp', '*.avif', '*.bmp'],
            'recursive' => true,
            'afterCopy' => function ($from, $to) use (&$copiedPaths) {
                $copiedPaths[] = [$to];
            },
        ]);

        $this->table([
            'Copied',
        ], $copiedPaths);

        $this->stdout("\n");
        $this->stdout("✅ Make sure to ignore the directory that the assets are published to in your .gitignore.\n", \yii\helpers\Console::FG_GREEN);
        $this->stdout("Directory: " . $target . "\n");

        return ExitCode::OK;
    }
}
