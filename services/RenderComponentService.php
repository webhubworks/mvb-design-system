<?php

namespace modules\mvbdesignsystem\services;

use Craft;
use modules\mvbdesignsystem\MvbDesignSystem;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;
use yii\base\Component;
use yii\base\Exception;
use function Arrayy\array_last;


class RenderComponentService extends Component
{
    /**
     * @throws SyntaxError
     * @throws Exception
     * @throws RuntimeError
     * @throws LoaderError
     */
    public function render(string $component, array $params = []): string
    {
        $component = trim($component);
        $component = preg_replace('/.twig$/', '', $component);
        $component = trim($component, '/');
        $this->ensureOnlyValidChars($component);

        $templatePath = $this->resolveTemplatePath($component);

        try {
            if (! Craft::$app->view->doesTemplateExist($templatePath)) {
                throw new \InvalidArgumentException('Template not found: ' . $templatePath);
            }
            return Craft::$app->view->renderTemplate($templatePath, $params);
        } catch (LoaderError $e) {
            throw $e;
            // ToDo
        } catch (RuntimeError $e) {
            throw $e;
            // ToDo
        } catch (SyntaxError $e) {
            throw $e;
            // ToDo
        } catch (Exception $e) {
            throw $e;
            // ToDo
        }
    }

    private function ensureOnlyValidChars(string $path): void
    {
        if (preg_match('/[\/\x00]/', $path)) {
            throw new \InvalidArgumentException('Invalid path name: ' . $path);
        }
    }

    /**
     * The path resolver supports dot separated paths, e.g. `atoms.button`
     * and expects to find the component named `button.twig` in the `atoms/button` directory.
     */
    private function resolveTemplatePath(string $component): string
    {
        $segments = explode('.', $component);
        $segments[] = array_last($segments);

        return MvbDesignSystem::COMPONENTS_PATH . '/' . implode('/', $segments);
    }
}
