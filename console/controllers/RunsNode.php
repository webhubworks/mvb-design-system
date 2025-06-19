<?php

namespace webhubworks\mvbdesignsystem\console\controllers;

use Craft;
use Symfony\Component\Process\Process;
use yii\console\ExitCode;

trait RunsNode
{
    private function installNodeVersion(): int
    {
        $this->stdout("📣 Installing Node.js version from .nvmrc...\n");

        $nvmrcPath = Craft::getAlias('@webhubworks/mvbdesignsystem/.nvmrc');

        if (! file_exists($nvmrcPath)) {
            $this->stderr("Error: .nvmrc file not found at $nvmrcPath\n", 'error');
            return ExitCode::UNSPECIFIED_ERROR;
        }

        $nodeVersion = trim(file_get_contents($nvmrcPath));

        if (empty($nodeVersion)) {
            $this->stderr("Error: .nvmrc file is empty\n", 'error');
            return ExitCode::UNSPECIFIED_ERROR;
        }

        $checkNvm = new Process(['bash', '-c', 'source ~/.nvm/nvm.sh && command -v nvm']);
        $checkNvm->setTimeout(180);
        $checkNvm->run(function ($type, $buffer): void {
            $this->stdout($buffer);
        });

        if (! $checkNvm->isSuccessful()) {
            $this->stderr("Error: nvm is not installed. Please install nvm first.\n", 'error');
            return ExitCode::UNSPECIFIED_ERROR;
        }

        $installNode = new Process(['bash', '-c', "source ~/.nvm/nvm.sh && nvm install $nodeVersion"]);
        $installNode->setTimeout(180);
        $installNode->run(function ($type, $buffer): void {
            $this->stdout($buffer);
        });

        if (! $installNode->isSuccessful()) {
            $this->stderr("Error installing Node version $nodeVersion:\n" . $installNode->getErrorOutput(), 'error');
            return ExitCode::UNSPECIFIED_ERROR;
        }

        return ExitCode::OK;
    }

    private function installNodeModules(): int
    {
        $this->stdout("📣 Installing Node modules...\n");

        $npmInstall = new Process(['npm', '--prefix', Craft::getAlias('@webhubworks/mvbdesignsystem'), 'install']);
        $npmInstall->setTimeout(180);
        $npmInstall->run(function ($type, $buffer): void {
            $this->stdout($buffer);
        });

        if (! $npmInstall->isSuccessful()) {
            $this->stderr("Error running npm install:\n" . $npmInstall->getErrorOutput(), 'error');
            return ExitCode::UNSPECIFIED_ERROR;
        }

        return ExitCode::OK;
    }
}
