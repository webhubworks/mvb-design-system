<?php

namespace webhubworks\mvbdesignsystem\console\controllers;

use Craft;
use craft\console\Controller;
use craft\elements\Entry;
use yii\console\ExitCode;

class FixIconsController extends Controller
{
    /**
     * Bereinigt Icon-Strings in allen Sprachen/Sites und speichert die Einträge neu.
     */
    public function actionIndex(): int
    {
        // Alle Site-IDs holen (für Mehrsprachigkeit)
        $siteIds = Craft::$app->getSites()->getAllSiteIds();

        foreach ($siteIds as $siteId) {
            $this->stdout("➡️  Bearbeite Site ID {$siteId}…\n");

            // Einträge für diese Site laden (auch Entwürfe und Archivierte)
            $entriesQuery = Entry::find()
                ->siteId($siteId)
                ->status(null)
                ->batch(100);

            foreach ($entriesQuery as $batch) {
                foreach ($batch as $entry) {
                    // Damit saveElement() auf die richtige Site-Version zugreift:
                    $entry->siteId = $siteId;

                    $dirty = false;

                    foreach ($entry->getFieldValues() as $handle => $value) {
                        if (!is_string($value) || $value === '') {
                            continue;
                        }

                        // 1. Schritt: Entferne alle "fa[blsr] fa-…", case-insensitive und flexibles Whitespace
                        $new = preg_replace('/\bfa[blsr]\s+fa-/i', '', $value);

                        // 2. Schritt: Wenn noch Reste von "fa-…" im String sind, immer das letzte extrahieren
                        if (preg_match_all('/\bfa-([^\s]+)/i', $new, $matches) && !empty($matches[1])) {
                            $new = end($matches[1]);
                        }

                        // Nur setzen, wenn sich der Wert wirklich geändert hat
                        if ($new !== $value) {
                            $entry->setFieldValue($handle, $new);
                            $dirty = true;
                        }
                    }

                    if ($dirty) {
                        if (!Craft::$app->elements->saveElement($entry)) {
                            $this->stderr("❌ Fehler beim Speichern Eintrag #{$entry->id} (Site {$siteId})\n");
                        } else {
                            $this->stdout("✅ Eintrag #{$entry->id} bereinigt (Site {$siteId})\n");
                        }
                    }
                }
            }
        }

        return ExitCode::OK;
    }
}