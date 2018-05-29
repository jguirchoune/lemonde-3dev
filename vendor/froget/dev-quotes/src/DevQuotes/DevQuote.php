<?php 
namespace DevQuotes;
 
class DevQuote {

  private $message;
  private $author;
  
  function __construct($message, $author="(Unknown)") {
    $this->message = $message;
    $this->author = $author;
  }
 
  public function getMessage()
  {
    return $this->message;
  }

  public function getAuthor()
  {
  	return $this->author;
  }

  public function toString()
  {
  	return $this->getAuthor() . ': ' . $this->getMessage() . PHP_EOL;
  }
 
}