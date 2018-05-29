<?php

namespace DevQuotes;

class QuotesStore
{

	protected static $instance = null;
	private $store = array();

	private function __construct()
	{
		$str = file_get_contents(__DIR__ . '/quotes.json');
		$json = json_decode($str, true);
		foreach ($json as $item) {
			$this->store[] = new DevQuote($item['text'], $item['author']);
		}
	}

	/**
	 * @return QuotesStore
	 */
	public static function getInstance()
	{
		if (!isset(static::$instance)) {
			static::$instance = new QuotesStore();
		}
		return static::$instance;
	}


	/**
	 * @return DevQuote
	 */
	public function randomQuote()
	{
		$random = array_rand($this->store, 1);
		return $this->store[$random];
	}

}