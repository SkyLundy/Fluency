<?php

declare(strict_types=1);

namespace ProcessWire;

$info = [
  'title' => 'Fluency',
  'version' => '090',
  'href' => 'https://github.com/SkyLundy/Fluency.git',
  'icon' => 'language',
  'summary' => 'Adds integrated third-party content translation to ProcessWire.',
  'autoload' => true,
  'singular' => true,
  'requires' => [
    'ProcessLanguage',
    'LanguageSupport',
    'LanguageTabs',
    'ProcessWire>=300',
    'PHP>=8.1'
  ],
  'permissions' => [
    'fluency-translate' => 'Use Fluency translation'
  ],
  'page' => [
    'name' => 'fluency',
    'title' => __('Translation')
  ],
];
