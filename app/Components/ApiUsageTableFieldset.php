<?php

declare(strict_types=1);

namespace Fluency\Components;

use Fluency\Components\Traits\GeneratesFieldsetsTrait;
use Fluency\FluencyLocalization;
use ProcessWire\{Inputfield, InputfieldWrapper};

use function \ProcessWire\wire;

class ApiUsageTableFieldset
{
    use GeneratesFieldsetsTrait;

    public static function getFields(bool $collapsed = false): InputfieldWrapper
    {
        $collapsed ? Inputfield::collapsedYes : Inputfield::collapsedNever;
        $uiText = FluencyLocalization::getFor('usage');
        $modules = wire('modules');

        $modules->Fluency->insertApiUsageTableFieldsetAssets();

        return $modules->get('InputfieldWrapper')->add([
            'type' => 'InputfieldFieldset',
            'name' => 'ft_api_usage',
            'label' => $uiText->title,
            'description' => $uiText->description,
            'collapsed' => $collapsed,
            'attributes' => [
                'class' => self::appendInputfieldClasses('InputfieldWrapper', 'ft-api-usage-table-fieldset')
            ],
            'children' => [
                [
                    'type' => 'InputfieldMarkup',
                    'collapsed' => Inputfield::collapsedNever,
                    'themeBorder' => 'hide',
                    'value' => $modules->get('MarkupAdminDataTable')
                        ->set('sortable', false)
                        ->headerRow([
                            $uiText->unit,
                            $uiText->used,
                            $uiText->limit,
                            $uiText->remaining,
                            $uiText->total
                        ])->row([
                            ['*', 'ft-usage-unit'],
                            ['*', 'ft-usage-used'],
                            ['*', 'ft-usage-limit'],
                            ['*', 'ft-usage-remaining'],
                            ['*', 'ft-usage-total']
                        ])->render(),
                ],
                [
                    'type' => 'InputfieldSubmit',
                    'text' => $uiText->buttonLabelRefresh,
                    'attributes' => [
                        'class' => self::appendInputfieldClasses(
                            'InputfieldSubmit',
                            'js-ft-refresh-usage',
                            'ft-refresh-usage-button'
                        ),
                        'icon' => 'refresh'
                    ]
                ]
            ]
        ]);
    }
}
