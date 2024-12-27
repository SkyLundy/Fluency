<?php

declare(strict_types=1);

namespace Fluency\DataTransferObjects\Traits;

use Fluency\FluencyErrors;
use InvalidArgumentException;

trait ValidatesErrorsTrait
{
    /**
     * Checks that an error passed to a DataTransferObject uses a constant value defined in FluencyErrors
     * @param  array  $data Data transfer object data
     * @param  string $key  Array key that should be analyzed for an error
     * @return void
     * @throws InvalidArgumentException
     */
    protected static function validateErrorIfPresent(array $data, string $key): void
    {
        $error = $data[$key] ?? null;

        if (!$error) {
            return;
        }

        if (!in_array($error, FluencyErrors::getDefinedErrors(), true)) {
            throw new InvalidArgumentException(
                "Errors must be defined in FluencyErrors. '{$error}' not found."
            );
        }
    }
}
