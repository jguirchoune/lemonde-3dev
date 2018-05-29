# Dev Quote [![Build Status](https://travis-ci.org/francois-roget/DevQuotes.svg?branch=master)](https://travis-ci.org/francois-roget/DevQuotes)
Get Random Dev quotes
## Installation
Use [Composer](https://getcomposer.org/ "Composer") :  

`composer require froget/dev-quotes`

## Usage
```php
<?php require_once __DIR__ . '/vendor/autoload.php';
 
 use DevQuotes\QuotesStore;
 
 // Test Dev Quote
 $quote = QuotesStore::getInstance()->randomQuote();
 echo $quote->toString();
 ```