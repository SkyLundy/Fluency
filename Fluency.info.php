<?php

declare(strict_types=1);

namespace ProcessWire;

$info = [
  'title' => 'Fluency',
  'version' => '090',
  'href' => 'https://processwire.com/talk/topic/24567-fluency-integrated-deepl-powered-content-translation',
  'icon' => 'language',
  'summary' => 'The complete translation suite for ProcessWire.',
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
    'fluency-translate' => __('Use Fluency translation')
  ],
  'page' => [
    'name' => 'fluency',
    'title' => __('Translation')
  ],
];
