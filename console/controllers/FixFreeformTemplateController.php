<?php

namespace webhubworks\mvbdesignsystem\console\controllers;

use Craft;
use craft\console\Controller;
use yii\console\ExitCode;
use Solspace\Freeform\Freeform;
use Solspace\Freeform\Records\Form as FormRecord;

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
            $record = FormRecord::findOne(['id' => $form->id]);

            if ($record) {
                $record->formattingTemplate = $templatePath;

                if ($record->save()) {
                    $this->stdout("✔ {$form->name} ({$form->handle}) aktualisiert.\n");
                } else {
                    $this->stderr("✘ Fehler bei {$form->name} ({$form->handle}):\n");
                    print_r($record->getErrors());
                }
            } else {
                $this->stderr("✘ Kein Record gefunden für Formular-ID {$form->id}.\n");
            }
        }

        $this->stdout("✅ Fertig.\n");
        return ExitCode::OK;
    }
}