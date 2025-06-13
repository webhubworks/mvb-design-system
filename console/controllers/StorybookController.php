<?php

namespace webhubworks\mvbdesignsystem\console\controllers;

use Craft;
use craft\console\Controller;
use craft\helpers\StringHelper;
use Symfony\Component\Process\Process;
use yii\console\ExitCode;

class StorybookController extends Controller
{
    use RunsNode;

    public $defaultAction = 'dev';

    public function actionDev(): int
    {
        if (($exitCode = $this->installNodeVersion()) !== ExitCode::OK) {
            return $exitCode;
        }

        if (($exitCode = $this->installNodeModules()) !== ExitCode::OK) {
            return $exitCode;
        }

        $this->stdout("📣 Running Storybook dev...\n");
        $storybook = new Process(['npm', '--prefix', Craft::getAlias('@webhubworks/mvbdesignsystem'), 'run', 'storybook']);
        $storybook->run(function ($type, $buffer): void {
            if (StringHelper::contains($buffer, '[webpack.Progress]')) {
                return;
            }
            $this->stdout($buffer);
        });

        if (! $storybook->isSuccessful()) {
            $this->stderr("Error running Storybook:\n" . $storybook->getErrorOutput(), 'error');
            return ExitCode::UNSPECIFIED_ERROR;
        }

        return ExitCode::OK;
    }

    public function actionBuild(): int
    {
        if (($exitCode = $this->installNodeVersion()) !== ExitCode::OK) {
            return $exitCode;
        }

        if (($exitCode = $this->installNodeModules()) !== ExitCode::OK) {
            return $exitCode;
        }

        $this->stdout("📣 Running Storybook build...\n");
        $storybook = new Process(['npm', '--prefix', Craft::getAlias('@webhubworks/mvbdesignsystem'), 'run', 'build:storybook']);
        $storybook->run(function ($type, $buffer): void {
            $this->stdout($buffer);
        });

        if (! $storybook->isSuccessful()) {
            $this->stderr("Error running Storybook:\n" . $storybook->getErrorOutput(), 'error');
            return ExitCode::UNSPECIFIED_ERROR;
        }

        return ExitCode::OK;
    }
}
