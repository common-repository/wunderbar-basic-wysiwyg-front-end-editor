<?php
//20190913 wpautop turned off - selectively
//20190811 improvements to newpage dialog box
//20190404 small fix for acf fields
//20180711 wunderbar_ignore_post_types; insert_template vars
//20180421 media preview added
//20180128 create new content if not found
//20180103 test for divi and avada
//20171204 Friendly in a mixed DIVI environment, fix to WB Demo
//20170807 fix to disallow users who don't have editing privilege
//20170717 Advanced Custom Fields now editable
//20170220 comment_content is now deletable
//20170131 comment_content is now editable
//20160912 disallow menu editing in all situations
//20160905 do short code in ALL text widgets
//20160902 workable demo page for TV site accommodated
//20160825 changed show_post to put_content_here
//20160822 aha - you DO need to enqueue JQUery on the front end. Also detect preview mode
//20160819 init moved from wunderbar itself; no more rawcontent
//20160728 turn off edit_post_link
//20160713 split off
//20160710 MORE button can designate area as uneditable
//20160411 the beginnings of the Wunderbar eklipse interface
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly


////INITIALIZE WUNDERBAR////////
function wunderbar_init(){
	global $wunderbar_options;
	remove_filter('the_content', 'wpautop');
	if (is_user_logged_in() and !current_user_can('edit_posts') and !current_user_can('edit_pages') ) {return;}
	wp_enqueue_script( 'jquery' );
	if (!is_user_logged_in() ) { //not logged-in users see only a tiny mod.
			add_filter('the_content', 'wunderbar_visitor_post_content');
			
	} elseif (is_user_logged_in() and !is_customize_preview() ) { //only if we're admin but not previewing
		if (is_admin()) {
			add_action( 'admin_menu', 'wunderbar_add_admin_menu' );
			add_action( 'admin_init', 'wunderbar_settings_init' );

			//set up ajax functions, to get and receive posts, and more (ajax assumes admin access)
			add_action( 'wp_ajax_wunderbar-getpost', 'wunderbar_getpost' );
			add_action( 'wp_ajax_wunderbar-putpost', 'wunderbar_putpost' );
			add_action( 'wp_ajax_wunderbar-getpast', 'wunderbar_getpast' );
			add_action( 'wp_ajax_wunderbar-delpost', 'wunderbar_delpost' );

			//destination for the editor object, link, getWBinfo routines
			add_action( 'wp_ajax_wunderbar-pagelist', 'wunderbar_pagelist' );

			//destination for changing option (hiding editable area)
			add_action( 'wp_ajax_wunderbar-updateoption', 'wunderbar_updateoption' );

		} else {

			//turn off anyone else's in-page edit links 
			add_filter('edit_post_link', 'wunderbar_remove_get_edit_post_link');
			add_filter('wp_nav_menu_items', 'wunderbar_offmenu');
			add_thickbox();

			//put admin/editing code into the header & add editbugs to post content
			add_action('wp_head', 'initialize_wunderbar_code');

			//these allow us to put editbugs around our content and title
			add_filter('the_content', 'wunderbar_add_around_post_content');

			//add one to turn on and off editing within a theme
			add_action( 'wunderbar_on', 'wunderbar_on' );
			add_action( 'wunderbar_off', 'wunderbar_off' );

			}
		} elseif ($_SERVER['HTTP_HOST'] == 'terra-virtua.com')  {//not logged in - demopage
			add_action( 'wp_ajax_nopriv_wunderbar-getpost', 'wunderbar_getpost' );
			add_action( 'wp_ajax_nopriv_wunderbar-putpost', 'wunderbar_putpost' );
			add_action( 'wp_ajax_nopriv_wunderbar-getpast', 'wunderbar_getpast' );
			//put admin/editing code into the header & add editbugs to post content; demo version
			if ($_SERVER['REQUEST_URI'] == '/demo/')  {
				add_action('wp_head', 'initialize_wunderbar_code');
				add_filter('the_content', 'wunderbar_add_around_post_content');
				}

		}
		
	}


//FUNCTION: insert this stuff into admin header code 
function initialize_wunderbar_code(){

//		include "wunderbar-start.php";
		global $wunderbar_options;

		$homeurl = home_url( '/' );
		$sitecore = parse_url($homeurl, PHP_URL_SCHEME) . "://". parse_url($homeurl, PHP_URL_HOST)."/" ;
		define ('wunderbar_adminpath' , plugin_dir_url( __FILE__ ));			//where IS admin?
		define ('wunderbar_rootpath', str_replace($sitecore,'',wunderbar_adminpath) ) ;//absolute rootpath
		define ("wunderbar_objects_path", "objects");			// <-- where images and pdfs live

		$http = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on'? "https://" : "http://";
		$turl = $http . $_SERVER["SERVER_NAME"];

		$morescript = "var wpadminpath='".admin_url()."';
var fullpath='$turl/" . wunderbar_rootpath . "'; 
var wunderbar_location='" . $wunderbar_options['wunderbar_location']."'; 
var wunderbar_image_insert_template=\"" . $wunderbar_options['wunderbar_image_insert_template']."\"; 
var wunderbar_file_insert_template=\"" . $wunderbar_options['wunderbar_file_insert_template']."\"; 
		";

	wp_enqueue_style('wunderbar_adminbar',wunderbar_adminpath.'css/wb-adminbar.css');

	if (trim($wunderbar_options['wunderbar_non_editable_areas']) ) {
		$list=explode(PHP_EOL, trim($wunderbar_options['wunderbar_non_editable_areas']));
		$morecss = "";
		foreach ($list as $item) {
			$morecss .= "$item span.ekwrap,$item span.ekowrap {display: none !important;}\n";
			}
		wp_add_inline_style( 'wunderbar_adminbar', $morecss );
		}

	wp_enqueue_script('wunderbar_editor', wunderbar_adminpath.'editor/ckeditor.js',array('jquery'));
	wp_enqueue_script('wunderbar_admin', wunderbar_adminpath.'wb-admin.js',array('jquery'));
	wp_enqueue_script('wunderbar_animate_shadow', wunderbar_adminpath.'js/jquery.animate-shadow-min.js',array('jquery'));

	wp_add_inline_script( 'wunderbar_editor', $morescript, 'before');


//  	wp_enqueue_media();
//  	wp_enqueue_script('media-upload');
 	wp_enqueue_script('thickbox');
 	wp_enqueue_style('thickbox');
	}


//FUNCTIONs CALLED FROM TEMPLATE: Force the next content editable or not.
function wunderbar_on(){
	global $wunderbar_thispost;
	$wunderbar_thispost=1;
	}

function wunderbar_off(){
	global $wunderbar_thispost;
	$wunderbar_thispost=0;
	}

function wunderbar_offmenu($menu){	//menus can be edited at this time.
	$menu=str_replace('Approved ekEditWrap','',$menu);
	return ($menu);
	}


//FUNCTION: turn off Wordpress' editpostlink function
function wunderbar_remove_get_edit_post_link( $link ) {
    return null;
	}

//FUNCTION: light processing of content for visitors. only "normalize" non-wb content
function wunderbar_autop_content($content) {
	if (strpos($content,"<!--wunderbar-->")===false) {
		$content= wpautop($content);
	} else {
		$content=trim(str_replace("<!--wunderbar-->","",$content));
		}
	return $content;
	}

function wunderbar_visitor_post_content($content) {
	return wunderbar_autop_content($content);
	}

function wunderbar_add_around_post_content($content) {
	return wunderbar_add_around_something(wunderbar_autop_content($content),'post_content');
	}

//FUNCTIONS: wrap some sort of content in an editable area, if permitted
function wunderbar_add_around_something($content, $contenttype, $subtype=null) {
	global $post, $comment, $wunderbar_thispost, $wunderbar_thisacf, $postelement, $wunderbar_options,$id, $wunderbar_found404;

	$user = wp_get_current_user();
    $loggedin= $user->exists();
    if ( !$loggedin ) {	return $content;}

	//you *CAN* APPLY the_content to a directly-passed string which is NOT a post. 
	// we don't want to allow editing of THAT. This will apparently trap That
	if ($id==0) {return $content; }

	//20171204 for Divi users, DON'T allow editing if DIVI or Avada shortcodes are involved
	if (strpos($content,'[et_pb')===0 or strpos($content,'[fusion')!==false or strpos($content,'[one')!==false or strpos($content,'[fullwidth')!==false) {return $content; }


//	$content=$id.":".$content;
	$postelement++;
	$postname="";
	if ($contenttype != 'comment_content') {
			//this could be tagged non-editable, or turned off just for this item, or not allowed to do this content type or type of post.
			$itemID = $post->ID;
			$tags = wp_get_post_tags($itemID, array('fields'=>'names'));
	//can this move down after?
			if ( !$subtype and (in_array('wunderbar_off',$tags )
				 or (!$wunderbar_options["can_edit_$contenttype"])
				 or (isset($wunderbar_thispost) and $wunderbar_thispost===0))
				 or (in_array($post->post_type, explode(',',$wunderbar_options['wunderbar_ignore_post_types'])))
				) {
				unset($wunderbar_thispost); 
				return $content;
				} 
		}
	//also check if default for posts is OFF but $wunderbar_thispost is set and ===1
	
	//create unique ID and store or post info in it.
	$nonce = wunderbar_pack($itemID,$contenttype,$postname);
	$wbitem = array('post_ID' => $itemID, 'post_field'=>$contenttype);
	$surround = (strpos($contenttype,"content")>0) ? "section" : "span";  //content vs title
	$result = "<$surround id='$nonce' class='Approved ekEditWrap' data-contents='the ".str_replace("_"," ",$contenttype)."'>";

	$result .= $content ? $content:'&nbsp;';
	$result .= "</$surround>";
	return $result;
	}

function wunderbar_pack($postid, $postfield,$postname='') {
	global $postelement;
	$tmp=base64_encode( "$postid|$postelement|$postfield|$postname" );
	$tmp=str_replace ("=","_","WB$tmp");
	return $tmp;
	}

function wunderbar_unpack ($encoded) {
	$tmp = explode('|',sanitize_text_field(base64_decode(str_replace("_","=",substr($encoded,2))) ),4 );
	$item = array('post_ID'=>$tmp[0], 'post_count'=>$tmp[1], 'post_field'=>$tmp[2], 'post_name'=>$tmp[3] );
	return $item;
	}

?>