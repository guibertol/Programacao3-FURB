<?php namespace App\Exceptions;
use Exception;
/**
 * Class NotFoundException.
 */
class NotFoundException extends Exception
{
    /**
     * @param string $message
     */
    public function __construct($message = 'Item não encontrado')
    {
        parent::__construct($message);
    }
}
