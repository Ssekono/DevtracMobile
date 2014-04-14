var devtrac = {};
devtrac.indexedDB = {};

//open database
devtrac.indexedDB.db = null;

devtrac.indexedDB.open = function(callback) {
  var version = 6;
  var request = indexedDB.open("d4", version);
  request.onsuccess = function(e) {
    devtrac.indexedDB.db = e.target.result;
    callback(devtrac.indexedDB.db);
    // Do some more stuff in a minute
  };
  request.onerror = devtrac.indexedDB.onerror;
};

//creating an object store
devtrac.indexedDB.open = function(callback) {
  var version = 6;
  var request = indexedDB.open("d4", version);

  // We can only create Object stores in a versionchange transaction.
  request.onupgradeneeded = function(e) {
    var db = e.target.result;
    // A versionchange transaction is started automatically.
    e.target.transaction.onerror = devtrac.indexedDB.onerror;

    if(db.objectStoreNames.contains("oecdobj")){
      db.deleteObjectStore("oecdobj");
    }
    if(db.objectStoreNames.contains("placetypesobj")){
      db.deleteObjectStore("placetypesobj");
    }
    if(db.objectStoreNames.contains("sitevisitsobj")){
      db.deleteObjectStore("sitevisitsobj");
    }
    if(db.objectStoreNames.contains("actionitemsobj")){
      db.deleteObjectStore("actionitemsobj");
    }
    if(db.objectStoreNames.contains("fieldtripobj")){
      db.deleteObjectStore("fieldtripobj");
    }
    if(db.objectStoreNames.contains("placesitemsobj")){
      db.deleteObjectStore("placesitemsobj");
    }
    if(db.objectStoreNames.contains("qtnsitemsobj")){
      db.deleteObjectStore("qtnsitemsobj");
    }
    if(db.objectStoreNames.contains("qtionairesitemsobj")){
      db.deleteObjectStore("qtionairesitemsobj");
    }
    if(db.objectStoreNames.contains("commentsitemsobj")){
      db.deleteObjectStore("commentsitemsobj");
    }

    var store = db.createObjectStore("oecdobj", {autoIncrement: true});
    var placetypesstore = db.createObjectStore("placetypesobj", {autoIncrement: true});

    var fieldtripstore = db.createObjectStore("fieldtripobj", {keyPath: "nid"});
    fieldtripstore.createIndex('nid', 'nid', { unique: true });

    var sitevisitstore = db.createObjectStore("sitevisitsobj", {keyPath: "nid"});
    sitevisitstore.createIndex('nid', 'nid', { unique: true });

    var actionitemstore = db.createObjectStore("actionitemsobj", {keyPath: "nid"});
    actionitemstore.createIndex('nid', 'nid', { unique: true });    

    var placesitemstore = db.createObjectStore("placesitemsobj", {keyPath: "nid"});
    placesitemstore.createIndex('nid', 'nid', { unique: true });

    var qtnsitemstore = db.createObjectStore("qtnsitemsobj", {keyPath: "nid"});
    qtnsitemstore.createIndex('nid', 'nid', { unique: true });

    var qtnairesitemstore = db.createObjectStore("qtionairesitemsobj", {keyPath: "qnid"});
    qtnairesitemstore.createIndex('qnid', 'qnid', { unique: true });

    var commentsitemstore = db.createObjectStore("commentsitemsobj", {autoIncrement: true});
    commentsitemstore.createIndex('nid', 'nid', { unique: false });
  };

  request.onsuccess = function(e) {
    devtrac.indexedDB.db = e.target.result;
    callback(devtrac.indexedDB.db);
  };

  request.onerror = devtrac.indexedDB.onerror;
};

//adding oecd data to object store
devtrac.indexedDB.addOecdData = function(db, oecdObj) {  
  var d = $.Deferred();
  var trans = db.transaction("oecdobj", "readwrite");
  var store = trans.objectStore("oecdobj");
  var request;

  if(oecdObj.length > 0) {
    for (var i in oecdObj) {
      request = store.add({
        "hname": oecdObj[i]['taxonomy_term_data_taxonomy_term_hierarchy_name'],
        "hvid" : oecdObj[i]['taxonomy_term_data_taxonomy_term_hierarchy_vid'],
        "htid": oecdObj[i]['taxonomy_term_data_taxonomy_term_hierarchy_tid'],
        "htaxonomyvocabulary": oecdObj[i]['taxonomy_term_data_taxonomy_term_hierarchy__taxonomy_vocabul'], 
        "dname": oecdObj[i]['taxonomy_term_data_name'], 
        "dvid": oecdObj[i]['taxonomy_term_data_vid'], 
        "vocabularymachinename": oecdObj[i]['taxonomy_vocabulary_machine_name'], 
        "tid": oecdObj[i]['tid']
      });
    }

    request.onsuccess = function(e) {
      console.log('we have saved the oecd data');
      d.resolve();
    };

    request.onerror = function(e) {
      console.log(e.value);
      d.resolve();
    };
  }else{
    console.log("Server returned no oecds");
    d.resolve();
  }
  return d;
};

//adding placetypes data to object store
devtrac.indexedDB.addPlacetypesData = function(db, pObj) {
  var d = $.Deferred();
  var trans = db.transaction("placetypesobj", "readwrite");
  var store = trans.objectStore("placetypesobj");
  var request;

  if(pObj.length > 0) {
    for (var i in pObj) {
      request = store.add({
        "hname": pObj[i]['taxonomy_term_data_taxonomy_term_hierarchy_name'],
        "hvid" : pObj[i]['taxonomy_term_data_taxonomy_term_hierarchy_vid'],
        "htid": pObj[i]['taxonomy_term_data_taxonomy_term_hierarchy_tid'],
        "htaxonomyvocabulary": pObj[i]['taxonomy_term_data_taxonomy_term_hierarchy__taxonomy_vocabul'], 
        "dname": pObj[i]['taxonomy_term_data_name'], 
        "dvid": pObj[i]['taxonomy_term_data_vid'], 
        "vocabularymachinename": pObj[i]['taxonomy_vocabulary_machine_name'], 
        "tid": pObj[i]['tid']
      });
    }

    request.onsuccess = function(e) {
      console.log('we have saved the placetypes data');
      d.resolve();
    };

    request.onerror = function(e) {
      console.log(e.value);
      d.resolve();
    };
  }else{
    console.log("Server returned no placetypes");
    d.resolve();
  }
  return d;
};

//adding fieldtrips data to object store
devtrac.indexedDB.addFieldtripsData = function(db, fObj) {
  var d = $.Deferred();
  var trans = db.transaction("fieldtripobj", "readwrite");
  var store = trans.objectStore("fieldtripobj");
  var request;

  if(fObj.length > 0){
    for (var i in fObj) {
      request = store.add(fObj[i])
    }

    request.onsuccess = function(e) {
      d.resolve();
    };

    request.onerror = function(e) {
      d.reject(e);
    };
  }else{
    d.reject("No fieldtrips returned");
  }

  return d;
};

//adding questions data to object store
devtrac.indexedDB.addQuestionsData = function(db, qObj) {
  var d = $.Deferred();
  var trans = db.transaction("qtnsitemsobj", "readwrite");
  var store = trans.objectStore("qtnsitemsobj");
  var request;

  if(qObj.length > 0){
    for (var i in qObj) {
      request = store.add(qObj[i])
    }

    request.onsuccess = function(e) {
      d.resolve();
    };

    request.onerror = function(e) {
      d.reject(e);
    };
  }else{
    d.reject("No Questions returned");
  }

  return d;
};

//adding sitevisits data to object store
devtrac.indexedDB.addSiteVisitsData = function(db, sObj) {
  var d = $.Deferred();
  var trans = db.transaction("sitevisitsobj", "readwrite");
  var sitevisitstore = trans.objectStore("sitevisitsobj");
  var sitevisitrequest;
  var timestamp = new Date().getTime();

  if(controller.sizeme(sObj) > 0){
    for (var i in sObj) {
      if(!(sObj[i]['dbsavetime'] && sObj[i]['editflag'])){
        sObj[i]['dbsavetime'] = timestamp;
        sObj[i]['editflag'] = 0;
      }
      sitevisitrequest = sitevisitstore.add(sObj[i]);

    }

    sitevisitrequest.onsuccess = function(e) {
      console.log("added site visits");
      d.resolve();
    };

    sitevisitrequest.onerror = function(e) {
      console.log("error adding site visits");
      d.reject(e);
    };
  }else{
    d.reject('No site visits returned');
  }


  return d;
};

//adding action items data to object store
devtrac.indexedDB.addActionItemsData = function(db, aObj) {
  var d = $.Deferred();
  var trans = db.transaction("actionitemsobj", "readwrite");
  var store = trans.objectStore("actionitemsobj");
  var request;

  if(controller.sizeme(aObj) > 0) {
    for (var i in aObj) {
      request = store.add(aObj[i]);
    }

    request.onsuccess = function(e) {
      d.resolve();
    };

    request.onerror = function(e) {
      d.reject(e);
    };
  }else {
    d.reject("No action items returned");
  }

  return d;
};

//adding comments data to object store
devtrac.indexedDB.addCommentsData = function(db, cObj) {
  var d = $.Deferred();
  var trans = db.transaction("commentsitemsobj", "readwrite");
  var store = trans.objectStore("commentsitemsobj");
  var request;

  request = store.add(cObj);

  request.onsuccess = function(e) {
    d.resolve();
  };

  request.onerror = function(e) {
    d.reject(e);
  };

  return d;
};

//adding questions data to object store
devtrac.indexedDB.addSavedQuestions = function(db, aObj) {
  var d = $.Deferred();
  var trans = db.transaction("qtionairesitemsobj", "readwrite");
  var store = trans.objectStore("qtionairesitemsobj");
  var request;

  request = store.add(aObj);

  request.onsuccess = function(e) {
    d.resolve();
  };

  request.onerror = function(e) {
    d.reject(e);
  };

  return d;
};

//adding place data to object store
devtrac.indexedDB.addPlacesData = function(db, placeObj) {
  var d = $.Deferred();
  var trans = db.transaction("placesitemsobj", "readwrite");
  var store = trans.objectStore("placesitemsobj");
  var request;

  if(placeObj != undefined) {
    for (var i in placeObj) {
      request = store.add(placeObj[i]);
    }

    request.onsuccess = function(e) {
      d.resolve();
    };

    request.onerror = function(e) {
      d.reject(e);
    };
  }else {
    d.reject("No places returned");
  }
  return d;
};

//query oecd data from datastore
devtrac.indexedDB.getAllOecdItems = function(db, callback) {
  var trans = db.transaction(["oecdobj"], "readonly");
  var store = trans.objectStore("oecdobj");

  var categories = [];
  var categoryValues = {}; 
  var category = "";
  var htid;
  var flag = false;

  var i = 0;

  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false) {
      callback(categoryValues, categories);
      return;
    }
    i = i + 1;

    var anchor = $(result.value["dname"]);
    var title = anchor.html();

    //if term categories are available
    if(category != result.value["hname"]  && result.value["hname"] != undefined) {
      category = result.value["hname"];
      categories[result.value["htid"]] = result.value["hname"];
      htid = result.value["htid"];

      //create array if it doesnot exist to hold terms that belong to category with given htid
      if(!categoryValues[htid]) {
        categoryValues[htid] = [];
      }

      //save term if it has not been saved before
      if(categoryValues[htid][i] != result.value["dname"]) {
        categoryValues[htid][i] = result.value["dname"];
      }

      //cater for undefined categories in results
    }else if(category != title) {
      category = title;
      categories[i] = title;
      htid = i;
      if(!categoryValues[htid]) {
        categoryValues[htid] = [];
      }
      categoryValues[htid][htid] = title;
    }

    result.continue();
  };

  cursorRequest.onerror = devtrac.indexedDB.onerror;
};


//query placetypes data from datastore
devtrac.indexedDB.getAllPlacetypesItems = function(db, callback) {
  var trans = db.transaction(["placetypesobj"], "readonly");
  var store = trans.objectStore("placetypesobj");

  var categories = [];
  var categoryValues = {}; 
  var category = "";
  var htid;
  var flag = false;

  var i = 0;

  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false) {
      callback(categoryValues, categories);
      return;
    }
    i = i + 1;

    var anchor = $(result.value["dname"]);
    var title = anchor.html();

    if(category != result.value["hname"]  && result.value["hname"] != undefined) {
      category = result.value["hname"];
      categories[result.value["htid"]] = result.value["hname"];
      htid = result.value["htid"];
      if(!categoryValues[htid]) {
        categoryValues[htid] = [];
      }

      for(var key in categoryValues[htid]) {
        if(categoryValues[htid][key] == result.value["dname"]) {
          flag = true;
          break;
        }else {
          continue;
        }
      }

      if(!flag) {
        categoryValues[htid][i] = result.value["dname"];
      }else {
        flag = false;
      }

    }else if(category != title) {
      category = title;
      categories[i] = title;
      htid = i;
      if(!categoryValues[htid]) {
        categoryValues[htid] = [];
      }
      categoryValues[htid][htid] = title;
    }

    result.continue();
  };

  cursorRequest.onerror = devtrac.indexedDB.onerror;
};

//get all fieldtrips in database
devtrac.indexedDB.getAllFieldtripItems = function(db, callback) {
  var fieldtrips = [];
  var trans = db.transaction(["fieldtripobj"], "readonly");
  var store = trans.objectStore("fieldtripobj");

  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false) {
      callback(fieldtrips);
      return;
    }

    fieldtrips.push(result.value);

    result.continue();
  };

  cursorRequest.onerror = devtrac.indexedDB.onerror;
};

//get all questions in database
devtrac.indexedDB.getAllQuestionItems = function(db, ftritems, callback) {
  var qtns = [];
  var trans = db.transaction(["qtnsitemsobj"], "readonly");
  var store = trans.objectStore("qtnsitemsobj");

  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false) {
      callback(qtns);
      return;
    }
    //check for question to retrieve
    //if(result.value.status === 1 && ftritems[0]['taxonomy_vocabulary_1']['und'][0]['tid'] === result.value.taxonomy_vocabulary_1.und[0].tid) {
      qtns.push(result.value);
    //}
    result.continue();
  };

  cursorRequest.onerror = devtrac.indexedDB.onerror;
};

//search fieldtrips using index of nid
devtrac.indexedDB.getFieldtrip = function(db, fnid, callback) {
  var fieldtrips = [];
  var trans = db.transaction(["fieldtripobj"], "readonly");
  var store = trans.objectStore("fieldtripobj");

  var index = store.index("nid");
  index.get(fnid).onsuccess = function(event) {
    callback(event.target.result);
  };

};

//get all sitevisits in database
devtrac.indexedDB.getAllSitevisits = function(db, callback) {
  var sitevisits = [];
  var trans = db.transaction(["sitevisitsobj"], "readonly");
  var store = trans.objectStore("sitevisitsobj");

  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false) {
      callback(sitevisits);
      return;
    }

    sitevisits.push(result.value);

    result.continue();
  };

  cursorRequest.onerror = devtrac.indexedDB.onerror;
};

//search sitevisits using index of nid
devtrac.indexedDB.getSitevisit = function(db, snid, callback) {
  var trans = db.transaction(["sitevisitsobj"], "readonly");
  var store = trans.objectStore("sitevisitsobj");

  var index = store.index("nid");
  index.get(snid).onsuccess = function(event) {
    callback(event.target.result);
  };

};

//search action items 
devtrac.indexedDB.getActionItem = function(db, anid, callback) {
  var trans = db.transaction(["actionitemsobj"], "readonly");
  var store = trans.objectStore("actionitemsobj");

  var index = store.index("nid");
  index.get(anid).onsuccess = function(event) {
    callback(event.target.result);
  };

};


//get all action items in database
devtrac.indexedDB.getAllActionitems = function(db, callback) {
  var actionitems = [];
  var trans = db.transaction(["actionitemsobj"], "readonly");
  var store = trans.objectStore("actionitemsobj");

  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false) {
      callback(actionitems);
      return;
    }

    actionitems.push(result.value);

    result.continue();
  };

  cursorRequest.onerror = devtrac.indexedDB.onerror;
};

//get all user saved answers in database
devtrac.indexedDB.getAllSavedAnswers = function(db, callback) {
  var answers = [];
  var trans = db.transaction(["qtionairesitemsobj"], "readonly");
  var store = trans.objectStore("qtionairesitemsobj");

  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false) {
      callback(answers);
      return;
    }

    answers.push(result.value);

    result.continue();
  };

  cursorRequest.onerror = devtrac.indexedDB.onerror;
};

//get all locations or places in database
devtrac.indexedDB.getAllplaces = function(db, callback) {
  var places = [];
  var trans = db.transaction(["placesitemsobj"], "readonly");
  var store = trans.objectStore("placesitemsobj");

  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false) {
      callback(places);
      return;
    }

    places.push(result.value);

    result.continue();
  };

  cursorRequest.onerror = devtrac.indexedDB.onerror;
};

//get all comments in database
devtrac.indexedDB.getAllComments = function(db, callback) {
  var comments = [];
  var trans = db.transaction(["commentsitemsobj"], "readonly");
  var store = trans.objectStore("commentsitemsobj");

  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false) {
      callback(comments);
      return;
    }

    comments.push(result.value);

    result.continue();
  };

  cursorRequest.onerror = devtrac.indexedDB.onerror;
};

//get a place items from database
devtrac.indexedDB.getPlace = function(db, pnid, callback) {
  var trans = db.transaction(["placesitemsobj"], "readonly");
  var store = trans.objectStore("placesitemsobj");

  var index = store.index("nid");
  index.get(pnid).onsuccess = function(event) {
    callback(event.target.result);
  };

};

//get action item from database
devtrac.indexedDB.getActionitem = function(db, anid, callback) {
  var trans = db.transaction(["actionitemsobj"], "readonly");
  var store = trans.objectStore("actionitemsobj");

  var index = store.index("nid");
  index.get(anid).onsuccess = function(event) {
    callback(event.target.result);
  };

};

//get fieldtrip item from database
devtrac.indexedDB.getFieldtrip = function(db, fnid, callback) {
  var d = $.Deferred();
  
  var trans = db.transaction(["fieldtripobj"], "readonly");
  var store = trans.objectStore("fieldtripobj");

  var index = store.index("nid");
  index.get(fnid).onsuccess = function(event) {
    callback(event.target.result);
    d.resolve();
  };
  
  return d;

};

//edit fieldtrip
devtrac.indexedDB.editFieldtrip = function(db, fnid, updates) {
  var d = $.Deferred();
  var trans = db.transaction(["fieldtripobj"], "readwrite");
  var store = trans.objectStore("fieldtripobj");

  var request = store.get(fnid);
  request.onerror = function(event) {
    // Handle errors!
    console.log("Error getting fieldtrip to update "+fnid);
  };
  
  request.onsuccess = function(event) {
    var timestamp = new Date().getTime();

    // Get the old value that we want to update
    var data = request.result;
    data.title = updates['title'];
    data.editflag = updates['editflag'];
    // update the value(s) in the object that you want to change

    // Put this updated object back into the database.
    var requestUpdate = store.put(data);
    
    requestUpdate.onerror = function(event) {
      // Do something with the error
      console.log("Fieldtrip update failed");
      d.resolve();
    };
    
    requestUpdate.onsuccess = function(event) {
      // Success - the data is updated!
      console.log("Fieldtrip update success");
      //callback();
      d.resolve();
    };
  };
  return d;
};

//edit actionitem information
devtrac.indexedDB.editActionitem = function(db, anid, updates) {
  var d = $.Deferred();
  
  var trans = db.transaction(["actionitemsobj"], "readwrite");
  var store = trans.objectStore("actionitemsobj");

  var request = store.get(anid);
  request.onerror = function(event) {
    // Handle errors!
    console.log("Error getting action items to update "+anid);
  };
  request.onsuccess = function(event) {
      // Get the old value that we want to update
      var data = request.result;
      data.submit = updates['submit'];

    // Put this updated object back into the database.
    var requestUpdate = store.put(data);
    requestUpdate.onerror = function(event) {
      // Do something with the error
      console.log("Action item update failed");
      d.reject();
    };
    requestUpdate.onsuccess = function(event) {
      // Success - the data is updated!
      console.log("Action item update success");
      d.resolve();
    };
  };
  return d;
};

//edit place
devtrac.indexedDB.editPlace = function(db, pnid, updates) {
  var d = $.Deferred();
  
  var trans = db.transaction(["placesitemsobj"], "readwrite");
  var store = trans.objectStore("placesitemsobj");

  var request = store.get(pnid);
  request.onerror = function(event) {
    // Handle errors!
    console.log("Error getting place to update "+pnid);
  };
  request.onsuccess = function(event) {
      // Get the old value that we want to update
      var data = request.result;
      data.submit = updates['submit'];

    // Put this updated object back into the database.
    var requestUpdate = store.put(data);
    requestUpdate.onerror = function(event) {
      // Do something with the error
      console.log("Place update failed");
      d.reject();
    };
    requestUpdate.onsuccess = function(event) {
      // Success - the data is updated!
      console.log("Place update success");
      d.resolve();
    };
  };
  return d;
};

//edit site visit
devtrac.indexedDB.editSitevisit = function(db, snid, updates) {
  var d = $.Deferred();
  
  var trans = db.transaction(["sitevisitsobj"], "readwrite");
  var store = trans.objectStore("sitevisitsobj");

  var request = store.get(snid);
  request.onerror = function(event) {
    // Handle errors!
    console.log("Error getting site visit to update "+snid);
  };
  request.onsuccess = function(event) {
      // Get the old value that we want to update
      var data = request.result;
      data.submit = updates['submit'];
      data.nid = updates['nid'];
      
    // Put this updated object back into the database.
    var requestUpdate = store.put(data);
    requestUpdate.onerror = function(event) {
      // Do something with the error
      console.log("Site visit update failed");
      d.reject();
    };
    requestUpdate.onsuccess = function(event) {
      // Success - the data is updated!
      console.log("Site visit update success");
      
      store.delete(snid);
      d.resolve();
    };
  };

  return d;
};

//delete action item
devtrac.indexedDB.deleteActionitem = function(db, id) {
  var trans = db.transaction(["actionitemsobj"], "readwrite");
  var store = trans.objectStore("actionitemsobj");

  var request = store.delete(id);

  request.onsuccess = function(e) {
    console.log("deleted action item "+id);
  };

  request.onerror = function(e) {
    console.log(e);
  };
};