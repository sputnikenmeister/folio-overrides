<?php
Class extension_folio_overrides extends Extension
{
	public static $defaults = array(
		'additional-backend-css' =>
			'/extensions/folio_overrides/assets/symphony.overrides.css'
		);

	/*-------------------------------------------------------------------------
	 Extension definition
	 -------------------------------------------------------------------------*/
	public function about()
	{
		return array('name' => 'Portfolio Overrides',
				   'version' => '0.1.1',
				   'release-date' => '2011-07-01',
				   'author' => array('name' => 'Pablo Canillas',
					  'website' => 'http://localhost/',
					  'email' => 'nobody@localhost'),
				   'description' => 'Local overrides that cannot be done in the workspace'
				   );
	}
		
	public function getSubscribedDelegates() {
		return array(
			array(
				'page' => '/system/preferences/',
				'delegate' => 'AddCustomPreferenceFieldsets',
				'callback' => '__appendPreferences'
			),
			array(
				'page' => '/backend/',
				'delegate' => 'AdminPagePreGenerate',
				'callback' => '__appendAssets'
			),
		);
	}
	
	public function install() {
		// Add defaults to config.php
		if (!Symphony::Configuration()->get('additional-backend-css', 'folio-overrides')) {
			Symphony::Configuration()->set('additional-backend-css', self::$defaults['additional-backend-css'], 'folio-overrides');
		}
		return Administration::instance()->saveConfig();
	}
	
	public function uninstall() {
		Symphony::Configuration()->remove('folio-overrides');
		return Administration::instance()->saveConfig();
	}

	/*-------------------------------------------------------------------------
		Delegates:
	-------------------------------------------------------------------------*/

	/**
	 * Append assets to the page head
	 * @param object $context
	 */
	public function __appendAssets($context)
	{
		$callback = Symphony::Engine()->getPageCallback();
		
		// Append additional stylesheet
		if(is_array($callback['context'])) {
			Administration::instance()->Page->addStylesheetToHead(URL . Symphony::Configuration()->get('additional-backend-css', 'folio-overrides'), 'screen', 3466715, false);
		}
	}

	public function __appendPreferences($context)
	{	
		$group = new XMLElement('fieldset');
		$group->setAttribute('class', 'settings');
		$group->appendChild(new XMLElement('legend', __('Local Overrides')));
		
		$label = Widget::Label(__('Additional Backend Stylesheet Location'));
		$label->appendChild(Widget::Input('settings[folio-overrides][additional-backend-css]', General::Sanitize(Symphony::Configuration()->get('additional-backend-css', 'folio-overrides'))));
		$group->appendChild($label);
		
		$group->appendChild(
			new XMLElement('p', __('This path is relative to the root Symphony installation folder, ') . '<code>'.URL.'</code>', array('class' => 'help')));
			
		$context['wrapper']->appendChild($group);
	}
}