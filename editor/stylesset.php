<?php 
//include "../secure-start.php";
//20160510 probably doesn't work right for wunderbar
//20140314 fix to path name. dammit.
//20140114 Build a list of custom styles that CKEDIT can use.
//examples:
// span.superscript {name: Superscript}
// 
// a.download { name: Download Link}
// a.button { name: Button}
// 
// table.ratechart {name:Rate Chart}


print "CKEDITOR.stylesSet.add( 'custom', [";

if (defined('wunderbar_customstyles_path') and file_exists($_SERVER[DOCUMENT_ROOT].wunderbar_customstyles_path)) {

	$ustyles=file($_SERVER[DOCUMENT_ROOT].wunderbar_customstyles_path);
	foreach ($ustyles as $ustyle) {
		$split=strpos($ustyle,'{');
		if ($split) {
			preg_match('#\{(.*?)\}#', $ustyle, $matches);
			$names=explode(':',$matches[1]);
			$elements=explode('.',substr($ustyle,0,$split-1));

			$output.= "\n{name: '".trim($names[1])."', element: '".trim($elements[0])."', attributes: { 'class': '".trim($elements[1])."' }},";

			}
		}
	}
print substr($output,0,-1);
print "]);";

?>
