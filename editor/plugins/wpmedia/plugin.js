//worpdress media library plugin for ckeditor.wunderbar 20160601

CKEDITOR.plugins.add( 'wpmedia', {
    icons: 'wpmedia',
    init: function( editor ) {
        editor.addCommand( 'openWpMedia', {
        //what is our button's basic function?
            exec: function( editor ) {
				//define our custom uploader
				 custom_uploader = wp.media.frames.file_frame = wp.media({
					title: 'Choose Media Object',
					button: {
						text: 'Choose Media Object'
					},
					multiple: false
					});

				//event: When a file is selected, grab the URL and set it as the text field's value
				custom_uploader.on('select', function() {
					var attachment = custom_uploader.state().get('selection').first().toJSON();
					myfile=attachment.url;
					//obviously needs a huge rework....
					if (myfile.includes(".pdf") || myfile.includes(".docx")) {
						editor.insertHtml('<a href="' + myfile + '">' + myfile + '</a>' );
					} else {
						editor.insertHtml('<img src="' + myfile + '">' );
						}
					});

				//Open the uploader dialog
				custom_uploader.open();
            }
        });

		//what IS our button
        editor.ui.addButton( 'wpmedia', {
            label: 'Insert from Media library',
            command: 'openWpMedia',
            toolbar: 'insert'
        });
    }
});

