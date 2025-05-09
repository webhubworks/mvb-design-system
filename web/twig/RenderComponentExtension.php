<?php

namespace webhubworks\mvbdesignsystem\web\twig;

use craft\helpers\StringHelper;
use Illuminate\Support\Collection;
use InvalidArgumentException;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;
use webhubworks\mvbdesignsystem\MvbDesignSystem;

class RenderComponentExtension extends AbstractExtension
{
    public function getFilters(): array
    {
        return [
            new TwigFilter('collect', function ($var) {
                return Collection::make($var);
            }),
        ];
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('generateUniqueComponentId', function (string $componentName) {
                return $componentName . '-' . StringHelper::UUID();
            }),
            new TwigFunction('attributesToHtml', function (array|Collection $attributes): string {
                $attributes = is_array($attributes) ? Collection::make($attributes) : $attributes;
                return $attributes->map(function ($value, $key) {
                    if (! (is_string($value) || is_scalar($value) || is_null($value))) {
                        throw new InvalidArgumentException("Invalid attribute value for key '$key'. Expected string, scalar, or null.");
                    }
                    return $key . '="' . $value . '"';
                })->join(' ');
            }),
            new TwigFunction('render', function (string $component, array $params = []): string {
                return MvbDesignSystem::getInstance()->renderComponent->render($component, $params);
            }, ['is_safe' => ['html']]),
        ];
    }
}
