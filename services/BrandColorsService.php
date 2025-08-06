<?php

namespace webhubworks\mvbdesignsystem\services;

use webhubworks\mvbdesignsystem\MvbDesignSystem;
use yii\base\Component;


class BrandColorsService extends Component
{
    public function getBrandColors(?string $brandName = null, string $default = 'mvb'): string
    {
        $brandColors = require MvbDesignSystem::getInstance()->getBasePath() . '/config/brand-colors.php';
        $brandColor = $brandColors[$brandName] ?? $brandColors[$default];
        return collect($brandColor)->map(function ($color, $key) {
            return "$key: $color";
        })->implode('; ');
    }
}
