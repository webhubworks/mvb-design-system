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
        $entries = Entry::find()
            ->anyStatus()
            ->all();

        foreach ($entries as $entry) {
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
                    echo "Icon-KLassen bereinigt\n";
                }
            }
        }

        return ExitCode::OK;
    }
}