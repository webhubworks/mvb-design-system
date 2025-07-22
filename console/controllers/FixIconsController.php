<?php

namespace webhubworks\mvbdesignsystem\console\controllers;

use Craft;
use craft\console\Controller;
use craft\elements\Entry;

use yii\console\ExitCode;

class FixIconsController extends Controller
{
    public function actionIndex(): int
    {
        $entries = Entry::find()->status(null)->batch(100);
        foreach ($entries as $batch) {
            foreach ($batch as $entry) {
                $dirty = false;

                foreach ($entry->getFieldValues() as $handle => $value) {
                    if (is_string($value)) {
                        $new = preg_replace('/fa[blsr] fa-/', '', $value);
                        if ($new !== $value) {
                            $entry->setFieldValue($handle, $new);
                            $dirty = true;
                        }
                    }
                }

                if ($dirty) {
                    if (!Craft::$app->elements->saveElement($entry)) {
                        echo "Fehler beim Speichern von Eintrag mit der ID: {$entry->id}\n";
                    } else {
                        echo "✅ Bereinigt: Eintrag {$entry->id}\n";
                    }
                }
            }
        }

        return ExitCode::OK;
    }
}