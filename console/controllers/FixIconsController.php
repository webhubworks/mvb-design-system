<?php

namespace webhubworks\mvbdesignsystem\console\controllers;

use Craft;
use craft\errors\UnsupportedSiteException;
use craft\console\Controller;
use craft\elements\Entry;
use craft\helpers\ElementHelper;
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
            Craft::$app->sites->setCurrentSite($siteId);
            // Einträge für diese Site laden (auch Entwürfe und Archivierte)
            $entriesQuery = Entry::find()
                ->siteId($siteId)
                ->status(null)
                ->batch(100);

            foreach ($entriesQuery as $batch) {
                foreach ($batch as $entry) {
                    // Damit saveElement() auf die richtige Site-Version zugreift:
                    //$entry->siteId = $siteId;
                    /* @param Entry $entry */

                    /*     if (!in_array($siteId,ElementHelper::supportedSitesForElement($entry))) {
                             $this->stderr("❌ Eintrag #{$entry->id} ist nicht für Site {$siteId} verfügbar. ".$entry->getCpEditUrl()." \n");
                             continue;
                         }*/

                    $dirty = false;

                    // MINIMALE ÄNDERUNG:
                    // Statt getFieldValues() (würde alle Felder normalisieren inkl. TableMaker)
                    // iterieren wir über die Custom-Felder und lassen TableMaker-Felder aus.
                    $fields = $entry->getFieldLayout() ? $entry->getFieldLayout()->getCustomFields() : [];

                    foreach ($fields as $field) {
                        $handle = $field->handle;

                        // TableMaker-Felder explizit ignorieren (keine Normalisierung dafür!)
                        $isTableMaker = class_exists(\verbb\tablemaker\fields\TableMakerField::class)
                            && ($field instanceof \verbb\tablemaker\fields\TableMakerField);
                        if ($isTableMaker) {
                            continue;
                        }

                        // Für alle anderen Felder erlauben wir Normalisierung wie bisher – aber nur feldweise
                        $value = $entry->getFieldValue($handle);

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
                        try {
                            if (!Craft::$app->elements->saveElement($entry)) {
                                $this->stderr("❌ Fehler beim Speichern Eintrag #{$entry->id} (Site {$siteId})\n");
                            } else {
                                $this->stdout("✅ Eintrag #{$entry->id} bereinigt (Site {$siteId})\n");
                            }
                        } catch (UnsupportedSiteException $e) {
                            // 🥳
                        }

                    }
                }
            }
        }

        return ExitCode::OK;
    }
}