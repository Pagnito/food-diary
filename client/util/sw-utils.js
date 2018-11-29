
var idbPromise = idb.open('food-diary', 1, function(db){
  if(!db.objectStoreNames.contains('days')){
    db.createObjectStore('days', {keyPath: 'entryNumber'});
  }
  if(!db.objectStoreNames.contains('patterns')){
    db.createObjectStore('patterns', {keyPath: 'id'});
  }
  if(!db.objectStoreNames.contains('user')){
    db.createObjectStore('user', {keyPath: 'userName'})
  }
  if(!db.objectStoreNames.contains('syncedPosts')){
    db.createObjectStore('syncedPosts', {keyPath: 'entryNumber'})
  }
});
function writeData(st, data){
  return idbPromise
  .then(function(db){
    var tx = db.transaction(st, 'readwrite');
    var store = tx.objectStore(st);
    store.put(data);
    return tx.complete;
  })
}
function readData(st){
  return idbPromise
  .then(function(db){
    var tx = db.transaction(st, 'readonly');
    var store = tx.objectStore(st);
    return store.getAll();
  })
}
function clearData(st){
  return idbPromise
  .then(function(db){
    var tx = db.transaction(st, 'readwrite');
    var store = tx.objectStore(st);
    store.clear();
    return tx.complete;
  })
}
function deleteOne(st, id) {
  return dbPromise
  .then(function(db){
    var tx = db.transaction(st, 'readwrite');
    var store = tx.objectStore(st);
    store.delete(id);
    return tx.complete;
  }).then(function(){
    console.log('Item Deleted')
  })
}
