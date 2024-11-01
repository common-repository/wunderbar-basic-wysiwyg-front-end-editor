<?php 
//20191031 fix path to wbar graphic
//20171219 sanitize $home https://packetstormsecurity.com/files/145434/WordPress-Wunderbar-Basic-1.1.3-Cross-Site-Scripting.html
//20170317 Tweak to minimize chance of direct call
//20170305 BASIC edition
//20170220 delete comments
//20160919 help link from the logo
//20160707 fake edit area to start with
//20160706 disallow editing option
//20160701 cleanup and eklipse feature removal
//20160525 history comes back
//20160414 Wunderbar further.
//20160410 Wunderbar version.
//20151012 usertable rethunk
//20130522 now with some privileges installed.
// if ( !$_GET['home'] ) exit; // Exit if accessed directly
// $home = filter_input(INPUT_GET, 'home', FILTER_SANITIZE_SPECIAL_CHARS);

//derive our current directory
$http = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on'? "https://" : "http://";
$path= explode('?',$_SERVER['REQUEST_URI']);
$home = dirname($http . $_SERVER["SERVER_NAME"] . $path[0])."/";

?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
</head>
<body>
<div id="wbinterior" >
<div id="wunderbarlogo"  >
	<a class='wblogobutton thickbox' title='Wunderbar Help' href='<?php echo $home ?>help.html?width=500&height=300&TB_iframe=true' target='_blank'>
		<img src="<?php echo $home ?>images/wbbasic-logo-rev.png" alt="Wunderbar Basic" />
		<span id='wbcmds'>HELP / UPGRADE</span>
	</a>
	</div>
<div id="fakeeditarea" style='display:none'></div>
	
<div id="klipEditIntro"  >
	<div id="klipEditCommands" class="interface" >
		<?php 
		$action= 'onClick="wunderbar_saveEdit(false,true)"';
		print "<div class='button'><a class='save' $action> &#10003; SAVE</a></div>\n";
		?>
		<div class="button"><a><span class='arrow-down'></span></a>
			<ul id="wunderbar_action_menu">  
				<li><a onClick="wunderbar_revertEdit()">Undo Current Editing</a></li>  
				<li><a onClick="wunderbar_disallowEdit()">Disallow Editing in this Area</a></li>  
				<li class='divider '></li>
				<section class='history'></section>
				</ul> 
			</div> 
		</div>
	</div>
<div id="klipEditPanel"></div>
<div id="klipEditBottom" class="editor"></div>
</div>
</body>
</html>