var DB_NAME = "test";
var DB_VERSION = "2";
var TABLE_NAME = "test";

var db;
var req = indexedDB.open(DB_NAME,DB_VERSION);

req.onsuccess = function (evt){
	db = this.result;
	console.debug("initDb DONE");
};

req.onerror = function (evt){
	console.error("initDB: ",evt.target.errorCode);
};

req.onupgradeneeded = function (evt) {
	// body...
	console.debug("initDb.onupgradeneeded");
	var store = evt.currentTarget.result.createObjectStore(
		TABLE_NAME,{keypath:'id',autoIncrement:true});
	store.createIndex('title','title',{unique:true});
	store.createIndex('content','content',{unique:false});
};

function addContent (title,content) {
	// body...
	if(db){
		var tx = db.transaction(TABLE_NAME,'readwrite');
		var store = tx.objectStore(TABLE_NAME);
		var req = store.add({ title : title, content : content });
	}

	req.onsuccess = function (evt){
		displayContent();
	}
}

function displayContent () {
	// body...
	var tx = db.transaction(TABLE_NAME,'readonly');
	var store = tx.objectStore(TABLE_NAME);
}

document.getElementById('submit').addEventListener('click',function (evt){
	var title = document.getElementById('note-title').value;
	console.log(title);
	var content = document.getElementById('note-content').value;
	addContent(title,content);
},false);