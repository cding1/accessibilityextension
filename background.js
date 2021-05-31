chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {});

let tickets = [{
    "email": "test@test.com.au",
    "ticketno": "1",
    "ticketscore": "6/10",
    "ticketissue": "myopia",
    "ticketfeedback": "the font on the home page needs to be more clear",
    "ticketstatus": "resolved"
},
{
    "email": "clara@test.com.au",
    "ticketno": "2",
    "ticketscore": "8/10",
    "ticketissue": "red-green colour blindness",
    "ticketfeedback": "pictures are blurry, needs more colour contrast",
    "ticketstatus": "pending"
},
]


let db = null;

//create new database
function create_database() {

    const request = window.indexedDB.open('ticketsDB');

    request.onerror = function (event) {
        console.log("Unable to open DB.");
    }

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        let objectStore = db.createObjectStore('tickets', {
            keyPath: 'email'
        });
        objectStore.transaction.oncomplete = function (event) {
            console.log("ObjectStore Created.");
        }
    }

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log("DB Opened.");
        insert_records(tickets);
        db.onerror = function (event) {
            console.log("DB Failed to Open.")
        }
    }
}

//insert new records to database
function insert_records(records) {

    if (db) {

      const insert_transaction = db.transaction("tickets", "readwrite");
      const objectStore = insert_transaction.objectStore("tickets");

      return new Promise((resolve, reject) => {
         insert_transaction.oncomplete = function () {
             console.log("Insert Transactions Complete.");
             resolve(true);
         }

         insert_transaction.onerror = function () {
             console.log("Insert Transactions Failed.")
             resolve(false);
         }

         records.forEach(person => {
           let request = objectStore.add(person);
           request.onsuccess = function () {
             console.log("Added: ", person);
           }

         });
      });
    }
}

//retrieves ticket data
function get_record(email) {

    if (db) {

      const get_transaction = db.transaction("tickets", "readonly");
      const objectStore = get_transaction.objectStore("tickets");

      return new Promise((resolve, reject) => {
        get_transaction.oncomplete = function () {
          console.log("Get Transactions Complete.");
        }

        get_transaction.onerror = function () {
          console.log("Get Transactions Failed.")
        }

        let request = objectStore.get(email);
        request.onsuccess = function (event) {
          resolve(event.target.result);
        }
      });
    }
}

//allows for updating ticket records
function update_record(record) {

    if (db) {
      const put_transaction = db.transaction("tickets", "readwrite");
      const objectStore = put_transaction.objectStore("tickets");

      return new Promise((resolve, reject) => {
        put_transaction.oncomplete = function () {
          console.log("Put Transactions Complete.");
          resolve(true);
        }

        put_transaction.onerror = function () {
          console.log("Put Transactions Failed.")
          resolve(false);
        }

        objectStore.put(record);
      });
    }
}  

//deletes ticket data
function delete_record(email) {

    if (db) {
      const delete_transaction = db.transaction("tickets", "readwrite");
      const objectStore = delete_transaction.objectStore("tickets");

      return new Promise((resolve, reject) => {
        delete_transaction.oncomplete = function () {
          console.log("Delete Transactions Complete.");
          resolve(true);
        }

        delete_transaction.onerror = function () {
          console.log("Delete Transactions Failed.")
          resolve(false);
        }

        objectStore.delete(email);
      });
    }
}

create_database();
