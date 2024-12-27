<?php

declare(strict_types=1);

namespace Fluency\Engines\Traits;

use function \ProcessWire\wire;

trait LogsEngineData
{
    private string $logName = 'fluency-engine';

    /**
     * Log API issues
     *
     * @param  string      $error    A value from FluencyErrors
     * @param  string      $message  A descriptive message, may be from API
     * @param  mixed|array $response The API response object
     */
    protected function logError(string $error, ?string $message, mixed $response = []): void
    {
        $message ??= 'No Message';

        $logMessage = "Engine: {$this->getEngine()} /" .
            "Error: {$error} /" .
            "Message: {$message} /" .
            "Response: " . json_encode($response);

        wire('log')->save($this->logName, $logMessage);
    }

    /**
     * Logs general info
     */
    protected function logInfo(string $message): void
    {
        wire('log')->save(
            $this->logName,
            "Engine: {$this->getEngine()} / Message: {$message}"
        );
    }

    protected function getEngine(): string
    {
        $class = explode('\\', get_class($this));

        return end($class);
    }
}
