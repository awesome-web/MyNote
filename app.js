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
			if(this.current_tag)
				return this.notes[this.current_tag];
			else
				return null;
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
		removeTag : function(tag){
			if(tag == this.current_tag)
				var c = true;
			this.tags.splice(this.tags.indexOf(tag),1);
			if(c)
				if(this.tags)
					this.current_tag = this.tags[0];
			console.debug(this.current_tag);
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
		},
		removeTag : function(tag){
			model.removeTag(tag);
		}
	};

	var TagListView = {
		init : function(){
			this.tagList = document.getElementById('tag-list');
			if(controller.getTags())
				controller.setCurrentTag(controller.getTags()[0]);
			this.render();
		},
		render : function(){
			var tags = controller.getTags();
			this.tagList.innerHTML = "";
			if(tags){
				var elem;

				for(var i = 0;i < tags.length;i++){
					elem = document.createElement('li');
					elem.innerHTML = '<div class="row"><div class="col-4"><a href="#" class="tag-name">'
					+tags[i]
					+'</a></div><div class="col-1"><a href="#" class="edit-tag button">T</a></div><div class="col-1"><a href="#" class="delete-tag button">X</a></div></div>';
					if(tags[i] == controller.getCurrentTag())
						elem.className = "active";
					elem.addEventListener('click',(function(tagCopy) {
			            return function() {
			                controller.setCurrentTag(tagCopy);
			                TagListView.render();
							NoteListView.render();
							controller.setCurrentNote(null);
							NoteContentView.render();
			            };
			        })(tags[i]));
			        elem.firstChild.lastChild.firstChild.addEventListener('click',(function(tagCopy){
			        	return function(){
			        		controller.removeTag(tagCopy);
			        		TagListView.render();
			        	}
			        })(tags[i]));
					this.tagList.appendChild(elem);
				}
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
					if(notes[i] == controller.getCurrentNote())
						elem.className = "active";
					elem.addEventListener('click',(function(noteCopy) {
		                return function() {
		                    controller.setCurrentNote(noteCopy);
		                    NoteListView.render();
		                    NoteContentView.render();
		                };
		            })(notes[i]));
					this.noteList.appendChild(elem);
				}
			}
		}
	};

	var NoteContentView = {
		init : function(){
			this.noteContent = document.getElementById('note-content');
			this.noteName = document.getElementById('note-name');
			this.editButton = document.getElementById('edit-button');
			this.render();
		},
		render : function(){
			var note = controller.getCurrentNote();
			if(note){
				this.noteName.innerHTML = note.name;
				this.noteContent.innerHTML = note.content;
				this.editButton.innerHTML = '<a href="#" id="edit-note" class="button">Edit</a>';
				document.getElementById('edit-note').addEventListener('click',function(){
					NoteEditView.init();
				});
			}
			else{
				this.clear();
			}
		},
		clear : function(){
			this.noteName.innerHTML = "";
			this.noteContent.innerHTML = "";
			this.editButton.innerHTML ="";
		}
	};

	var NoteEditView = {
		init : function(){
			NoteContentView.clear();
			this.noteContent = document.getElementById('note-content');
		},
		render : function(){

		}
	};

	controller.init();
})(document);