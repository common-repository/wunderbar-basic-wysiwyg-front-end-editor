// WUNDERBAR front-end admin functionality

//	20170305 BASIC version
//	20160919 Fade adminbar help button as well.
//	20160810 found better place to add wbadmin class - html itself!!
//	20160714 refactor for simpler and more reliable saving 
//	20160518 flashy bit when saving.
//	20160513 trimmed down
//	20160409 WUNDERBAR

////////GLOBALS/////////////////
//console.log = function() {} //no console.logging

var currentEditAreaId='';
var klipStartingContent='';
var fadeout = null;
var timer =0;
var backend =  wpadminpath+'admin-ajax.php';
var thisEditor='';
var isDebug= false;	//show console.log messages

//establish SECTION elements, so compatible with IE8
if (!jQuery('section').parent().length) {document.createElement('section');}
 //force IE 9 & 10 to not automatically create hyperlinks when typing(!)
document.execCommand("AutoUrlDetect", false, false) 

//allow debugging, including IE8 console log fallback.
var debug = function(){};	//presume no debugging
if (isDebug) {	//unless they ask for it
	if (typeof console !== "undefined") {
		debug = console.log.bind(window.console); //basic debugging
	} else {	//but in old IE, just alerts.
		console = {};
		debug = function(msg) {alert(msg);};
		}
	}

/////////////now wbtv Stuff.../////////////
jQuery(document).ready(function() {
	debug('wb-admin starting');
    CKEDITOR.disableAutoInline = true;

	CKEDITOR.on( 'instanceReady', function( ev ) {
		ev.editor.dataProcessor.writer.setRules('br', {
		 indent: false,
		 breakBeforeOpen: false,
		 breakAfterOpen: true,
		 breakBeforeClose: false,
		 breakAfterClose: false
		});

		var blockTags = ['div','h1','h2','h3','h4','h5','h6','p','pre','ul','li'];
		var rules = {
		indent : false,
		breakBeforeOpen : false,
		breakAfterOpen : false,
		breakBeforeClose : false,
		breakAfterClose : true
		};

		for (var i=0; i<blockTags.length; i++) {
			ev.editor.dataProcessor.writer.setRules( blockTags[i], rules );
			}
		});

	//don't allow pasting of rich html into plaintext areas
	//which means don't allow paste at all in ie- 20140228
	jQuery('span.ekEditWrap').on('paste',function(e) {
		e.preventDefault();
		var text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..');
		document.execCommand('insertText', false, text);
		});


    CKEDITOR.on( 'dialogDefinition', function( ev ) {
    // Take the dialog name and its definition from the event data.
    var dialogName = ev.data.name;
    var dialogDefinition = ev.data.definition;
    // Check if the definition is from the dialog window you are interested in (the "Link" dialog window).
    if ( dialogName == 'link' ) {
        var infoTab = dialogDefinition.getContents( 'info' ); // Get the "Link Info" tab.
        var urlField = infoTab.get( 'protocol' );	//get protocol field
        urlField[ 'default' ] = '';
	    }
	});
	
	//create space for adminbar
	if (jQuery('#wunderbarAdmin').length==0) {jQuery('body').prepend('<div id="wunderbarAdmin"></div>');}
	
	jQuery.each( jQuery('.ekEditWrap.Approved'),function () {
		//add bugs with unique IDs , so we can fade out the current working one.
		jQuery("<span class='ekwrap'><span class='ekmenu'><a class='editbug approved' id='ED"+this.id+"' title='Edit "+jQuery(this).attr('data-contents')+"'>&nbsp;</a></span></span>").insertBefore(this);
		});

	jQuery.each( jQuery('.ekAddWrap.Approved'),function () {
		jQuery("<span class='ekwrap'><span class='ekmenu'><a class='addbug' id='ED"+this.id+"' title='Add "+jQuery(this).attr('data-contents')+"'>&nbsp;</a></span></span>").insertBefore(this);
		});

	//fade edit buttons in and out if leaving browser 
	jQuery("html").mouseenter(function(){
		jQuery(".ekmenu").fadeIn(); 
		jQuery(".ekomenu").fadeIn(); 
		jQuery("#wbcmds").fadeIn(); 
		wbcmds
		jQuery(".ekCurrentEditArea").animate({'outline-width': '2px'},'fast');
		}).mouseleave(function(){
		jQuery(".ekmenu").fadeOut();
		jQuery(".ekomenu").fadeOut();
		jQuery("#wbcmds").fadeOut(); 
		jQuery(".ekCurrentEditArea").animate({'outline-width': '0'},'fast');
		});

	//also fade buttons after a few seconds 
	jQuery(document).mousemove(function() {
		if (timer) { clearTimeout(timer); timer = 0; }
		jQuery('.ekmenu').stop(true,true).fadeIn(250);
		jQuery('.ekomenu').stop(true,true).fadeIn(250);
		jQuery('#wbcmds').stop(true,true).fadeIn(250);
		timer = setTimeout(function() {
			jQuery('.ekmenu').fadeOut(6000);
			jQuery('.ekomenu').fadeOut(6000);
			jQuery('#wbcmds').fadeOut(6000);
		}, 2000)
		})

	wunderbar_bugClick();

	//get the editorbar content to go into the admin area
	jQuery('html').addClass('wbadmin'); //add class to HTML to allow for admin style variations
	jQuery('#wunderbarAdmin').load(fullpath+"wb-adminbar.php?home="+fullpath,
	function() {
		if (wunderbar_location=='bottom') {jQuery('html').addClass('wbadminbottom');} //move eklipseadmin to bottom
		jQuery('#wunderbarAdmin').css('display','block');
		thisEditor= CKEDITOR.inline( 'fakeeditarea');	//20160707 start the editor in a hidden area.
		}
		);  //end of post-editbar load

	});
/////////// END OF SETUP //////////////////


///////////called on pageload and when klip is saved./////////////
function wunderbar_bugClick() {
		//now create text-editing click events
	debug('restore bug clickability');
	jQuery('.editbug,.addbug').click( function (event) {
		debug('click',this.id.substring(2));
		event.stopImmediatePropagation();

		//disable hyperlinking on any enclosing object, so we can click around on THIS
		parentlink = jQuery("#"+this.id.substring(2)).closest('a');
		if (parentlink.attr('href')!=undefined) {parentlink.attr('data-href',parentlink.attr('href')).removeAttr('href');}

		wunderbar_startEdit(this.id.substring(2));
		return false	//prevent click from propogating up
		});

	//now create text-editing click events
	jQuery('.ekEditWrap').dblclick( function(event){
		event.stopImmediatePropagation();

		//disable hyperlink on any enclosing object, so we can click around on THIS one
		parentlink = jQuery("#"+this.id).closest('a');
		if (parentlink.attr('href')!=undefined) {parentlink.attr('data-href',parentlink.attr('href')).removeAttr('href');}

		wunderbar_startEdit(this.id);
		return false;	//prevent click from propogating up
		});
	}


///////////called when user clicks an editbug/////////////
	
function wunderbar_startEdit(newEditAreaId) {

	jQuery('body').unbind('keyup');
	jQuery('.ekEditWrap').off("dblclick");

	//bypass almost all of it if we're in klip-edit; just note what we're editing in case we switch modes
	debug('In Edit, editing' , newEditAreaId); 
	
	//if we're SWITCHING panels, first save the edits of what we're switching FROM
	if (currentEditAreaId>"") {wunderbar_saveEdit(true,true);return;}
	newEditArea = jQuery('#'+newEditAreaId);	//shortcut to our to-be-edited element 

	//insert previous posts list into dropdown
	jQuery("#wunderbar_action_menu .history").load(backend, { action:'wunderbar-getpast', wbtvi: newEditAreaId});

	//get content from the database, NOT proccessing any extensions if html. If Markdown, keep it that way, & no editbugs either
	jQuery.post(backend,
		{ action:'wunderbar-getpost', wbtvi: newEditAreaId},
		function(data) {
			newEditArea.attr('klipencode', data['fieldEncode']);
			newEditArea.html(data['fieldData']);	//insert partially-marked up content into the area.

			//if there is an outside ENCLOSING link (like a menu), turn it off so we can edit...
			jQuery('#ED'+newEditAreaId).css('visibility','hidden'); //and hide our edit bug
			newEditArea.addClass('ekCurrentEditArea');	//decorate us

			//also focus on us
			currentEditAreaId=newEditAreaId;			//this now becomes the last thing we worked on

			if (data['fieldEncode'] =="H") {	//show edit panel if HTML
				klipStartingContent = data['fieldData']; 	//retain pure starting inner content from database to compare later if user made changes.
				thisEditor= CKEDITOR.inline( newEditAreaId);
				// with the editor is loaded, we can add custom escape-key exit
				thisEditor.addCommand('requestForSave', {exec : function(editor, data) {wunderbar_saveEdit(true,true);}});
				// Then, we bind command to escape key
				thisEditor.keystrokeHandler.keystrokes[27 ] = 'requestForSave';
				thisEditor.on( 'simpleuploads.endUpload', function( ev ) { jQuery("#klipEditCommands").css('visibility','visible');  });
				thisEditor.on( 'simpleuploads.startUpload', function( ev ) { jQuery("#klipEditCommands").css('visibility','hidden');   });
				jQuery("#cke_1_top").css('width','auto'); //after the first (fake) edit, allow the panel a natural size
			} else {
				if (thisEditor!=null && typeof(thisEditor)=='object') {thisEditor.destroy();thisEditor=null;} //only if CKEDITOR to start with (esp. fake one)
				klipStartingContent = newEditArea.html(); 	//retain starting inner content modified by browser to compare later if user made changes.
				jQuery("body").keyup(function(key) {	
					if (key.which==27) {wunderbar_saveEdit(true,true)}
					});
				}
			wunderbar_editPanel(true) // show editing panels
			newEditArea.attr('contenteditable','true');
			debug('editing: ',currentEditAreaId,'type',newEditArea.attr('klipencode'));
			newEditArea.focus();
			//if this is a new area, then select all of any default text
			if (newEditArea.hasClass('ekAddWrap')) {document.execCommand('selectAll', false, null);}

			jQuery( window ).unload(function() {
				wunderbar_revertEdit(); //eXterminate any freshly created working copy if they suddenly exit w/o saving
				});
				
			},
		'json'
		);
	}



//figure out the parents of our current area, so we can uniquely identify this as uneditable
function wunderbar_disallowEdit() {
	if (!currentEditAreaId) {return;}
	currentEditArea=jQuery('#'+currentEditAreaId);
	parent=currentEditArea.parent();
	p3 = p2 =p1 =c3 =c2 = c1 = '';
	p1 = parent.get(0).tagName;
 	parent = parent.parent();
 	p2 = parent.get(0).tagName;
 	c2 = parent.attr('class'); if (typeof(c2)=='undefined') {c2='';}
 	i2 = parent.attr('id'); if (typeof(i2)=='undefined') {i2='';}
 	parent = parent.parent();
 	p3 = parent.get(0).tagName;
 	c3 = parent.attr('class');  if (typeof(c3)=='undefined') {c3='';}
 	i3 = parent.attr('id'); if (typeof(i3)=='undefined') {i3='';}
 	parent = parent.parent();
 	p4 = parent.get(0).tagName;
 	c4 = parent.attr('class'); if (typeof(c4)=='undefined') {c4='';}
 	i4 = parent.attr('id'); if (typeof(i4)=='undefined') {i4='';}
 	if (i4+i3+i2+c4+c3+c2=='') {
 		alert ("Sorry, I can't see enough classes or IDs to make this an un-editable area.");
 		return;
 		}
	//ids take priority over classes
	//!!!!TODO: classses need to have spaces replaced with periods
	e4 = i4 ? ("#"+i4) : (c4 ? ("."+c4) :''); e4 = e4 + " > ";
	e3 = i3 ? ("#"+i3) : (c3 ? ("."+c3) :''); e3 = e3 + " > ";
	e2 = i2 ? ("#"+i2) : (c2 ? ("."+c2) :''); e2 = e2 + " > ";
	//no need for level above if we have ID below
	if (i3) {p4=''; e4='';} 
	if (i2) {p4=''; e4=''; p3=''; e3=''} 
	disallowedArea = p4 + e4 + p3 + e3 + p2 + e2 + p1;
	response = confirm ("Really disallow editing of '"+disallowedArea+"'?\n (You can re-allow this later by changing the Wunderbar settings.)" );
	if (response == true) {
		jQuery.post(
			backend,
			{action:'wunderbar-updateoption', oname: 'wunderbar_non_editable_areas', oval: disallowedArea, mult: true},
			function(success) {document.location.reload(true); },
			'json'
			);	//post function
		}
	}


//////////called when switching klip edits or escaping  or pressing save .
function wunderbar_saveEdit(confirmDialog, changeDate) {
	if (!currentEditAreaId) {return;}
	debug('Entering wunderbar_saveEdit');

	currentEditArea=jQuery('#'+currentEditAreaId);
	currentEditArea.blur();
	if (thisEditor!=null && typeof(thisEditor)=='object' ) {
		klipNewContent = thisEditor.getData().trim(); //get CKEditors nicely formatted HTML, not what the browser wants to give us. 
		needsSaving= thisEditor.checkDirty();
	} else {
		klipNewContent = currentEditArea.html(); //semantic - just get the new content 
		klipNewContent = klipNewContent.replace(/<br><\//g,'</'); //remove brs before closing tags (firefox only?)
		klipNewContent = klipNewContent.replace(/<br>([^\n])/g,'<br>\n$1'); //add nls to brs that need 'em (firefox only?) 20140806
		needsSaving= (klipNewContent != klipStartingContent);
		}

 	if (needsSaving) {
		if (!confirmDialog) {
			wunderbar_postChanges(klipNewContent); 
			return;
			}
		//otherwise ask what's to be done.
		var response = confirm("Save these Edits?");
		if (response) {	//save the changes back to database via json; let it return the new parsed data
			wunderbar_postChanges(klipNewContent);
		} else {
			wunderbar_revertEdit();
		}	// prompt response
	} else {
		wunderbar_revertEdit();
		}
	debug('Leaving wunderbar_saveEdit');
	}	//exitedit


function wunderbar_postChanges( klipNewContent) {
	console.log ('SAVE SELECTED: ',currentEditAreaId);
	currentEditArea=jQuery('#'+currentEditAreaId);

	currentEditArea.css('box-shadow','0 0 50px #ff0').animate({boxShadow: '0 0 30px #44f'}).animate({boxShadow: '0 0 0 #000'}).removeClass('ekCurrentEditArea');	//decorate us
	jQuery('#ED'+currentEditAreaId).css('visibility','visible');	//restore editbug

	currentEditArea.removeAttr('contenteditable');
	if (thisEditor!=null && typeof(thisEditor)=='object' ) {thisEditor.destroy();thisEditor=null;} //only if CKEDITOR to start with

 	klipNewContent = klipNewContent.replace(/<BR>/g,'<br />'); //replace non xhtml brs
 	klipNewContent = klipNewContent.replace(/<br>/g,'<br />'); //replace non xhtml brs

	var visibles={};	//an array of the "visible" (ie markdown or html) fields 
	visibles[currentEditAreaId] = klipNewContent.replace(/'/g,"&#39;") ; //escape single-quotes
	
	updatedate='';	//are we updating the last-changed-date as well? usually not.

	jQuery.post(backend,
		{action:'wunderbar-putpost',
		wbtvi: JSON.stringify(visibles),
		wbtvu: JSON.stringify(updatedate)
		},
		function(data) {
			jQuery('#'+currentEditAreaId).html(data['fieldData']);	//insert  content into the area.
			//re-add editbugs and addbugs in front of each editable area.
			jQuery.each( jQuery('#'+currentEditAreaId+' .ekEditWrap.Approved'),function () {
				//add bugs with unique IDs , so we can fade out the current working one.
				jQuery("<span class='ekwrap'><span class='ekmenu'><a class='editbug' href='#' id='ED"+this.id+"' title='Edit "+jQuery(this).attr('data-contents')+"'>&nbsp;</a></span></span>").insertBefore(this);
				});

			jQuery.each( jQuery('#'+currentEditAreaId+' .ekAddWrap.Approved'),function () {
				jQuery("<span class='ekwrap'><span class='ekmenu'><a class='addbug' href='#' id='ED"+this.id+"' title='Edit "+jQuery(this).attr('data-contents')+"'>&nbsp;</a></span></span>").insertBefore(this);
				});

			wunderbar_bugClick();	//restore all editbugs including those that were SHOWn
			wunderbar_afterSave();
			},
		'json'
		);	//post function
	}


/////////////after cancelling edit
function wunderbar_revertEdit() {
	if (!currentEditAreaId) {return;}
	currentEditArea=jQuery('#'+currentEditAreaId);
	wunderbar_reloadContent(currentEditAreaId);	//reLoad the fully-parsed content
	wunderbar_afterSave();
	}


/////////////after saving - or cancelling - edit
function wunderbar_afterSave() {
	currentEditArea.removeClass('ekCurrentEditArea');	//undecorate us
	jQuery('#ED'+currentEditAreaId).css('visibility','visible');	//restore editbug
	currentEditArea.removeAttr('contenteditable');
	if (thisEditor!=null && typeof(thisEditor)=='object') {thisEditor.destroy();thisEditor=null;} //only if CKEDITOR to start with
	parentlink = jQuery("#"+currentEditAreaId).closest('a');
	if (parentlink.attr('data-href')!=undefined) {
		parentlink.attr('href',parentlink.attr('data-href')).removeAttr('data-href');
		}
	currentEditAreaId="";
	debug('Exiting wunderbar_afterSave');
	wunderbar_editPanel(false); //turn off wunderbar_editPanel
	}


///////////called when user asks for an old version/////////////
function wunderbar_revertPost(newEditAreaId,oldPost) {
	newEditArea = jQuery('#'+newEditAreaId);	//shortcut to our to-be-edited element 
	jQuery.post(backend,
		{action:'wunderbar-getpost', wbtvi: newEditAreaId, wbtvh:oldPost},
		function(data) {
			newEditArea.attr('klipencode', data['fieldEncode']);
			newEditArea.html(data['fieldData']);	//insert partially-marked up content into the area.
			},
		'json'
		);
	}	//wunderbar_revertPost function


//////////reload the marked up data from the database fully into the given element
function wunderbar_reloadContent(elementId, klipDate){
	// might also do cleanup on it.
	if(klipDate === undefined || klipDate === null) {klipDate='';}
	jQuery.post(backend,
		{action:'wunderbar-getpost', wbtvi: currentEditAreaId, wbtvf:'display'},
		function(data) {
			debug('reloading');
//			debug(data['fieldData']);
			
			jQuery('#'+elementId).html(data['fieldData']);	//insert  content into the area.
			//re-add editbugs and addbugs in front of each editable area.
			jQuery.each( jQuery('#'+elementId+' .ekEditWrap.Approved'),function () {
				//add bugs with unique IDs , so we can fade out the current working one.
				jQuery("<span class='ekwrap'><span class='ekmenu'><a class='editbug' href='#' id='ED"+this.id+"' title='Edit "+jQuery(this).attr('data-contents')+"'>&nbsp;</a></span></span>").insertBefore(this);
				});

			jQuery.each( jQuery('#'+elementId+' .ekAddWrap.Approved'),function () {
				jQuery("<span class='ekwrap'><span class='ekmenu'><a class='addbug' href='#' id='ED"+this.id+"' title='Edit "+jQuery(this).attr('data-contents')+"'>&nbsp;</a></span></span>").insertBefore(this);
				});

			wunderbar_bugClick();	//restore all editbugs including those that were SHOWn
			},
		'json'
		);
	}


//turn on or off the edit panel
function wunderbar_editPanel(visibility) {
	editorstatus='hidden'; adminstatus='visible';
	if (visibility=='show' || visibility==true) {editorstatus='visible';adminstatus='hidden';}
	jQuery("#wunderbarAdmin .interface").css('visibility',editorstatus);
	jQuery("#wunderbarAdmin .editor").css('visibility',editorstatus);
	jQuery("#wunderbarAdmin #wunderbarlogo").css('visibility',adminstatus);
	jQuery("#wunderbarAdmin #klipAdminPanel").css('visibility',adminstatus);
	}