importScripts('/node_modules/idb/lib/idb.js');
importScripts('/util/sw-utils.js');
var CACHE_STATIC = 'static-v2';
var CACHE_DYNAMIC = 'dynamic-v1';


  self.addEventListener('install', function(e){
    //console.log('SW installed')
    e.waitUntil(
      caches.open(CACHE_STATIC)
      .then(function(cache){
        cache.addAll([
          '/',
          'index.html',
          '/build/bundle.css',
          '/build/bundle.js',
          '/build/favicon.ico',
          'https://fonts.googleapis.com/css?family=Kodchasan:400,700|Poiret+One',
          'https://use.fontawesome.com/releases/v5.3.1/webfonts/fa-solid-900.woff2',
          'https://use.fontawesome.com/releases/v5.3.1/css/all.css'
        ])
      })
    )
  });
  //////////////////////////////////////////////////////////////////////////////



  //////////////////////////////////////////////////////////////////////////////
  self.addEventListener('activate', function(e){
    e.waitUntil(
      caches.keys()
      .then(function(keyList){
        keyList.forEach(function(key){
          return Promise.all(keyList.map(function(key){
            if(key !== CACHE_STATIC && key !== CACHE_DYNAMIC){
              //console.log('deleted')
              return caches.delete(key);
            }
          }))
        })
      })
    )
  });
  //////////////////////////////////////////////////////////////////////////////



  //////////////////////////////////////////////////////////////////////////////
  self.addEventListener('message', function(e){

  })


//////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////
self.addEventListener('fetch', function(e){
  let days = 'api/getDays';
  let user = 'api/current_user';
  let patterns = 'api/entryUpdates';
/* console.log(e.request)*/
  if(e.request.url.indexOf('dashboard')>-1 || e.request.url.indexOf('entries')>-1){
    e.respondWith(
      caches.match('/index.html')
      .then(function(res){
        return res;
      })
    )
  } else if (e.request.url.indexOf(patterns)>-1) {
    e.respondWith(fetch(e.request)
          .then(function (res) {
            if(res){
            var clonedRes = res.clone();
            clearData('patterns')
              .then(function () {
                return clonedRes.json();
              })
              .then(function (data) {
                  writeData('patterns', data);
              });
            return res;
            }
          })

    );
  } else if(e.request.url.indexOf(days)>-1){
    e.respondWith(fetch(e.request)
          .then(function (res) {
            if(res){
            var clonedRes = res.clone();
            clearData('days')
              .then(function () {
                return clonedRes.json();
              })
              .then(function (data) {
                  data.forEach(function(day){
                    writeData('days',day)
                  })
              });
            return res;
            }
          })
      );
  } else if(e.request.url.indexOf(user)>-1){
    e.respondWith(fetch(e.request)
          .then(function (res) {
            if(res){
            var clonedRes = res.clone();
            clearData('user')
              .then(function () {
                return clonedRes.json();
              })
              .then(function (data) {
                let user = {
                  userName: data.userName,
                  loggedIn:true
                }
                writeData('user', user)
              });
            return res;
            }
          })
      );
  } else {
    e.respondWith(
      caches.match(e.request)
      .then(function(res){
        if(res){
          return res;
        } else {
          return fetch(e.request)
        }
      })
    )
  }


});
//////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////
self.addEventListener('sync', function(e){
  //console.log(e)
  if(e.tag==='sync-day-post') {
    e.waitUntil(
      readData('syncedDays')
      .then(function(post){
        fetch(`${e.currentTarget.location.origin}/api/addDay`, {
          method:'POST',
          headers: {
           'Content-Type': 'application/json',
           'Accept': 'application/json'
          },
          body: JSON.stringify(post[0])
        }).then(function(res){
          if(res.ok){
            res.json().then(function(resData){
              console.log(resData)
              deleteOne('syncedDays', resData.entryNumber)
            })
          }
        })
      })
    )
  } else if (e.tag==='sync-meal-post'){
    e.waitUntil(
      readData('syncedMeals')
      .then(function(post){
        fetch(`${e.currentTarget.location.origin}/api/addMeal`, {
          method:'POST',
          headers: {
           'Content-Type': 'application/json',
           'Accept': 'application/json'
          },
          body: JSON.stringify(post[0])
        }).then(function(res){
          if(res.ok){
            res.json().then(function(resData){
              //console.log(resData)
              deleteOne('syncedMeals', resData.entryNumber)
            })
          }
        })
      })
    )
  } else if(e.tag==='sync-symptom-post'){
    e.waitUntil(
      readData('syncedSymptoms')
      .then(function(post){
        fetch(`${e.currentTarget.location.origin}/api/addSymptom`, {
          method:'POST',
          headers: {
           'Content-Type': 'application/json',
           'Accept': 'application/json'
          },
          body: JSON.stringify(post[0])
        }).then(function(res){
          if(res.ok){
            res.json().then(function(resData){
              //console.log(resData)
              deleteOne('syncedSymptoms', resData.entryNumber)
            })
          }
        })
      })
    )
  }
});
//////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////
self.addEventListener('push', function(e){

});
