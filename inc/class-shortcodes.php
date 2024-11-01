<?php
/**
 * WP Posts Table Shortcodes
 *
 * @since 1.0.0
 * @package WPPostsTable
 */
class WPPT_Shortcodes {
	/**
	 * Parent plugin class
	 *
	 * @var   class
	 * @since 1.0.0
	 */
	protected $plugin = null;

	/**
	 * Constructor
	 *
	 * @since  1.0.0
	 * @param  object $plugin Main plugin object.
	 * @return void
	 */
	public function __construct( $plugin ) {
		$this->plugin = $plugin;
		$this->hooks();
	}

	/**
	 * Initiate our hooks
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function hooks() {
		add_action( 'init', array( $this, 'register_shortcodes' ), 20 );
		add_action( 'wp_enqueue_scripts', array( $this, 'register_scripts' ) );
	}

	/**
	 * Register shortcodes
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function register_shortcodes() {
		add_shortcode( 'wp-posts-table', array( $this, 'shortcode' ) );
	}

	/**
	 * Register scripts
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function register_scripts() {
		wp_register_script( 'wp-posts-table', $this->plugin->uri . 'app/build/main.js', array(), $this->plugin::VERSION, true );
		wp_enqueue_style( 'wp-posts-table', $this->plugin->uri . 'app/build/main.bundle.css', array() );
	}

	/**
	 * Display the shortcode
	 *
	 * @since  1.0.0
	 * @return string
	 */
	public function shortcode( $atts = array() ) {
		$atts = shortcode_atts( array(
			'home_url' => home_url()
		), $atts, 'posts_table_datagrid' );

		ob_start(); ?>
		<div id="ptd-root">
			<div class="ReactTable">
				<div class="rt-table" role="grid">
					<div class="rt-thead -header">

					</div>
					<div class="rt-tbody">
					</div>
				</div>
			</div>
		</div>
		<?php $template = ob_get_clean();
		
		// Pass the shortcode attributes to our js
		wp_localize_script( 'wp-posts-table', 'WPPTShortcodeAtts', $atts );
		wp_enqueue_script( 'wp-posts-table' );

		return $template;
	}
}