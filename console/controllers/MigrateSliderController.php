<?php
namespace webhubworks\mvbdesignsystem\console\controllers;

use Craft;
use craft\console\Controller;
use craft\elements\Entry;
use craft\elements\db\ElementQueryInterface;
use yii\console\ExitCode;

class MigrateSliderController extends Controller
{
    /**
     * Konsolenkommando zum Migrieren konfigurierter Matrix-Felder zu neuen Nested Entries.
     * Ausführbar via: ./craft migrate-slider/index
     */
    public function actionIndex(): int
    {
        // Konfigurationsdatei laden
        $configFile = Craft::getAlias('@config/fieldMapping.php');
        if (!file_exists($configFile)) {
            $this->stderr("ERROR: Config nicht gefunden unter {$configFile}\n");
            return ExitCode::UNSPECIFIED_ERROR;
        }
        $config = require $configFile;

        foreach (($config['migrations'] ?? []) as $name => $migration) {
            $oldHandle       = $migration['oldFieldHandle']     ?? null;
            $newHandle       = $migration['newFieldHandle']     ?? null;
            $entryTypeHandle = $migration['newEntryTypeHandle'] ?? null;
            $map             = $migration['fields']             ?? [];

            if (!$oldHandle || !$newHandle || !$entryTypeHandle || empty($map)) {
                $this->stderr("WARN: Migration '{$name}' unvollständig konfiguriert\n");
                continue;
            }

            // Batch-Query: lädt 100 Einträge pro Schleife, inkl. Entwürfe/Archive
            $query = Entry::find()
                ->status(null)
                ->field("{$oldHandle}:notempty")
                ->batch(100);

            foreach ($query as $batch) {
                foreach ($batch as $entry) {
                    $newBlocks = [];
                    foreach ($entry->getFieldValue($oldHandle)->all() as $block) {
                        $fields = [];
                        foreach ($map as $target => $source) {
                            $value = $block->getFieldValue($source);
                            if ($value instanceof ElementQueryInterface) {
                                $value = $value->one();
                            }
                            $fields[$target] = $value;
                        }
                        if (!empty(array_filter($fields, fn($v) => $v !== null && $v !== ''))) {
                            $newBlocks[] = [
                                'type'   => $entryTypeHandle,
                                'fields' => $fields,
                            ];
                        }
                    }

                    if ($newBlocks) {
                        $entry->setFieldValue($newHandle, $newBlocks);
                        if (Craft::$app->elements->saveElement($entry)) {
                            $this->stdout("✔️ [{$name}] Entry {$entry->id} migriert\n");
                        } else {
                            $this->stderr("❌ [{$name}] Fehler beim Speichern Entry {$entry->id}\n");
                        }
                    }
                }
            }
        }

        $this->stdout("Alle Migrations abgeschlossen.\n");
        return ExitCode::OK;
    }
}