<?php
/**
 * Plugin Name: Wunderbar Basic
 * Plugin URI: http://terra-virtua.com
 * Description: Adds "What You Get Is What You See" front-end in-context editing to pages
 * Author: Larry Groebe @ Terra Virtua
 * Author URI: http://terra-virtua.com
 * Version: 1.8.0
 */
// 1.8.0 20191028 review lite version; fixes; version number sync
// 1.1.4 20181107 WP5 and gutenberg compatibility
// 1.1.3 20170808 don't allow wunderbar for users without editing privileges
// 1.1.2 20170731 additional fixes and improved IE support 
// 1.1.1 20170713 bug fix about double-clicking
// 1.1.0 20170711 Now with editor 4.7, double-click area to edit.
// 1.0.0 20170318 honor thy father...

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
//initialize stuff....

global $wunderbar_thispost, $wunderbar_options, $rawcontent;
global $postelement; $postelement=1; //counter to help uniquely identify each editable element

$wunderbar_options = get_option( 'wunderbar_settings' ); //get settings
if (!isset($wunderbar_options['can_edit_post_content'])) $wunderbar_options['can_edit_post_content'] = 1;
if (!isset($wunderbar_options['wunderbar_location'])) $wunderbar_options['wunderbar_location'] = 'top';
if (!isset($wunderbar_options['wunderbar_non_editable_areas'])) $wunderbar_options['wunderbar_non_editable_areas'] = '';

include "wb-functions.php";
include "wb-ajax.php";
include "wb-settings.php";

add_action('init','wunderbar_init');
add_action('wp_enqueue_scripts','wunderbar_register_scripts');
add_action('admin_init','wunderbar_register_mcestyle');

function wunderbar_register_scripts(){
    wp_enqueue_style( 'style1', plugins_url( 'css/wunderbar_helper_styles.css' , __FILE__ ) );
	}

function wunderbar_register_mcestyle(){
    add_editor_style( plugins_url( 'css/wunderbar_helper_styles.css' , __FILE__ ) );
	}

$plugin = plugin_basename( __FILE__ );
add_filter( "plugin_action_links_$plugin", 'wunderbar_add_settings_link' );

?>