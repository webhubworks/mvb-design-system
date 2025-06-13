<?php

namespace webhubworks\mvbdesignsystem\console\controllers;

use Craft;
use craft\console\Controller;
use Symfony\Component\Process\Process;
use yii\console\ExitCode;

class ViteController extends Controller
{
    use RunsNode;

    public $defaultAction = 'dev';

    public function actionBuild(): int
    {
        if (($exitCode = $this->installNodeVersion()) !== ExitCode::OK) {
            return $exitCode;
        }

        if (($exitCode = $this->installNodeModules()) !== ExitCode::OK) {
            return $exitCode;
        }

        $this->stdout("📣 Running Vite build...\n");
        $viteDev = new Process(['npm', '--prefix', Craft::getAlias('@webhubworks/mvbdesignsystem'), 'run', 'build']);
        $viteDev->setTimeout(180);
        $viteDev->run(function ($type, $buffer): void {
            $this->stdout($buffer);
        });

        if (! $viteDev->isSuccessful()) {
            $this->stderr("Error running Vite build:\n" . $viteDev->getErrorOutput(), 'error');
            return ExitCode::UNSPECIFIED_ERROR;
        }

        return ExitCode::OK;
    }

    public function actionDev(): int
    {
        if (($exitCode = $this->installNodeVersion()) !== ExitCode::OK) {
            return $exitCode;
        }

        if (($exitCode = $this->installNodeModules()) !== ExitCode::OK) {
            return $exitCode;
        }

        $this->stdout("📣 Running Vite dev server...\n");
        $viteDev = new Process(['npm', '--prefix', Craft::getAlias('@webhubworks/mvbdesignsystem'), 'run', 'dev']);
        $viteDev->setTimeout(4 * 3600); // Basically unlimited
        $viteDev->run(function ($type, $buffer): void {
            $this->stdout($buffer);
        });

        if (! $viteDev->isSuccessful()) {
            $this->stderr("Error running Vite dev server:\n" . $viteDev->getErrorOutput(), 'error');
            return ExitCode::UNSPECIFIED_ERROR;
        }

        return ExitCode::OK;
    }

}
