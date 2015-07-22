(function() {
	// body...
	var model = {
		current_tag : null,
		current_note : null,
		tags : ["Alice","Bob","Cindy","David"],
		notes : {
			"Alice" : [
			{
				name : "Hello",
				content : "Hello,world"
			},
			{
				name : "Hi",
				content : "Hi,world"
			}
			],
			"Bob" : [
			{
				name : "Bye",
				content : "Bye,world"
			},
			{
				name : "Goodbye",
				content : "Goodbye,world"
			}
			]
		},
		init : function(){

		},
		getNotes : function(){
			return this.notes[model.current_tag];
		},
		getTags : function(){
			return this.tags;
		},
		addNote : function(){

		},
		removeNote : function(){

		},
		updateNote : function(){

		},
		addTag : function(){

		},
		removeTag : function(){

		},
		updateTag : function(){

		},
		getCurrentTag : function(){
			return this.current_tag;
		},
		getCurrentNote : function(){
			return this.current_note;
		},
		setCurrentTag : function(tag){
			this.current_tag = tag;
		},
		setCurrentNote : function(note){
			this.current_note = note;
		}
	};

	var controller = {
		init : function(){
			model.init();
			TagListView.init();
			NoteListView.init();
			NoteContentView.init();
		},
		getNotes : function(){
			return model.getNotes();
		},
		getTags : function(){
			return model.getTags();
		},
		getCurrentTag : function(){
			return model.getCurrentTag();
		},
		getCurrentNote : function(){
			return model.getCurrentNote();
		},
		setCurrentTag : function(tag){
			model.setCurrentTag(tag);
		},
		setCurrentNote : function(note){
			model.setCurrentNote(note);
		}
	};

	var TagListView = {
		init : function(){
			this.tagList = document.getElementById('tag-list');
			this.render();
		},
		render : function(){
			var tags = controller.getTags();
			this.tagList.innerHTML = "";
			var elem;

			for(var i = 0;i < tags.length;i++){
				elem = document.createElement('li');
				elem.innerHTML = '<a href="#">'+tags[i]+'</a>';
				elem.addEventListener('click',(function(tagCopy) {
		            return function() {
		                controller.setCurrentTag(tagCopy);
						NoteListView.render();
						controller.setCurrentNote(null);
						NoteContentView.render();
		            };
		        })(tags[i]));

				// elem.addEventListener('click',function(evt){
				// 	var tags = TagListView.tagList.childNodes;
				// 	for(var i = 0;i < tags.length;i++){
				// 		tags[i].firstChild.style['background-color'] = 'black';
				// 		tags[i].firstChild.style.color = 'gray';
				// 	}
				// 	evt.target.style['background-color'] = 'gray';
				// 	evt.target.style.color = 'white';	
				// });
				this.tagList.appendChild(elem);
			}
		}
	};

	var NoteListView = {
		init : function(){
			this.tagName = document.getElementById('note-tag');
			this.noteList = document.getElementById('note-list');
			this.render();
		},
		render : function(){
			var notes = controller.getNotes();
			this.tagName.innerHTML = controller.getCurrentTag();
			this.noteList.innerHTML = "";
			var elem;
			if(notes){	
				for(var i = 0;i < notes.length;i++){
					elem = document.createElement('li');
					elem.innerHTML = '<a href="#"><h3>'+notes[i].name+'</h3>'+notes[i].content+'</a>';
					elem.addEventListener('click',(function(noteCopy) {
		                return function() {
		                    controller.setCurrentNote(noteCopy);
		                    NoteContentView.render();
		                };
		            })(notes[i]));
		   //          elem.addEventListener('click',function(evt){
					// var notes = NoteListView.noteList.childNodes;
					// for(var i = 0;i < notes.length;i++){
					// 	notes[i].style['background-color'] = '#ebebeb';
					// 	notes[i].style.border = 'none';
					// }
					// evt.target.style['background-color'] = 'white';
					// evt.target.style.border = '1px #33eeff solid';
					// });
					this.noteList.appendChild(elem);
				}
			}
		}
	};

	var NoteContentView = {
		init : function(){
			this.noteContent = document.getElementById('note-content');
			this.noteName = document.getElementById('note-name');
			this.render();
		},
		render : function(){
			var note = controller.getCurrentNote();
			if(note){
				this.noteName.innerHTML = note.name;
				this.noteContent.innerHTML = note.content;
			}
			else{
				this.noteName.innerHTML = "";
				this.noteContent.innerHTML = "";
			}
		}
	};

	var NoteEditView = {
		init : function(){

		},
		render : function(){

		}
	};

	controller.init();
})(document);