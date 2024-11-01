<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package   WPPostsTable
 * @version   1.0.0
 */
namespace WPPostsTable\Admin;

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
final class Settings {

	/**
	 * Admin page name/ID.
	 *
	 * @since  1.0.0
	 * @access public
	 * @var    string
	 */
	public $name = 'wppt-settings';

	/**
	 * Settings page name.
	 *
	 * @since  1.0.0
	 * @access public
	 * @var    string
	 */
	public $settings_page = '';

	private $options;

	/**
	 * Singleton instance of plugin
	 *
	 * @since 1.0.0
	 * @var Textkit
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
			//self::$instance->includes();
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
	 * Set up actions.
	 *
	 * @since  1.0.0
	 * @access private
	 * @return void
	 */
	private function setup_actions() {
		add_action( 'admin_init', array( $this, 'settings_init' ) );
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
	}

	public function settings_init() {
		register_setting(
			'wppt', // option_group
			'wppt_options', // option_name
			array( $this, 'sanitize' ) // sanitize_callback
		);

		add_settings_section(
			'wppt_setting_section', // id
			'Settings', // title
			array( $this, 'wppt_section_info' ), // callback
			'wppt-settings' // page
		);

		add_settings_field(
			'theme', // id
			'Theme', // title
			array( $this, 'theme_callback' ), // callback
			'wppt-settings', // page
			'wppt_setting_section' // section
		);
	}

	public function admin_menu() {
		$this->settings_page = add_options_page(
			'WP Posts Table Settings',
			'WP Posts Table',
			'manage_options',
			$this->name,
			array( $this, 'settings_page' )
		);
	}

	/**
	 * Renders the settings page.
	 *
	 * @since  1.0.0
	 * @access public
	 * @return void
	 */
	public function settings_page() {
		// check that the user has the right capabilities
		if ( ! current_user_can( 'manage_options' ) ) return;

		$this->options = get_option( 'wppt_options' );
		?>
		<div class="wrap">
			<h1><?php echo esc_html_x( 'WP Posts Table', 'wp-posts-table' ); ?></h1>
			<form method="post" action="options.php">
				<?php
					settings_fields( 'wppt' );
					do_settings_sections( 'wppt-settings' );
					submit_button( __( 'Save Settings', 'wp-posts-table' ) );
				?>
			</form>
		</div><!-- wrap --><?php
	}

	public function sanitize( $input ) {
		$sanitary_values = array();
		if ( isset( $input['theme'] ) ) {
			$sanitary_values['theme'] = sanitize_text_field( $input['theme'] );
		}

		return $sanitary_values;
	}

	public function wppt_section_info() { ?>
		<?php
	}

	public function theme_callback() {
		$selected = isset( $this->options['theme'] ) ? esc_attr( $this->options['theme']) : '';

		$themes = array(
			'default' => __( 'Default', 'wp-posts-table' ),
			'minimal' => __( 'Minimal (use theme styles)', 'wp-posts-table' ),
			'modern' => __( 'Modern', 'wp-posts-table' )
		);

		?>
		<select type="text" name="wppt_options[theme]" id="wppt-theme">
			<?php foreach( $themes as $key => $theme ) : ?>
				<option value="<?php echo $key; ?>" <?php echo $selected == $key ? 'selected' : ''; ?>><?php esc_html_e( $theme ); ?></option>
			<?php endforeach; ?>
		</select><?php
	}
}

/**
 * Gets the instance of the class.
 *
 * @since  1.0.0
 * @access public
 * @return object
 */
function wppt_settings_page() {
	return Settings::get_instance();
}

wppt_settings_page();
