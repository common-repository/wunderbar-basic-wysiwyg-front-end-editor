<?php
//LG 20190801 don't involve gutenberg on non-guternberg posts
//LG 20181107 fair compatiblity with Gutenberg
//LG 20180128 create a new post... from [show_post] or from 404 detect
//LG 20170723 getpagelist for link dialog - reworked completely
//LG 20170218 page/post categories - awk!
//LG 20170208 wunderbarwidget editing too!
//LG 20170131 comment_content
//LG 20160919 limit history to 30
//LG 20160905 getwbinfo restored
//LG 20160818 the_excerpt
//LG 20160807 pagelist for POSTS added
//LG 20160728 pagelist added
//LG 20160713 return saved content for reloading; fix to update_option
//LG 20160411 the beginnings of the Wunderbar eklipse interface
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly


//AJAX DESTINATION called to get a list of past postsw
function wunderbar_getpast(){
	global $wpdb;
	$wbitem = wunderbar_unpack($_REQUEST[wbtvi]);
	if ($wbitem[post_field]=='widget') { print ""; die;} // Widgets have no history

	$oldposts = "<li class='history'>REVERT TO...</li>\n";
	$wbpost = $wbitem[post_ID];
	if ($wbitem['post_name']) {	//actually, this is unlikely to happen. but...
			$mypost = get_page_by_path( $wbitem['post_name'] , ARRAY_A, 'post');
			$wbpost = $mypost[post_ID];
			}
	$query = "select p.id,concat(date_format(post_date,'%d %b %Y %l:%i %p'),' by ',user_nicename) as display from ".$wpdb->prefix."posts p join " . $wpdb->prefix . "users u on (u.ID=post_author) where post_parent=$wbpost and post_type='revision' order by id desc limit 30";
	$postlist = $wpdb->get_results($query);
	if (count($postlist)) {
		foreach ($postlist as $row) {
			$oldposts .= "<li class='history'><a onClick=\"wunderbar_revertPost('".sanitize_text_field($_REQUEST['wbtvi'])."',$row->id)\">$row->display</a></li>\n";
			}
		}
	print $oldposts;
	die();
	}


//AJAX DESTINATION called to get a post to be put into editable area
function wunderbar_getpost(){
	$wbitem = wunderbar_unpack($_REQUEST[wbtvi]);
	//are we getting historical post?
	if (sanitize_text_field($_REQUEST[wbtvh])) {
		//historical post?
		$mypost= get_post(sanitize_text_field($_REQUEST[wbtvh]), ARRAY_A, sanitize_text_field($_REQUEST[wbtvf])); //wbtvf='display' if needed
	} else {
		//real current post by name or number
		if ($wbitem['post_name']) {
			$mypost = get_page_by_path( $wbitem['post_name'] , ARRAY_A, 'post');
		} else {
			$mypost = get_post($wbitem[post_ID], ARRAY_A, sanitize_text_field($_REQUEST[wbtvf])); //wbtvf='display' if needed
			}
		}
	$content = $mypost[$wbitem['post_field']];
	ob_start();	//at least one plugin (carmel/pricingtables) PRINTS HTML direct. that's not allowed!

	if (sanitize_text_field($_REQUEST[wbtvf])=='display') {
		$filtername = str_replace('post_','the_',$wbitem['post_field']);
		remove_filter($filtername, 'wunderbar_add_around_$wbitem[post_field]');
		$content = apply_filters($filtername, $content);
		add_filter($filtername, 'wunderbar_add_around_$wbitem[post_field]');

	} else {
		//$content = wpautop( $content);  //don't even translate the paragraphs
		}
	ob_end_clean();
	$retvals['fieldEncode'] = "M";
	//post content and comment_content force HTMLmode
	if (strpos($wbitem['post_field'],"content")>0 or $wbitem['post_field']=='widget' ) { 
		$retvals['fieldEncode'] = "H";
		$content= wunderbar_autop_content($content);
		}
	$retvals['fieldData'] = $content;
	if ($retvals['fieldEncode']=='M') {$retvals['fieldData'] = strip_tags($content,'<b><i><em><strong>');} //titles have NO html
	print json_encode($retvals);
	die();
	}


//AJAX DESTINATION called to store an edited post back into database
function wunderbar_putpost(){
	global $wpdb;
	//20160511 escaping doublequotes for Wordpress becuase wordpress does it it's own way.
	$passed_data = json_decode(str_replace(array('\"','\\\\'),array('"','\\'),$_REQUEST['wbtvi']));
	//here are the ids and the post content
	$nonce = key($passed_data);
	$wbitem = wunderbar_unpack($nonce);
///////if no postid make sure we have a post-name

	$val = $passed_data->$nonce;
	$val = trim(rawurldecode($val));				//here's our edited content
	$val = str_replace("&quot;",'"',$val);			//use real quotemarks

//file_put_contents($_SERVER['DOCUMENT_ROOT'].'/gutenlog.txt',$val);

//	if ( function_exists( 'register_block_type' ) ) {
if (strpos( $content, '<!-- wp:' )!==false) {
		//print "GUTENBERG IS ALIVE";
		//a gutenberg page! some degree of gutenberg compatibility
		$val=str_replace("<!-- /wp:paragraph --> <!-- wp:paragraph --></p>","</p>".PHP_EOL."<!-- /wp:paragraph -->",$val); // fix for gutengrafs without p tags
		
		$srch="~^(?:\r?\n|\r)<p><!-- (.*) --></p>(?:\r?\n|\r)$~smU";
		$repl='<!-- \\1 -->';
		$val=preg_replace($srch, $repl, $val);			//restore comments
		$srch="~^<p><!-- (.*) --></p>(?:\r?\n|\r)$~smU";
		$repl='<!-- \\1 -->';
		$val=preg_replace($srch,$repl,$val);			//including First line
		$srch="~^(?:\r?\n|\r)<p><!-- (.*) --></p>$~smU";
		$repl='<!-- \\1 -->';
		$val=preg_replace($srch,$repl,$val);			//including last line

		$val=str_replace("--><!--","-->".PHP_EOL.PHP_EOL."<!--",$val); // fix spacing between gutenblocks
		$val=str_replace(PHP_EOL.PHP_EOL.'<p', PHP_EOL.PHP_EOL.'<!-- wp:paragraph -->'.PHP_EOL.'<p', $val); // and wb-split grafs at least
		$val=str_replace('</p>'.PHP_EOL.PHP_EOL, '</p>'.PHP_EOL.'<!-- /wp:paragraph -->'.PHP_EOL.PHP_EOL, $val); // and wb-split grafs at least

		$val=str_replace("<!-- /wp:separator --><p></p>","<!-- /wp:separator -->",$val);
		}
	
	if (!$wbitem[post_ID] and $wbitem['post_name'] ) {
		//create a new post... from [show_post] or from 404 detect
		$posttype='wunderbar'; //start by assuming show-post which creates a 'wunderbar' post type
		if (substr($wbitem['post_field'],0,4) =='new_') {
			//but if our field type was "new_"something, then it's a something type and regular contents.
			$posttype = str_replace('new_','', $wbitem['post_field']);
			$wbitem['post_field'] = 'post_content';
			//should it also be draft?
			}
		$post_id = wp_insert_post(
			array(
			'post_name'		=>	$wbitem['post_name'],
			'post_title'		=>	$wbitem['post_name'],
			'post_status'		=>	'publish',
			'post_type'		=>	$posttype,
			$wbitem['post_field'] => $val
			)
		);

	} else {

		$query="select * from ".$wpdb->prefix."posts where ID=$wbitem[post_ID]";
		$oldpost = $wpdb->get_row($query);
		$oldcats= wp_get_post_categories( $wbitem[post_ID]);
		$mypost=array(
			'post_title'	=> $oldpost->post_title, 
			'post_name'		=> $oldpost->post_name, 
			'post_status'	=> $oldpost->post_status, 
			'post_excerpt'	=> $oldpost->post_excerpt, 
			'post_type'		=> $oldpost->post_type, 
			'comment_status'=> $oldpost->comment_status, 
			'ping_status'	=> $oldpost->ping_status, 
			'post_password'	=> $oldpost->post_password, 
			'post_author'	=> $oldpost->post_author, 
			'post_parent'	=> $oldpost->post_parent, 
			'menu_order'	=> $oldpost->menu_order,
			'post_content'	=> $oldpost->post_content,
			'post_date'		=> $oldpost->post_date,
			'post_category'	=> $oldcats, 
			'ID'=>$wbitem['post_ID']
			);
		$mypost[$wbitem['post_field']] = $val;  //now the $wbitem[post_field] with new data
		//dont repost our demo post
		if ($mypost[post_type]!=='wunderbar_demo') {$post_id=wp_insert_post($mypost);}
		}

	if ($wbitem['post_field']!='widget') {
		//reprocess database content and return it.
		$filtername = str_replace('post_','the_',$wbitem['post_field']);
		remove_filter($filtername, 'wunderbar_add_around_$wbitem[post_field]');
		$newval = apply_filters($filtername, $val);
		add_filter($filtername, 'wunderbar_add_around_$wbitem[post_field]');
		}

	$retvals = array();
	$retvals['success'] = 1;
	$retvals['fieldData'] = $newval;
	print json_encode($retvals);
	die();
	}


//AJAX DESTINATION called to update wunderbar_options (with new uneditable area)
function wunderbar_updateoption(){
	global $wunderbar_options;
	$oname = sanitize_text_field($_REQUEST[oname]);
	$oval = sanitize_text_field($_REQUEST[oval]);
	if (!sanitize_text_field($_REQUEST[mult])) {
		$option = sanitize_text_field($_REQUEST[oval]);	//just replace this option
	} else {	//multivalues -- so add it.
		$option = explode(PHP_EOL, $wunderbar_options[$oname]); //explode it
		array_unshift($option, $oval ); //add it in front
		$option = array_unique($option);	//dedupe it
		$option = implode(PHP_EOL,$option);	//implode it again
		}
	$wunderbar_options[$oname] = $option;
//	print_r($wunderbar_options);
	update_option( "wunderbar_settings", $wunderbar_options);
	return 1;
	die();
	}

//AJAX called by CKEditor link dialog box
function wunderbar_pagelist(){
	global $wpdb;
	$output = array();
	$ptype = "page";
	if (sanitize_text_field($_REQUEST['post'])==true or sanitize_text_field($_REQUEST['posts'])==true) {$ptype="post";}
	$pages = $wpdb->get_results($wpdb->prepare( "SELECT ID, post_title FROM $wpdb->posts WHERE post_status = 'publish' and post_type='$ptype' order by post_title"));
	foreach ($pages as $page) {
		$output[] = '"' . str_replace('"','',$page->post_title) . '":"' . get_page_link( $page->ID ) . '"'; //remove doublequotes
		}
	print "{" . implode(',',$output). "}";
	die();
	}
?>