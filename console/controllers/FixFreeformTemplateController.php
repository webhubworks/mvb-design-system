<?php
namespace modules\ConsoleTools\Console\Controllers;

use yii\console\Controller;
use Craft;
use Solspace\Freeform\Freeform;
use Solspace\Freeform\Records\Form as FormRecord;

class FixFreeformTemplateController extends Controller
{
    /**
     * Setzt das Formatierungstemplate aller Freeform-Formulare auf "mvb-design-system/index.twig"
     */
    public function actionIndex(): void
    {
        $templatePath = 'mvb-design-system/index.twig';
        $formService = Freeform::getInstance()->forms;
        $forms = $formService->getAllForms();

        if (empty($forms)) {
            echo "⚠️  Keine Freeform-Formulare gefunden.\n";
            return;
        }

        echo "🔧 Setze Template '{$templatePath}' für alle Freeform-Formulare:\n";

        foreach ($forms as $form) {
            $record = FormRecord::findOne(['id' => $form->id]);
            if ($record) {
                $record->formattingTemplate = $templatePath;
                if ($record->save()) {
                    echo "✔ {$form->name} ({$form->handle}) aktualisiert.\n";
                } else {
                    echo "✘ Fehler bei {$form->name} ({$form->handle}):\n";
                    print_r($record->getErrors());
                }
            } else {
                echo "✘ Kein Record gefunden für Formular-ID {$form->id}.\n";
            }
        }

        echo "✅ Fertig.\n";
    }
}