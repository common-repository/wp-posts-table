<?php
/**
 * Plugin Name: WP Posts Table
 * Plugin URI:  https://presscargo.io/plugins/wp-posts-table
 * Description: Display your posts in a table format that is searchable and sortable.
 * Version:     1.0.1
 * Author:      Press Cargo
 * Author URI:  https://presscargo.io
 * Text Domain: wp-posts-table
 *
 * @package   WPPostsTable
 * @version   1.0.1
 */

// Prevent direct file access
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The plugin class.
 *
 * @since  1.0.0
 * @access public
 */
class WPPostsTable {

	/**
	 * Current version
	 *
	 * @access public
	 * @var  string
	 */
	const VERSION = '1.0.1';

	/**
	 * Minimum required PHP version.
	 *
	 * @since  1.0.0
	 * @access private
	 * @var    string
	 */
	private $php_version = '5.6.0';

	/**
	 * Plugin directory path.
	 *
	 * @since  1.0.0
	 * @access public
	 * @var    string
	 */
	public $dir = '';

	/**
	 * Plugin directory URI.
	 *
	 * @since  1.0.0
	 * @access public
	 * @var    string
	 */
	public $uri = '';

	/**
	 * Singleton instance of plugin
	 *
	 * @since 1.0.0
	 * @var PostsDatagrid
	 */
	protected static $instance = null;

	/**
	 * Returns the instance.
	 *
	 * @since  1.0.0
	 * @access public
	 * @return object
	 */
	public static function get_instance() {

		if ( is_null( self::$instance ) ) {
			self::$instance = new self;
			self::$instance->setup();
			self::$instance->includes();
			self::$instance->setup_actions();
		}

		return self::$instance;
	}

	/**
	 * Constructor method.
	 *
	 * @since  1.0.0
	 * @access private
	 * @return void
	 */
	private function __construct() {}

	/**
	 * Attach other plugin classes to the base plugin class.
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function plugin_classes() {
		// Attach other plugin classes to the base plugin class.
		$this->shortcodes = new WPPT_Shortcodes( $this );
		$this->bootstrap = new WPPT_Bootstrap( $this );
	}

	/**
	 * Init hooks
	 *
	 * @since  1.0.0
	 * @access public
	 * @return void
	 */
	public function init() {
		if ( $this->check_requirements() ) {
			$this->plugin_classes();
		}
	}

	/**
	 * Sets up globals.
	 *
	 * @since  1.0.0
	 * @access private
	 * @return void
	 */
	private function setup() {
		// Main plugin directory path and URI.
		$this->dir = trailingslashit( plugin_dir_path( __FILE__ ) );
		$this->uri = trailingslashit( plugin_dir_url(  __FILE__ ) );
	}

	/**
	 * Loads files needed by the plugin.
	 *
	 * @since  1.0.0
	 * @access private
	 * @return void
	 */
	private function includes() {
		// Check if we meet the minimum PHP version.
		if ( version_compare( PHP_VERSION, $this->php_version, '<' ) ) {
			add_action( 'admin_notices', array( $this, 'get_requirements_not_met_notice' ) );
			return;
		}

		require_once( $this->dir . 'inc/class-bootstrap.php' );
		require_once( $this->dir . 'inc/class-shortcodes.php' );

		if ( is_admin() ) {
			require_once( $this->dir . 'admin/class-settings-page.php' );
		}
	}

	/**
	 * Sets up main plugin actions and filters.
	 *
	 * @since  1.0.0
	 * @access private
	 * @return void
	 */
	private function setup_actions() {
		// Init hooks
		add_action( 'init', array( $this, 'init' ), 1 );

		// Internationalize the text strings used.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue' ), 2 );

		// Internationalize the text strings used.
		add_action( 'plugins_loaded', array( $this, 'i18n' ), 2 );

		// Register activation hook.
		register_activation_hook( __FILE__, array( $this, 'activation' ) );

		// Register deactivation hook
		register_activation_hook( __FILE__, array( $this, 'deactivation' ) );
	}

	/**
	 * Enqueues scripts styles.
	 *
	 * @since  1.0.0
	 * @access public
	 * @return void
	 */
	public function enqueue() {
		wp_enqueue_style( 'wp-posts-table', $this->uri . 'assets/css/style.css', array() );

		$wppt_options = get_option( 'wppt_options' );
		$theme = $wppt_options['theme'] ? $wppt_options['theme'] : 'default';

		wp_enqueue_style( 'wp-posts-table-theme', $this->uri . 'assets/css/themes/' . $theme . '.css', array() );
	}

	/**
	 * Loads the translation files.
	 *
	 * @since  1.0.0
	 * @access public
	 * @return void
	 */
	public function i18n() {
		load_plugin_textdomain( 'wp-posts-table', false, trailingslashit( dirname( plugin_basename( __FILE__ ) ) ) . 'lang' );
	}

	/**
	 * Method that runs only when the plugin is activated.
	 *
	 * @since  1.0.0
	 * @access public
	 * @return void
	 */
	public function activation() {
	}

	/**
	 * Method that runs only when the plugin is deactivated.
	 *
	 * @since  1.0.0
	 * @access public
	 * @return void
	 */
	public function deactivation() {
	}

	/**
	 * Deactivates this plugin, hook this function on admin_init.
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function deactivate() {
		deactivate_plugins( plugin_basename( __FILE__ ) );
	}

	/**
	 * Check if the plugin meets requirements and
	 * disable it if they are not present.
	 *
	 * @since 1.0.0
	 * @return boolean result of meets_requirements
	 */
	public function check_requirements() {
		if ( ! $this->meets_requirements() ) {

			// Add a dashboard notice.
			add_action( 'admin_notices', array( $this, 'get_requirements_not_met_notice' ) );

			// Deactivate our plugin.
			add_action( 'admin_init', array( $this, 'deactivate' ) );

			return false;
		}

		return true;
	}

	/**
	 * Check that all plugin requirements are met
	 *
	 * @since  1.0.0
	 * @return boolean True if requirements are met.
	 */
	public static function meets_requirements() {
		// Do checks for required classes / functions
		// function_exists('') & class_exists('').

		// We have met all requirements.
		return true;
	}

	public function get_requirements_not_met_notice() {
		echo '<div id="message" class="error"><p>';

		// Returns a message noting the minimum version of PHP required.		
		if ( version_compare( PHP_VERSION, $this->php_version, '<' ) ) {
			echo sprintf(
				__( 'WP Posts Table requires PHP version %1$s. You are running version %2$s. Please upgrade and try again.', 'wp-posts-table' ),
				$this->php_version,
				PHP_VERSION
			);
		}

		echo '</p></div>';
	}
}

/**
 * Gets the instance of the `WPPostsTable` class.  This function is useful for quickly grabbing data
 * used throughout the plugin.
 *
 * @since  1.0.0
 * @access public
 * @return object
 */
function wp_posts_table_plugin() {
	return WPPostsTable::get_instance();
}

wp_posts_table_plugin();
