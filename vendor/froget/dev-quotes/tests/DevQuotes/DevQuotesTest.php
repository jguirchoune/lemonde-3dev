<?php
namespace DevQuotes;

use PHPUnit_Framework_TestCase;

class DevQuotesTest extends PHPUnit_Framework_TestCase
{

	private $message = "Test Message";

	public function testDevQuoteUnknownMessage()
	{
		$dquote = new DevQuote($this->message);

		$this->assertEquals($this->message, $dquote->getMessage());
		$this->assertEquals("(Unknown)", $dquote->getAuthor());
	}

	public function testDevQuoteMessage()
	{
		$dquote = new DevQuote($this->message, "FRoget");

		$this->assertEquals($this->message, $dquote->getMessage());
		$this->assertEquals("FRoget", $dquote->getAuthor());
	}

	public function testDevQuotesStore()
	{
		$storedQuote = QuotesStore::getInstance()->randomQuote();
		echo $storedQuote->toString();
		$this->assertNotNull($storedQuote);
	}

}