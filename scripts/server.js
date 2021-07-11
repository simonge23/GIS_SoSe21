"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Http = require("http");
const Mongo = require("mongodb");
let port = Number(process.env.PORT);
let databaseUrl = "mongodb+srv://gissose2020:giswise2021@gis-ist-scheisse.zdjmy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
let loginDatenCollection;
let rezeptCollection;
if (!port) {
    port = 8100;
}
serverInit(port);
async function serverInit(_port) {
    let server = Http.createServer();
    await connectToDB(databaseUrl);
    server.addListener("request", handleRequest);
    server.addListener("listening", function () {
        console.log("listening on Port: " + _port);
    });
    server.listen(_port);
}
async function connectToDB(_url) {
    let mongoClient = new Mongo.MongoClient(_url, { useUnifiedTopology: true });
    await mongoClient.connect();
    if (mongoClient.isConnected) {
        console.log("DB is connected");
    }
    loginDatenCollection = mongoClient.db("Rezeptewebsite").collection("loginDaten");
    rezeptCollection = mongoClient.db("Rezeptewebsite").collection("rezepte");
}
async function handleRequest(req, res) {
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Origin", "*");
    const baseURL = "http://" + req.headers.host + "/";
    if (req.url) {
        let url = new URL(req.url, baseURL);
        console.log(url.pathname, url.search);
        if (url.pathname === "/login") {
            handleLogin(req, res);
        }
        else if (url.pathname === "/regestrierung") {
            console.log(url.pathname);
            handleRegestration(req, res);
        }
        else if (url.pathname === "/rezepte") {
            getRezepte(res, url.searchParams.get("author"));
        }
        else if (url.pathname === "/rezepte/likedby") {
            getRezepteLikedBy(url.searchParams.get("user"), res);
        }
        else if (url.pathname === "/rezepte/likedby/add") {
            likeRezept(url.searchParams.get("user"), url.searchParams.get("id"), res);
        }
        else if (url.pathname === "/rezepte/likedby/remove") {
            unlikeRezept(url.searchParams.get("user"), url.searchParams.get("id"), res);
        }
        else if (url.pathname === "/rezept") {
            getRezept(url.searchParams.get("id"), res);
        }
        else if (url.pathname === "/rezept/create") {
            handleCreateRezept(req, res);
        }
        else if (url.pathname === "/rezept/delete") {
            deleteRezept(url.searchParams.get("id"), res);
        }
        else if (url.pathname === "/rezept/update") {
            updateRezept(url.searchParams.get("id"), req, res);
        }
    }
}
function handleLogin(req, res) {
    let data = "";
    req.on("data", chunk => {
        data += chunk.toString();
    });
    req.on("end", async () => {
        let credentialsJSON = JSON.parse(data);
        let login = await isRegistered(credentialsJSON.name, credentialsJSON.password);
        if (login) {
            res.end(JSON.stringify({
                "loggedIn": true
            }));
        }
        else {
            res.end(JSON.stringify({
                "loggedIn": false
            }));
        }
    });
}
async function isRegistered(email, password) {
    let credentialsCursor = await loginDatenCollection.find({ "email": email, "password": password });
    let credentailsArray = await credentialsCursor.toArray();
    console.log(credentailsArray);
    if (credentailsArray.length === 1) {
        return true;
    }
    else {
        return false;
    }
}
async function handleRegestration(req, res) {
    let data = "";
    req.on("data", chunk => {
        data += chunk.toString();
    });
    req.on("end", async () => {
        let credentialsJSON = JSON.parse(data);
        let credentialsCursor = await loginDatenCollection.find({ "email": credentialsJSON.name });
        let credentailsArray = await credentialsCursor.toArray();
        if (credentailsArray.length === 0) {
            loginDatenCollection.insertOne({
                "email": credentialsJSON.name,
                "password": credentialsJSON.password
            });
            res.end(JSON.stringify({
                "registered": true
            }));
        }
        else {
            res.end(JSON.stringify({
                "registered": false
            }));
        }
    });
}
async function handleCreateRezept(req, res) {
    let data = "";
    req.on("data", chunk => {
        data += chunk.toString();
    });
    req.on("end", async () => {
        let rezepteJSON = JSON.parse(data);
        console.log(rezepteJSON);
        rezeptCollection.insertOne(rezepteJSON);
        res.end(JSON.stringify({
            "registered": false
        }));
    });
}
async function getRezepte(res, author) {
    let rezepteCollection;
    if (author) {
        rezepteCollection = await rezeptCollection.find({ "author": author });
    }
    else {
        rezepteCollection = await rezeptCollection.find();
    }
    let rezepteArray = await rezepteCollection.toArray();
    res.end(JSON.stringify(rezepteArray));
}
async function getRezept(id, res) {
    let mongoId = new Mongo.ObjectId(id);
    let rezepteCollection = await rezeptCollection.find({ _id: mongoId });
    let rezepteArray = await rezepteCollection.toArray();
    res.end(JSON.stringify(rezepteArray[0]));
}
async function deleteRezept(id, res) {
    let mongoId = new Mongo.ObjectId(id);
    let result = await rezeptCollection.deleteOne({ _id: mongoId });
    let deleted;
    if (result.deletedCount > 1) {
        deleted = true;
    }
    else {
        deleted = false;
    }
    res.end(JSON.stringify({
        "delted": deleted
    }));
}
async function updateRezept(id, req, res) {
    let data = "";
    let mongoId = new Mongo.ObjectId(id);
    req.on("data", chunk => {
        data += chunk.toString();
    });
    req.on("end", async () => {
        let rezeptJSON = JSON.parse(data);
        console.log(rezeptJSON);
        let result = await rezeptCollection.updateOne({ _id: mongoId }, { $set: rezeptJSON });
        let success;
        if (result.modifiedCount > 0) {
            success = true;
        }
        else {
            success = false;
        }
        res.end(JSON.stringify({
            "successful_updated": success
        }));
    });
}
async function getRezepteLikedBy(author, res) {
    let rezepteCollection = await rezeptCollection.find({ likedBy: author });
    let rezepteArray = await rezepteCollection.toArray();
    res.end(JSON.stringify(rezepteArray));
}
async function likeRezept(user, id, res) {
    let mongoId = new Mongo.ObjectId(id);
    let result = await rezeptCollection.updateOne({ _id: mongoId }, { $addToSet: { "likedBy": user } });
    let success;
    if (result.modifiedCount > 0) {
        success = true;
    }
    else {
        success = false;
    }
    res.end(JSON.stringify({
        "successful_updated": success
    }));
}
async function unlikeRezept(user, id, res) {
    let mongoId = new Mongo.ObjectId(id);
    let result = await rezeptCollection.updateOne({ _id: mongoId }, { $pull: { "likedBy": user } });
    let success;
    if (result.modifiedCount > 0) {
        success = true;
    }
    else {
        success = false;
    }
    res.end(JSON.stringify({
        "successful_updated": success
    }));
}
//# sourceMappingURL=server.js.map