(function() {
	// body...
	var model = {
		current_tag : null,
		current_note : null,
		is_current_tag : false,
		is_current_note : false,
		notes : {
			"Alice" : [
			{
				name : "Hello",
				content : "The Object constructor creates an object wrapper for the given value. If the value is null or undefined, it will create and return an empty object, otherwise, it will return an object of a Type that corresponds to the given value. If the value is an object already, it will return the value.When called in a non-constructor context, Object behaves identically to new Object()."
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
			],
			"Cindy" : [],
			"David" : []
		},
		tags : [],
		init : function(){
			Object.keys(this.notes).forEach(function(tag){
				model.tags.push(tag);
			});
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
		removeNote : function(note){
			this.isCurrentNote(note);
			var arr = this.notes[this.current_tag];
			arr.splice(arr.indexOf(note),1);
			if(this.is_current_note)
				this.current_note = null;
		},
		updateNote : function(){

		},
		addTag : function(tag){
			if(this.notes[tag])
				alert("This tag exists!");
			else{
				this.tags.push(tag);
				this.notes[tag] = [];
			}
		},
		removeTag : function(tag){
			this.isCurrentTag(tag);
			this.tags.splice(this.tags.indexOf(tag),1);
			delete this.notes[tag];
			if(this.is_current_tag && this.tags)
				this.current_tag = this.tags[0];
		},
		updateTag : function(tag,value){
			if(tag == value){
				return;
			}
			else if(this.notes[value]){
				alert("This tag exists!");
			}
			else{
				this.isCurrentTag(tag);
				this.tags[this.tags.indexOf(tag)] = value;
				this.notes[value] = this.notes[tag];
				delete this.notes[tag];
				if(this.is_current_tag)
					this.setCurrentTag(value);
			}
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
		},
		isCurrentTag : function(tag){
			this.is_current_tag = (tag == this.current_tag);
		},
		isCurrentNote : function(note){
			this.is_current_note = (note == this.current_note);
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
		},
		removeNote : function(note){
			model.removeNote(note);
		},
		updateTag : function(tag,value){
			model.updateTag(tag,value);
		},
		addTag : function(tag){
			model.addTag(tag);
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
				for(var i = 0;i < tags.length;i++){
					this.newTag(tags[i]);
				}
			}
			var add_tag = function(){
				var elem = TagListView.newTag('');
				elem.firstChild.firstChild.innerHTML = '<input type="text" id="edit-tag" required="required" autofocus="autofocus" onfocus="this.select()" />';
				document.getElementById('edit-tag').addEventListener('keyup',function(e){
					if(e.keyCode == 13){
						controller.addTag(this.value);
						TagListView.render();
					}
				});
				this.removeEventListener('click',add_tag);
			};
			document.getElementById('add-tag').addEventListener('click',add_tag);
		},
		newTag : function(tag){
			var elem = document.createElement('li');
			elem.innerHTML = '<div class="row"><div class="col-4"><a href="#" class="tag-name">'
			+tag
			+'</a></div><div class="col-1"><a href="#" class="edit-tag button">T</a></div><div class="col-1"><a href="#" class="delete-tag button">X</a></div></div>';
			if(tag == controller.getCurrentTag())
				elem.className = "active";
			elem.firstChild.firstChild.firstChild.addEventListener('click',(function(tagCopy) {
	            return function() {
	                controller.setCurrentTag(tagCopy);
	                TagListView.render();
					NoteListView.render();
					controller.setCurrentNote(null);
					NoteContentView.render();
	            };
	        })(tag));
	        elem.firstChild.firstChild.nextSibling.addEventListener('click',(function(tagCopy){
	        	return function(){
        		this.previousSibling.innerHTML = '<input type="text" id="edit-tag" required="required" autofocus="autofocus" onfocus="this.select()" value="'+tagCopy+'"/>';
        		document.getElementById('edit-tag').addEventListener('keyup',(function(tagCopy){
        			return function(e){
        				if(e.keyCode == 13){
        					controller.updateTag(tagCopy,this.value);
        					TagListView.render();
        					NoteListView.render();
        				}
        			};
        		})(tagCopy));
        	};
        })(tag));
	        elem.firstChild.lastChild.addEventListener('click',(function(tagCopy){
	        	return function(){
	        		controller.removeTag(tagCopy);
	        		TagListView.render();
	        		NoteListView.render();
	        	}
	        })(tag));
			this.tagList.appendChild(elem);
			return elem;
		},
	};

	var NoteListView = {
		init : function(){
			this.tagName = document.getElementById('note-tag');
			this.noteList = document.getElementById('note-list');
			this.render();
		},
		render : function(){
			var new_note = function(){
				document.getElementById('new-note').removeEventListener('click',new_note);
				NoteEditView.init();
			};
			document.getElementById('new-note').addEventListener('click',new_note);
			var notes = controller.getNotes();
			this.tagName.innerHTML = controller.getCurrentTag() || '';
			this.noteList.innerHTML = "";
			var elem;
			if(notes){	
				for(var i = 0;i < notes.length;i++){
					elem = document.createElement('li');
					elem.innerHTML = '<div class="row"><h3 class="col-5">'
					+notes[i].name
					+'</h3>'
					+'<div class="col-1"><a href="#" class="button delete-note">x</a></div></div>';
					if(notes[i].content.length > 150)
						elem.innerHTML += '<a href="#">'+notes[i].content.substring(0,150)+'...</a>';
					else
						elem.innerHTML += '<a href="#">'+notes[i].content+'</a>';
					if(notes[i] == controller.getCurrentNote())
						elem.className = "active";
					elem.lastChild.addEventListener('click',(function(noteCopy) {
		                return function() {
		                    controller.setCurrentNote(noteCopy);
		                    NoteListView.render();
		                    NoteContentView.render();
		                };
		            })(notes[i]));
		            elem.firstChild.lastChild.firstChild.addEventListener('click',(function(noteCopy){
		            	return function(){
		            		controller.removeNote(noteCopy);
		            		NoteListView.render();
		            		NoteContentView.render();
		            	}
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
			NoteContentView.noteName.style['background-color'] = 'white';
			NoteContentView.editButton.style['background-color'] = 'white';
			NoteContentView.editButton.innerHTML = '<div class="row"><div class="col-3"><a href="#" class="button" id="save-button">Save</a></div><div class="col-3"><a href="#" class="button" id="cancel-button">Cancel</a></div>';
			NoteContentView.noteName.innerHTML = '<input type="text" placeholder="Title:" id="input-title"/>';
			NoteContentView.noteContent.innerHTML = '<textarea id = "edit-area" spellcheck="false" placeholder="Content:"></textarea>';
			this.edit_area = document.getElementById('edit-area');
			this.edit_area.onpropertychange ="this.style.height=this.scrollHeight + 'px'";
			this.edit_area.oninput="this.style.height=this.scrollHeight + 'px'";
		},
		render : function(){
			
		}
	};

	controller.init();
})();