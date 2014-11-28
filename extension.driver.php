<?php
Class extension_local_overrides extends Extension
{
	public static $defaults = array(
		'additional-backend-css' =>
			'/extensions/local_overrides/assets/local_overrides.css'
		);

	/*-------------------------------------------------------------------------
	 Extension definition
	 -------------------------------------------------------------------------*/

	public function getSubscribedDelegates() {
		return array(
			// array(
			// 	'page'     => '/system/preferences/',
			// 	'delegate' => 'AddCustomPreferenceFieldsets',
			// 	'callback' => 'appendPreferences'
			// ),
			array(
				'page'     => '/backend/',
				'delegate' => 'InitaliseAdminPageHead',
				'callback' => 'appendAssets'
			),
		);
	}

	public function install() {
		// Add defaults to config.php
		if (!Symphony::Configuration()->get('additional-backend-css', 'local-overrides')) {
			Symphony::Configuration()->set('additional-backend-css', self::$defaults['additional-backend-css'], 'local-overrides');
		}
		return Symphony::Configuration()->write();
	}

	public function uninstall() {
		Symphony::Configuration()->remove('local-overrides');
		return Symphony::Configuration()->write();
	}

	/*-------------------------------------------------------------------------
		Delegates:
	-------------------------------------------------------------------------*/

	// public function appendPreferences($context)
	// {
	// 	$group = new XMLElement('fieldset');
	// 	$group->setAttribute('class', 'settings');
	// 	$group->appendChild(new XMLElement('legend', __('Local Overrides')));

	// 	$label = Widget::Label(__('Additional backend stylesheet location'));
	// 	$label->appendChild(Widget::Input('settings[local-overrides][additional-backend-css]', General::Sanitize(Symphony::Configuration()->get('additional-backend-css', 'local-overrides'))));
	// 	$group->appendChild($label);

	// 	$group->appendChild(
	// 		new XMLElement('p', __('This path is relative to the root Symphony installation folder, ') . '<code>'.URL.'</code>', array('class' => 'help')));

	// 	$context['wrapper']->appendChild($group);
	// }

	/**
	 * Append assets to the page head
	 * @param object $context
	 */
	public function appendAssets($context)
	{
        $callback = Symphony::Engine()->getPageCallback();

		if( $callback['context']['page'] == 'edit' ) {
            Administration::instance()->Page->addScriptToHead(URL . '/extensions/local_overrides/assets/local_overrides.fields.js');
            Administration::instance()->Page->addStylesheetToHead(URL . '/extensions/local_overrides/assets/local_overrides.fields.css');
        }
        Administration::instance()->Page->addStylesheetToHead(URL . '/extensions/local_overrides/assets/local_overrides.css');

		// This stylesheet gets loaded everytime, no need to check the context
		// Administration::instance()->Page->addStylesheetToHead(URL . Symphony::Configuration()->get('additional-backend-css', 'local-overrides'), 'screen', 999999, false);
	}
}
