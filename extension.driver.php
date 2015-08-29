<?php
Class extension_folio_overrides extends Extension
{
	/*-------------------------------------------------------------------------
	 Extension definition
	 -------------------------------------------------------------------------*/

	public function getSubscribedDelegates() {
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
        $callback = Symphony::Engine()->getPageCallback();

		if( $callback['context']['page'] == 'edit' ) {
            Administration::instance()->Page->addScriptToHead(URL . '/extensions/folio_overrides/assets/folio_overrides.fields.js');
            Administration::instance()->Page->addStylesheetToHead(URL . '/extensions/folio_overrides/assets/folio_overrides.fields.css');
        }
        Administration::instance()->Page->addStylesheetToHead(URL . '/extensions/folio_overrides/assets/folio_overrides.css');
	}
}
