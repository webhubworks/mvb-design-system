<?php

namespace webhubworks\mvbdesignsystem\console\controllers;

use Craft;
use Symfony\Component\Process\Process;
use yii\console\ExitCode;

trait RunsNode
{
    private function checkNodeVersion(): int
    {
        $this->stdout("📣 Comparing installed Node.js version to .nvmrc...\n");

        $nvmrcPath = Craft::getAlias('@webhubworks/mvbdesignsystem/.nvmrc');

        if (! file_exists($nvmrcPath)) {
            $this->stderr("Error: .nvmrc file not found at $nvmrcPath\n", 'error');
            return ExitCode::UNSPECIFIED_ERROR;
        }

        $nvmrcNodeVersion = trim(file_get_contents($nvmrcPath));

        if (empty($nvmrcNodeVersion)) {
            $this->stderr("Error: .nvmrc file is empty\n", 'error');
            return ExitCode::UNSPECIFIED_ERROR;
        }

        $getNodeVersion = new Process(['node', '--version']);
        $getNodeVersion->setTimeout(180);
        $getNodeVersion->run(function($type, $buffer) use (&$installedNodeVersion): void {
            $installedNodeVersion = trim($buffer);
        });

        if (! $getNodeVersion->isSuccessful()) {
            $this->stderr("Error: Could not get installed Node.js version. Is Node.js installed?\n" . $getNodeVersion->getErrorOutput(), 'error');
            return ExitCode::UNSPECIFIED_ERROR;
        }

        if ($installedNodeVersion !== $nvmrcNodeVersion) {
            $this->stderr("Error: Installed Node.js version ($installedNodeVersion) does not match .nvmrc ($nvmrcNodeVersion)\n", 'error');
            return ExitCode::UNSPECIFIED_ERROR;
        }

        /*
        $checkNvm = new Process(['bash', '-c', 'source ~/.nvm/nvm.sh && command -v nvm']);
        $checkNvm->setTimeout(180);
        $checkNvm->run(function ($type, $buffer): void {
            $this->stdout($buffer);
        });

        if (! $checkNvm->isSuccessful()) {
            $this->stderr("Error: nvm is not installed. Please install nvm first.\n", 'error');
            return ExitCode::UNSPECIFIED_ERROR;
        }

        $installNode = new Process(['bash', '-c', "source ~/.nvm/nvm.sh && nvm install $nvmrcNodeVersion"]);
        $installNode->setTimeout(180);
        $installNode->run(function ($type, $buffer): void {
            $this->stdout($buffer);
        });

        if (! $installNode->isSuccessful()) {
            $this->stderr("Error installing Node version $nvmrcNodeVersion:\n" . $installNode->getErrorOutput(), 'error');
            return ExitCode::UNSPECIFIED_ERROR;
        }
        */

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
