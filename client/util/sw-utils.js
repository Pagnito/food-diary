
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
  if(!db.objectStoreNames.contains('syncedDays')){
    db.createObjectStore('syncedDays', {keyPath: 'entryNumber'})
  }
  if(!db.objectStoreNames.contains('syncedMeals')){
    db.createObjectStore('syncedMeals', {keyPath: 'entryNumber'})
  }
  if(!db.objectStoreNames.contains('syncedSymptoms')){
    db.createObjectStore('syncedSymptoms', {keyPath: 'entryNumber'})
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
  return idbPromise
  .then(function(db){
    var tx = db.transaction(st, 'readwrite');
    var store = tx.objectStore(st);
    store.delete(id);
    return tx.complete;
  }).then(function(){
    console.log('Item Deleted')
  })
}
