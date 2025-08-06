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
                    if (!is_string($value)) {
                        continue;
                    }

                    // 1. Schritt: Entferne alle "fa[blsr] fa-…"
                    $new = preg_replace('/fa[blsr]\s+fa-/', '', $value);

                    // 2. Schritt: Wenn nichts entfernt wurde, extrahiere das letzte "fa-…"
                    if ($new === $value) {
                        if (preg_match_all('/\bfa-([^\s]+)/', $value, $matches) && !empty($matches[1])) {
                            // Nimm das letzte gefundene fa-…
                            $new = end($matches[1]);
                        }
                    }

                    if ($new !== $value) {
                        $entry->setFieldValue($handle, $new);
                        $dirty = true;
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