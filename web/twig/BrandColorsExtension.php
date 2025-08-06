<?php

namespace webhubworks\mvbdesignsystem\web\twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;
use webhubworks\mvbdesignsystem\MvbDesignSystem;

class BrandColorsExtension extends AbstractExtension
{
    public function getFunctions(): array
    {
        return [
            new TwigFunction('getBrandColorStyle', function (?string $brandName = null, string $default = 'mvb'): string {
                return MvbDesignSystem::getInstance()->brandColors->getBrandColorStyleAsRoot($brandName, $default);
            }, ['is_safe' => ['html']]),
        ];
    }
}
