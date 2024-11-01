<?php
/**
 * WP Posts Table Bootstrap
 *
 * @since 1.0.0
 * @package WPPostsTable
 */

class WPPT_Bootstrap {
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
		add_action( 'wp_enqueue_scripts', array( $this, 'wp_enqueue_scripts' ) );
		add_action( 'rest_api_init', array( $this, 'register_route' ) );

		// add_filter( 'allowed_http_origin', array( $this, 'allow_all_origins' ), 10 );
		// add_filter( 'allowed_http_origin', array( $this, 'allowed_http_origin' ), 10, 2 );
		// add_action( 'rest_send_nocache_headers', array( $this, 'allow_localhost_port_dev' ) );
	}

	// public function allowed_http_origin( $origin, $origin_arg ) {
	// 	return true;
	// }

	// public function allow_all_origins() {
	// 	header("Access-Control-Allow-Origin: *");
	// }

	// public function allow_localhost_port_dev() {
	// 	header("Access-Control-Allow-Headers: X-WP-Nonce");
	// }

	/**
	 * Some useful variables and urls
	 *
	 * @since  1.0.0
	 * @return array
	 */
	public function get_api_vars() {
		return array(
			'api' => array(
				'homeUrl'       => home_url(),
				'prefix'		=> rest_get_url_prefix(),
				'prefixUrl'		=> home_url( rest_get_url_prefix() ),
				'root'			=> rest_get_url_prefix() . '/posts-table-datagrid/v1',
				'rootUrl'		=> home_url( rest_get_url_prefix() . '/posts-table-datagrid/v1' ),
				'nonce'			=> wp_create_nonce( 'wp_rest' ),
			),
		);
	}

	/**
	 * Enqueue scripts
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function wp_enqueue_scripts() {
		wp_register_script( 'wp-posts-table-api', $this->plugin->uri . 'assets/js/api.js', array(), $this->plugin::VERSION, false );
		wp_localize_script( 'wp-posts-table-api', 'WPPT_API',
			$this->get_api_vars()
		);
		wp_enqueue_script( 'wp-posts-table-api' );
	}

	/**
	 * Register REST routes
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function register_route() {
		$version = '1';
		$namespace = 'wp-posts-table/v' . $version;
		$base = 'apiVars';
		register_rest_route( $namespace, '/' . $base, array(
			array(
				'methods'         => WP_REST_Server::READABLE,
				'callback'        => array( $this, 'get_api_vars' ),
				'permission_callback' => '__return_true',
				'args'            => array(
				),
			),
		) );
	}

}
