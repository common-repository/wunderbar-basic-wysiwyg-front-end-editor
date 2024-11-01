/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/editor-oss-license
 */

 // 20191022 miminal edit
 // 20190318 including background colors
 // 20190305 updated to new 4.11 build of ckeditor; color picker
 // 20170718 wunderbar revised - restored media library

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.


	config.allowedContent = true;
	config.uiColor = '#000000';
	config.filebrowserBrowseUrl = fullpath+"/editor/fileman/index.html";
	config.filebrowserImageBrowseUrl = fullpath+"/editor/fileman/index.html";
	config.filebrowserWindowWidth = 500;
	config.filebrowserWindowHeight = 650;
	config.filebrowserImageUploadUrl = wpadminpath+'admin-ajax.php?action=wunderbar-object';
	config.filebrowserUploadUrl = wpadminpath+'admin-ajax.php?action=wunderbar-object';
	config.pasteFromWordRemoveFontStyles = true;
	config.disableNativeSpellChecker = false;
	config.sharedSpaces= {top: 'klipEditPanel',bottom: 'klipEditBottom'};
	config.fillEmptyBlocks = false;
		config.dataIndentationChars = ' ';
		config.htmlEncodeOutput = false;
		config.entities = false;
	config.skin='wunderbar';

	config.extraPlugins='simpleuploads,media,wpmedia,div,htmlsource';
	config.removePlugins='sourcedialog';
	config.simpleuploads_acceptedExtensions = "pdf|xls|xlsx|ppt|pptx|doc|docx|jpeg|gif|jpg|png|svg|zip";

	config.stylesheetParser_validSelectors = /\^(xxxxxxxx)\.\w+/; // basically, disable stylesheetparser
	config.stylesSet = 'default:stylesset.php';

    config.line_height="normal;.8em;.9em;1em;1.1em;1.2em;1.3em;1.4em;1.5em;1.75em;2em;2.5em;3em";
	config.fontSize_sizes = '50%;60%;70%;80%;90%;95%;105%;110%;120%;130%;140%;150%;175%;200%;300%';

	config.removeDialogFields = 'table:info:txtSummary';

	config.qtRows = '8';
	config.qtColumns = '8';
	config.qtWidth = ' ';
	config.qtBorder = '0';
	config.qtStyle = {'min-width' : '50px' };

	config.font_names= 'Georgia Family/Georgia, serif;' +
		'Times Family/\"Times New Roman\", Times, serif;' + 
		'Palatino Family/\"Palatino Linotype\", Palatino, \"Book Antiqua\", serif;' +
		'Baskerville Family/Baskerville,\"Bookman Old Style\", \"Times New Roman\", Times, serif;' +
		'Arial Family/Arial, Helvetica, sans-serif;' +
		'Arial Narrow/\"Arial Narrow\", \"Helvetica-Narrow\", Arial, helvetica, sans-serif;' +
		'Arial Black/\"Arial Black\",Arial, helvetica, sans-serif;' +
		'Tahoma Family/Tahoma,\"Trebuchet MS\",sans-serif;'+
		'Verdana Family/Verdana, sans-serif;' +
		'Trebuchet Family/\"Trebuchet MS\", Trebuchet, sans-serif;' +
		'Gill Family/\"Gill Sans\",\"Gill sans MT\", Corbel, Tahoma, sans-serif;' +
		'Impact Family/Impact, Haettenschweiler, fantasy;' +
		'Century Family/\"Century Gothic\",Futura, sans-serif;' +
		'Courier Family/\"Courier New\", Courier, monospace;' +
		'Lucida Family/\"Lucida Sans Unicode\", \"Lucida Console\", \"Lucida Grande\", \"Lucida Sans Typewriter\",\"Lucida Sans\", monospace;' +
		'Chancery Family/\"Apple Chancery\", \"Monotype Corsiva\",\"Zapf Chancery\", \"Georgia Italic\", cursive; font-style:italic;' +
		'ComicSans Family/\"Comic Sans MS\", \"Chalkboard\", \"Marker Felt\", fantasy;'

	config.colorButton_colors =
    '000,800000,8B4513,2F4F4F,008080,000080,4B0082,696969,' +
    'B22222,A52A2A,DAA520,006400,40E0D0,0000CD,800080,808080,' +
    'F00,FF8C00,FFD700,008000,0FF,00F,EE82EE,A9A9A9,' +
    'FFA07A,FFA500,FFFF00,00FF00,AFEEEE,ADD8E6,DDA0DD,D3D3D3,' +
    'FFF0F5,FAEBD7,FFFFE0,F0FFF0,F0FFFF,F0F8FF,E6E6FA,FFF,' +
	'8aa6bf,2f4659,3d3e40,f2ae72,f3d3aa,f28d77';

	config.toolbar= [
		[ 'Bold', 'Italic'],
		[ 'BulletedList', 'NumberedList', '-',  'Indent','Outdent', 'Blockquote','-', 'JustifyLeft' , 'JustifyRight', 'JustifyCenter', 'JustifyBlock'],
		[ 'Format' , 'Font', 'FontSize' ,'lineheight'],
		[ 'TextColor','BGColor','CopyFormatting','RemoveFormat'],
		[ 'Link', 'Unlink','-','Anchor' ],
		[ 'Table','HorizontalRule', 'SpecialChar','CreateDiv' ],
		['ShowBlocks','Find', 'PasteFromWord','PasteText','htmlsource' ] 
		];


//needed?
//customize dialog boxes
config.removeDialogFields = 'table:info:txtSummary';
config.dialogFieldsDefaultValues = {
	table: {
		info: {
			txtWidth : '',
			txtCellSpace : '0',
			txtBorder : '0',
			txtCellPad : '0'
			}
		}
	}; 

	};


//////////////////////////////////////////////

var roxyFileman = '/fileman/index.html'; 
$(function(){
	if (document.getElementById('xx') !== null) {
	   CKEDITOR.replace( 'editor1',{filebrowserBrowseUrl:roxyFileman,
                                filebrowserImageBrowseUrl:roxyFileman+'?type=image',
                                removeDialogTabs: 'link:upload;image:upload'}); 
		}
	});
