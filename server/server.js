// 2024-12-19 TL
// Flight tracker node.js server script


//
//    Development Parameters
//

const development = true;
const toTimestamp = date => Math.floor(date.getTime() / 1000);


//
//  0    Initialise
//

function debug(msg) {
    let debug_on = true;
    if (debug_on) { console.log(msg) };
}

const express = require("express");  //TODO What is extra () for
const app = express();
const socketIo = require(`socket.io`);
const sqlite3 = require("sqlite3").verbose();
// const port = process.env.PORT || 3000;  //TODO Look up what process.env.PORT
const port = 3000;
app.use(express.json());

//
//  Data Read
//

let db = new sqlite3.Database(`./data/aurigny_tracker.db`, (err) =>{
    if (err) {
        console.error(err.message);
        return;
    }
    console.log(`Connected to the SQLite database.`);
});

// Define a route to get data 
app.get('/data', (req, res) => { 
    db.all('SELECT * FROM location', 
        [], 
        (err, rows) => { 
            if (err) { res.status(500).json({ error: err.message }); 
            return; 
        } res.json({ data: rows }); 
    }); 
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});




// my_message = db.all(`SELECT * FROM aircraft`, (err, rows) => { if (err) { console.error(err.message); return; } console.log(rows); });


// app.get("/", (req,res)=>{
//     res.send(my_message)
// });


// const io = socketIo(server);

// io.on(`connection`, (socket) => {
//     socket.emit(`connectionStatus`, { status: true });
//     debug("connection: status true");

//     if (development) {let now = toTimestamp("2024-10-21")}; 
//     if  (!development) {let now = Math.round(Date.now(),0)};
    
//     console.log(now)
//     let unix_time_start = now - (now % (24 * 60 * 60 * 1000));  // Unix timestamp in milliseconds at 00:00 GMT 

//     unix_time_start -= 7 * 24 * 60 * 60 * 1000;

//     let sql = `SELECT MIN(unix_time) AS unix_min FROM location 
//                 WHERE unix_time >= ${unix_time_start}`;

//     db.get(sql, [], (err, row) => {
//         if (err) {
//             res.status(400).json({ error: err.message });
//             return;
//         }

//         unix_time_start = row.unix_min;
//         socket.emit(`firstFlightUnix`, { record: row });
//         debug(`connection: first flight unix:  ${row.unix_min}`);

//         socket.on(`requestData`, () => {

//             sql = `SELECT MAX(unix_time) AS unix_max FROM location`;

//             db.get(sql, [], (err, row) => {
//                 if (err) {
//                     res.status(400).json({ error: err.message });
//                     return;
//                 }
//                 unix_time_end = row.unix_max;
//                 debug(`connection: last flight unix: ${unix_time_end}`);

//                 sql = `SELECT * FROM location 
//                         WHERE unix_time > ${unix_time_start}   
//                         AND unix_time <= ${unix_time_end}
//                         ORDER BY unix_time ASC`;

//                         //                        AND aircraft_hex = "407675"


//                 db.all(sql, [], (err, rows) => {
//                     if (err) {
//                         socket.emit('error', { message: err.message });
//                         return;
//                     }

//                     console.log(rows);
//                     socket.emit('dataUpdate', { message: "success", data: rows });
//                     debug(`data update: success`);

//                     unix_time_start = unix_time_end;
//                 });
//             });
//         });
//     });
//     socket.on('disconnect', () => {
//         debug(`disconnect`)
//     });
// });

// app.listen(port, () => {
//     console.log(`Listening on port: ${port}`)
// })

