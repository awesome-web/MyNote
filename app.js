(function() {
	// body...
	var model = {
		current_tag : null,
		current_note : null,
		is_current_tag : false,
		is_current_note : false,
		notes : {},
		tags : [],
		init : function(){
			if (!localStorage.notes) {
                localStorage.notes = JSON.stringify({
                	"Example" : [
                	{
                		name : "Example",
                		content : "Example"
                	}
                	] 
                });
            }
            this.readData();
            console.debug(JSON.parse(localStorage.notes));
			Object.keys(JSON.parse(localStorage.notes)).forEach(function(tag){
				model.tags.push(tag);
			});
		},
		readData : function(){
			this.notes = JSON.parse(localStorage.notes);
		},
		writeData : function(){
			localStorage.notes = JSON.stringify(this.notes);
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
		addNote : function(name,content){
			var note = {
				name : name,
				content : content
			};
			this.notes[this.current_tag].push(note);
			this.writeData();
			this.setCurrentNote(note);
		},
		removeNote : function(note){
			this.isCurrentNote(note);
			var arr = this.notes[this.current_tag];
			arr.splice(arr.indexOf(note),1);
			if(this.is_current_note)
				this.current_note = null;
			this.writeData();
		},
		updateNote : function(name,content){
			this.current_note.name = name;
			this.current_note.content = content;
			this.writeData();
		},
		addTag : function(tag){
			if(this.notes[tag])
				alert("This tag exists!");
			else{
				this.tags.push(tag);
				this.notes[tag] = [];
			}
			this.writeData();
		},
		removeTag : function(tag){
			this.isCurrentTag(tag);
			this.tags.splice(this.tags.indexOf(tag),1);
			delete this.notes[tag];
			if(this.is_current_tag && this.tags)
				this.current_tag = this.tags[0];
			this.writeData();
		},
		updateTag : function(tag,value){
			if(!value){
				alert("Can't be empty!")
			}
			else if(tag == value){
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
			this.writeData();
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
		},
		addNote : function(name,content){
			model.addNote(name,content);
		},
		updateNote : function(name,content){
			model.updateNote(name,content);
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
			
			document.getElementById('add-tag').onclick = function(){
				this.onclick = 'null';
				var elem = TagListView.newTag('');
				elem.firstChild.firstChild.innerHTML = '<input type="text" id="edit-tag" required="required" autofocus="autofocus" onfocus="this.select()" />';
				document.getElementById('edit-tag').addEventListener('keyup',function(e){
					if(e.keyCode == 13){
						controller.addTag(this.value);
						TagListView.render();
					}
				});
			};
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
	        elem.firstChild.firstChild.nextSibling.firstChild.onclick = (function(tagCopy){
	        	return function(){
	        		var edit_button = document.getElementsByClassName('edit-tag button');
	        		console.debug(edit_button);
	        		for(var i = 0;i < edit_button.length;i++)
	        			edit_button[i].onclick = 'null';
        		this.parentNode.previousSibling.innerHTML = '<input type="text" id="edit-tag" autofocus="autofocus" onfocus="this.select()" value="'+tagCopy+'"/>';
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
        })(tag);
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
			this.new_note = document.getElementById('new-note');
			this.render();
		},
		render : function(){
			this.new_note.onclick = function(){
				this.onclick = "null";
				NoteEditView.init();
				NoteEditView.addNote();
			};

			var notes = controller.getNotes();
			this.tagName.innerHTML = controller.getCurrentTag() || '';
			this.noteList.innerHTML = "";
			if(!controller.getCurrentTag())
				this.new_note.style.display = "none";
			else
				this.new_note.style.display = "block";
			if(notes){	
				for(var i = 0;i < notes.length;i++){
					this.newNote(notes[i]);		
				}
			}
		},
		newNote : function(note){
			var elem = document.createElement('li');
			elem.innerHTML = '<div class="row"><h3 class="col-5">'
			+note.name
			+'</h3>'
			+'<div class="col-1"><a href="#" class="button delete-note">x</a></div></div>';
			if(note.content.length > 100)
				elem.innerHTML += '<a href="#">'+note.content.substring(0,80).replace(/[^A-Za-z0-9\ \,\;\.\?\u2E80-\uFE4F]/ig,"")+'...</a>';
			else
				elem.innerHTML += '<a href="#">'+note.content.replace(/[^A-Za-z0-9\ \,\;\.\?\u2E80-\uFE4F]/ig,"")+'</a>';
			if(note == controller.getCurrentNote())
				elem.className = "active";
			elem.lastChild.addEventListener('click',(function(noteCopy) {
                return function() {
                    controller.setCurrentNote(noteCopy);
                    NoteListView.render();
                    NoteContentView.render();
                };
            })(note));
            elem.firstChild.lastChild.firstChild.addEventListener('click',(function(noteCopy){
            	return function(){
            		controller.removeNote(noteCopy);
            		NoteListView.render();
            		NoteContentView.render();
            	}
            })(note));
			this.noteList.appendChild(elem);
			return elem;
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
			this.noteName.style['background-color'] = '#ee5c42';
			this.editButton.style['background-color'] = '#ee5c42';
			var note = controller.getCurrentNote();
			if(note){
				this.noteName.innerHTML = note.name;
				this.noteContent.innerHTML = marked(note.content);
				this.editButton.innerHTML = '<a href="#" id="edit-note" class="button">Edit</a>';
				document.getElementById('edit-note').addEventListener('click',function(){
					NoteEditView.init();
					NoteEditView.editNote();
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
			this.input_title = document.getElementById('input-title');
			this.save_button = document.getElementById('save-button');
			this.cancel_button = document.getElementById('cancel-button');
			this.edit_area = document.getElementById('edit-area');
			this.edit_area.onpropertychange =function(){
				this.style.height=this.scrollHeight + 'px';
			}
			this.edit_area.oninput=function(){
				this.style.height=this.scrollHeight + 'px';
			}
		},
		render : function(){
			
		},
		addNote : function(){
			this.save_button.onclick = function(){
				controller.addNote(NoteEditView.input_title.value,NoteEditView.edit_area.value);
				NoteListView.render();
				NoteContentView.render();
			};
			this.cancel_button.onclick = function(){
				NoteContentView.clear();
				NoteListView.render();
			}
		},
		editNote : function(){
			var note = controller.getCurrentNote();
			this.input_title.value = note.name;
			this.edit_area.value = note.content;
			this.save_button.onclick = function(){
				controller.updateNote(NoteEditView.input_title.value,NoteEditView.edit_area.value);
				NoteListView.render();
				NoteContentView.render();
			};
			this.cancel_button.onclick = function(){
				NoteContentView.render();
			};
		}
	};

	controller.init();
})();