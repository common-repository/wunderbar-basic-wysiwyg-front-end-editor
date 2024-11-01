<?php 
//FUNCTIONS -- admin / settings
// 20191028 review
// 20170318 improved path and prefixes
// 20170202 add can edit comments; settings now appears in plugins list
// 20160917 fix to pass PHP error testing
// 20160730 revised to parse template files for validity
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

global $wunderbar_theme_is_title_compatible;

function wunderbar_add_admin_menu(  ) { 
	add_options_page( 'Wunderbar', 'The Wunderbar', 'manage_options', 'wunderbar', 'wunderbar_options_page' );
	}

function wunderbar_add_settings_link( $links ) {
	$settings_link = '<a href="options-general.php?page=wunderbar">Settings</a>';
	array_unshift( $links, $settings_link );
	return $links;
	}

function wunderbar_settings_init(  ) { 
	register_setting( 'pluginPage', 'wunderbar_settings' );

	add_settings_section(
		'wunderbar_pluginPage_section', 
		'Wunderbar General Settings', 
		'wunderbar_settings_section_callback', 
		'pluginPage'
		);

	add_settings_field( 
		'wunderbar_location', 
		'Where to place the Wunderbar:',
		'wunderbar_location_render', 
		'pluginPage', 
		'wunderbar_pluginPage_section' 
		);

	add_settings_field( 
		'wunderbar_non_editable_areas', 
		'List any uneditable areas<br/>(CSS identifiers, one per line):',
		'wunderbar_non_editable_areas_render', 
		'pluginPage', 
		'wunderbar_pluginPage_section' 
		);

	}

function wunderbar_location_render(  ) { 
	global $wunderbar_options;
	?>
	At the top <input type='radio' name='wunderbar_settings[wunderbar_location]' <?php checked('top', $wunderbar_options['wunderbar_location'], true ); ?> value='top'>
	&nbsp; <input type='radio' name='wunderbar_settings[wunderbar_location]' <?php checked('bottom', $wunderbar_options['wunderbar_location'], true ); ?> value='bottom'> At the bottom
	<?php
	}


function wunderbar_non_editable_areas_render(  ) { 
	global $wunderbar_options;
	?>
	<textarea cols='40' rows='5' name='wunderbar_settings[wunderbar_non_editable_areas]'><?php echo trim($wunderbar_options['wunderbar_non_editable_areas']); ?>
 	</textarea>
	<?php
	}


function wunderbar_settings_section_callback(  ) { 
//	$myplug= get_plugin_data( $plugin_file, $markup = true, $translate = true )
	echo 'This is where you set where and how Wunderbar will appear.';
	}


function wunderbar_rsearch($folder, $pattern) {
    $dir = new RecursiveDirectoryIterator($folder);
    $ite = new RecursiveIteratorIterator($dir);
    $files = new RegexIterator($ite, $pattern, RegexIterator::GET_MATCH);

    $fileList = array();
    foreach($files as $file) {
        $fileList = array_merge($fileList, $file);
	    }
    return $fileList;
    }
    

/////////// the part that displays it all ///////////////////
function wunderbar_options_page(  ) { 
	?>
	<table><tr><td>
	<form action='options.php' method='post'>

		<?php
		settings_fields( 'pluginPage' );
		do_settings_sections( 'pluginPage' );
		submit_button();
		?>

	</form>
	</td><td style="vertical-align:top">
		<br /><br /><div id="msgarea">
<h2>Welcome to Wunderbar 		<img src='<?php echo plugin_dir_url( __FILE__ ) . 'images/wb-editbug.png';?>'  /> Basic.</h2>
<p>Our online user guide can be visited at <a href='http://www.terra-virtua.com' target='_blank'>terra-virtua.com</a>.</p>
<hr>
<p>Wunderbar Basic allows you to edit pages quickly and easily from the front end of your website. <b>The full version of The Wunderbar</b> offers much, much more:  more editable areas, more formatting options, access to images and files, mobile optimized editing, and other terrifically useful features. </p>
<p><b><a href='http://www.terra-virtua.com/features' target='_blank'>Compare the basic and full editions here.</a></b></p>
		</div>
	</td></tr>
	<tr></td>
	</td></tr></table>
<?php 	} ?>