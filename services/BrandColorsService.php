<?php

namespace webhubworks\mvbdesignsystem\services;

use webhubworks\mvbdesignsystem\MvbDesignSystem;
use yii\base\Component;


class BrandColorsService extends Component
{
    public function getBrandColorSet(?string $brandName = null, string $default = 'mvb')
    {
        $brandColors = require MvbDesignSystem::getInstance()->getBasePath() . '/config/brand-colors.php';
        return $brandColors[$brandName] ?? $brandColors[$default];
    }

    public function getBrandColorStyle(?string $brandName = null, string $default = 'mvb'): string
    {
        $brandColor = $this->getBrandColorSet($brandName, $default);

        $colorValueLines = collect($brandColor)->map(function ($color, $key) {
            return "$key: $color";
        })->implode('; ');
        
        return ":root { $colorValueLines; }";
    }
}
