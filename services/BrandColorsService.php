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

    /**
     * Get the brand color style as a string of CSS variable declarations. Insert this into a HTML element's style attribute.
     *
     * @param string|null $brandName
     * @param string $default
     * @return string
     */
    public function getBrandColorStyle(?string $brandName = null, string $default = 'mvb'): string
    {
        $brandColor = $this->getBrandColorSet($brandName, $default);

        $colorValueLines = collect($brandColor)->map(function ($color, $key) {
            return "$key: $color";
        })->implode('; ');

        return "$colorValueLines;";
    }

    /**
     * Get the brand color style as a CSS :root declaration. Insert this into a <style> tag in your HTML.
     *
     * @param string|null $brandName
     * @param string $default
     * @return string
     */
    public function getBrandColorStyleAsRoot(?string $brandName = null, string $default = 'mvb'): string
    {
        $colorValueLines = $this->getBrandColorStyle($brandName, $default);

        return ":root { $colorValueLines }";
    }
}
