<?php

namespace webhubworks\mvbdesignsystem\console\controllers;

use Craft;
use craft\console\Controller;
use yii\console\ExitCode;
use Solspace\Freeform\Freeform;

class FixFreeformTemplateController extends Controller
{
    /**
     * Setzt das Formatting Template aller Freeform-Formulare auf "mvb-design-system/index.twig"
     */
    public function actionIndex(): int
    {
        $templatePath = 'mvb-design-system/index.twig';
        $formService = Freeform::getInstance()->forms;
        $forms = $formService->getAllForms();

        if (empty($forms)) {
            $this->stdout("⚠️  Keine Freeform-Formulare gefunden.\n");
            return ExitCode::OK;
        }

        $this->stdout("🔧 Setze Template '{$templatePath}' für alle Freeform-Formulare:\n");

        foreach ($forms as $form) {
            // Nur ändern, wenn nötig
            if ($form->getFormattingTemplate() === $templatePath) {
                $this->stdout("• {$form->getName()} ({$form->getHandle()}): bereits korrekt.\n");
                continue;
            }

            $form->setFormattingTemplate($templatePath);

            if (Freeform::getInstance()->forms->save($form)) {
                $this->stdout("✔ {$form->getName()} ({$form->getHandle()}) aktualisiert.\n");
            } else {
                $this->stderr("✘ Fehler bei {$form->getName()} ({$form->getHandle()}):\n");
                foreach ($form->getErrors() as $field => $messages) {
                    $this->stderr("  - {$field}: " . implode(', ', $messages) . "\n");
                }
            }
        }

        $this->stdout("✅ Fertig.\n");
        return ExitCode::OK;
    }
}