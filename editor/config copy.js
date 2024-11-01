/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */
// 20170219 minimal toolbar for mobile phones

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'links' },
		{ name: 'insert' },
		{ name: 'forms' },
		{ name: 'tools' },
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others' },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'about' }
	];



	// Define changes to default configuration here. For example:
	config.allowedContent = true;
	config.uiColor = '#111111';
	config.filebrowserBrowseUrl = fullpath+"/editor/fileman/index.html";
	config.filebrowserImageBrowseUrl = fullpath+"/editor/fileman/index.html";
//	config.filebrowserBrowseUrl = wpadminpath+'admin-ajax.php?action=wunderbar_object';
//	config.filebrowserImageBrowseUrl = wpadminpath+'admin-ajax.php?action=wunderbar_object';
	config.filebrowserWindowWidth = 500;
	config.filebrowserWindowHeight = 650;
//	config.filebrowserImageUploadUrl = fullpath+"/wunderbar_object.php";
//	config.filebrowserUploadUrl = fullpath+ "/wunderbar_object.php";
	config.filebrowserImageUploadUrl = wpadminpath+'admin-ajax.php?action=wunderbar-object';
	config.filebrowserUploadUrl = wpadminpath+'admin-ajax.php?action=wunderbar-object';
	
	config.removePlugins= 'floatingspace,resize,image2,widget,oembed';
	config.extraPlugins= 'sharedspace,simpleuploads,dragresize,sourcedialog,div,indent,indentlist,indentblock,tabletools,tableresize,dialogadvtab,confighelper,lineheight,richcombo,font,justify,find,colorbutton,colordialog,wpmedia,texttransform';
	config.sharedSpaces= {top: 'klipEditPanel',bottom: 'klipEditBottom'};
	config.skin='wunderbar';
	config.fillEmptyBlocks = false;
	config.stylesSet = 'custom:../editor/stylesset.php';
	config.simpleuploads_acceptedExtensions = "pdf|xls|xlsx|ppt|pptx|doc|docx|jpeg|gif|jpg|png|zip";
	config.format_tags="p;h1;h2;h3;h4;h5;h6;inline";
	config.format_inline = { element : 'p', name: 'Unformatted', styles: { display: 'inline'} };
	config.format_p = { element : 'p', name: 'Normal', styles: {display: 'block'} };

    config.line_height="normal;1em;1.1em;1.2em;1.3em;1.4em;1.5em;1.5em;2em;2.5em;3em";

	config.font_names='Georgia Family/Georgia, serif;' +
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
		'ComicSans Family/\"Comic Sans MS\", \"Chalkboard\", \"Marker Felt\", fantasy;' +
		'SimSun Chinese/Arial, 宋体, SimSun, Helvetica, tahoma, verdana, sans-serif, 华文细黑, STXihei;' +
		'Ya Hei Chinese/Tahoma, \"Microsoft YaHei New\", \"Microsoft Yahei\",\"微软雅黑\", Arial, Helvetica, sans-serif, STXihei, 华文细黑;' +
		'FangSong Chinese/Georgia, \"FangSong\", \"仿宋\", \"Times New Roman\", serif, STFangSong, \"华文仿宋\";' +
		'KaitTi Chinese/Georgia, \"KaiTi\", \"楷体\", \"Times New Roman\", serif, STKaiti, \"华文楷体\"'


if (/iPhone|Android/i.test(navigator.userAgent)) {
	config.toolbar= [
		[ 'Bold', 'Italic','BulletedList', 'NumberedList', 'Format'],
		[ 'Link', 'Unlink', 'wpmedia', 'Image', 'Table' ]
		];
} else {
	config.toolbar= [
		[ 'Bold', 'Italic', 'TransformTextSwitcher' ],
		[ 'BulletedList', 'NumberedList', '-',  'Indent','Outdent', '-', 'Blockquote','-', 'JustifyLeft' , 'JustifyRight', 'JustifyCenter', 'JustifyBlock'],
//		[ 'Styles', 'Format' , 'Font', 'FontSize' ,'lineheight','TextColor'],
		[ 'Format' , 'Font', 'FontSize' ,'lineheight'],
		[ 'TextColor','BGColor','RemoveFormat'],
		[ 'Link', 'Unlink', '-', 'Anchor' ],
		[ 'addImage','addFile','wpmedia', 'Image', 'Table', 'HorizontalRule', 'SpecialChar','CreateDiv' ],
		[ 'Find', 'Replace' ,  'PasteFromWord','PasteText','Sourcedialog' ] 
		];
    }

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
	
	//add custom editor config if one was defined in eklipse_overlays.
// 	if (ek_customconfig>''){ config.customConfig =ek_customconfig;}

};

var roxyFileman = '/fileman/index.html'; 
jQuery(function(){
   CKEDITOR.replace( 'editor1',{filebrowserBrowseUrl:roxyFileman,
                                filebrowserImageBrowseUrl:roxyFileman+'?type=image',
                                removeDialogTabs: 'link:upload;image:upload'}); 
});

