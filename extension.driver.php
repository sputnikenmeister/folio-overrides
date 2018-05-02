<?php
class extension_folio_overrides extends Extension
{
	/*-------------------------------------------------------------------------
	 Extension definition
	 -------------------------------------------------------------------------*/

	public function getSubscribedDelegates()
	{
		return array(
			array(
				'page'     => '/backend/',
				'delegate' => 'InitaliseAdminPageHead',
				'callback' => 'appendAssets'
			),
		);
	}

	/*-------------------------------------------------------------------------
		Delegates:
	-------------------------------------------------------------------------*/

	/**
	 * Append assets to the page head
	 * @param object $context
	 */
	public function appendAssets($context)
	{
		// $callback = Symphony::Engine()->getPageCallback();
		$page = Administration::instance()->Page;
		$assetsUrl = URL . '/extensions/folio_overrides/assets/';

		if (Symphony::Engine()->getPageCallback()['context']['page'] == 'edit') {
			$page->addScriptToHead($assetsUrl . 'folio_overrides.fields.js');
			$page->addStylesheetToHead($assetsUrl . 'folio_overrides.fields.css');
		}
		$page->addStylesheetToHead($assetsUrl . 'folio_overrides.css');

		// <link rel="icon" type="image/png" sizes="64x64" href="http://localhost/projects/folio-sym/workspace/assets/images/favicons/circle/favicon.png">
		$link = new XMLElement('link');
		$link->setAttributeArray(array('rel' => 'icon', 'type' => 'image/png', 'sizes' => '64x64', 'href' => $assetsUrl . 'favicon.png'));
		$page->addElementToHead($link);

		// <link rel="shortcut icon" href="http://localhost/projects/folio-sym/workspace/assets/images/favicons/circle/favicon.ico">
		$link = new XMLElement('link');
		$link->setAttributeArray(array('rel' => 'shortcut icon', 'href' => $assetsUrl . 'favicon.ico'));
		$page->addElementToHead($link);
	}
}
