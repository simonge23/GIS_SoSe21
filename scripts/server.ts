import * as Http from "http";
import * as Mongo from "mongodb";

let port: number = Number (process.env.Port);
let databaseUrl: string = "mongodb+srv://gissose2020:giswise2021@gis-ist-scheisse.zdjmy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
let loginDatenCollection: Mongo.Collection;
let rezeptCollection: Mongo.Collection;


if (!port) {
    port = 8100;
}

serverInit(port);

async function serverInit (_port: number): Promise<void> {
    let server: Http.Server = Http.createServer();
    await connectToDB(databaseUrl);
    
    server.addListener("request", handleRequest);
    
    server.addListener("listening", function (): void {
        console.log("listening on Port: " + _port);
    });

    server.listen(_port);
}

async function connectToDB (_url: string): Promise<void> {
    let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, { useUnifiedTopology: true });
    await mongoClient.connect();
    
    if (mongoClient.isConnected) {
        console.log("DB is connected");
    }
    loginDatenCollection = mongoClient.db("Rezeptewebsite").collection("loginDaten");
    rezeptCollection = mongoClient.db("Rezeptewebsite").collection("rezepte");
}

async function handleRequest (req: Http.IncomingMessage, res: Http.ServerResponse): Promise<void> {
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Origin", "*");
    const baseURL: string = "http://" + req.headers.host + "/";
    if (req.url) {
        let url: URL = new URL (req.url, baseURL);
        console.log(url.pathname, url.search);
        if (url.pathname === "/login") {
            handleLogin(req, res);
        } else if (url.pathname === "/regestrierung") {
            console.log(url.pathname);
            handleRegestration(req, res);
        } else if (url.pathname === "/rezepte") {
            getRezepte(res, url.searchParams.get("author"));
        }  else if (url.pathname === "/rezepte/likedby") {
            getRezepteLikedBy(url.searchParams.get("user"), res);
        } else if (url.pathname === "/rezepte/likedby/add") {
            likeRezept(url.searchParams.get("user"), url.searchParams.get("id"), res);
        } else if (url.pathname === "/rezepte/likedby/remove") {
            unlikeRezept(url.searchParams.get("user"), url.searchParams.get("id"), res);
        } else if (url.pathname === "/rezept") {
            getRezept(url.searchParams.get("id"), res);
        } else if (url.pathname === "/rezept/create") {
            handleCreateRezept(req, res); 
        } else if (url.pathname === "/rezept/delete") {
            deleteRezept(url.searchParams.get("id"), res);
        } else if (url.pathname === "/rezept/update") {
            updateRezept(url.searchParams.get("id"), req, res);
        }
    }
}

function handleLogin(req: Http.IncomingMessage, res: Http.ServerResponse): void {
    let data: string = "";
    req.on("data", chunk => {
        data += chunk.toString();
    });
    req.on("end", async () => {
        let credentialsJSON: Credentials = JSON.parse(data);
        let login: boolean = await isRegistered(credentialsJSON.name, credentialsJSON.password);
        if (login) {
            res.end(JSON.stringify({
                "loggedIn": true
            }));
        } else {
            res.end(JSON.stringify({
                "loggedIn": false
            }));
        }
    });
}

async function isRegistered(email: string, password: string): Promise<boolean> {
    let credentialsCursor: Mongo.Cursor<string> = await loginDatenCollection.find({"email": email, "password": password});
    let credentailsArray: string[] = await credentialsCursor.toArray();
    console.log(credentailsArray);
    if (credentailsArray.length === 1) {
        return true;
    } else {
        return false;
    }
}

async function handleRegestration(req: Http.IncomingMessage, res: Http.ServerResponse): Promise<void> {
    let data: string = "";
    req.on("data", chunk => {
        data += chunk.toString();
    });
    req.on("end", async () => {
        let credentialsJSON: Credentials = JSON.parse(data);
        let credentialsCursor: Mongo.Cursor<string> = await loginDatenCollection.find({"email": credentialsJSON.name});
        let credentailsArray: string[] = await credentialsCursor.toArray();
        if (credentailsArray.length === 0) {
            loginDatenCollection.insertOne({
                "email": credentialsJSON.name,
                "password": credentialsJSON.password
            });
            res.end(JSON.stringify({
                "registered": true
            }));
        } else {
            res.end(JSON.stringify({
                "registered": false
            }));
        }

        
    });
}

async function handleCreateRezept(req: Http.IncomingMessage, res: Http.ServerResponse): Promise<void> {
    let data: string = "";
    req.on("data", chunk => {
        data += chunk.toString();
    });
    req.on("end", async () => {
        let rezepteJSON: Rezept = JSON.parse(data);
        console.log(rezepteJSON);
        rezeptCollection.insertOne(rezepteJSON);
        res.end(JSON.stringify({
            "registered": false
        }));
    });
}

async function getRezepte(res: Http.OutgoingMessage, author?: string): Promise<void> {
    let rezepteCollection: Mongo.Cursor<string>;
    if (author) {
        rezepteCollection = await rezeptCollection.find({"author": author});
    } else {
        rezepteCollection = await rezeptCollection.find();
    }
    let rezepteArray: string[] = await rezepteCollection.toArray();
    res.end(JSON.stringify(rezepteArray));
}

async function getRezept(id: string, res: Http.OutgoingMessage): Promise<void> {
    let mongoId: Mongo.ObjectId = new Mongo.ObjectId(id);
    let rezepteCollection: Mongo.Cursor<string> = await rezeptCollection.find({_id: mongoId});
    let rezepteArray: string[] = await rezepteCollection.toArray();
    res.end(JSON.stringify(rezepteArray[0]));
}

async function deleteRezept(id: string, res: Http.OutgoingMessage): Promise<void>{
    let mongoId: Mongo.ObjectId = new Mongo.ObjectId(id);
    let result: Mongo.DeleteWriteOpResultObject = await rezeptCollection.deleteOne({_id: mongoId});
    let deleted: boolean;
    if (result.deletedCount > 1) {
        deleted = true;
    } else {
       deleted = false;
    }
    res.end(JSON.stringify({
        "delted": deleted
    }));
}

async function updateRezept(id: string, req: Http.IncomingMessage, res: Http.OutgoingMessage): Promise<void>{
    let data: string = "";
    let mongoId: Mongo.ObjectId = new Mongo.ObjectId(id);
    req.on("data", chunk => {
        data += chunk.toString();
    });
    req.on("end", async () => {
        let rezeptJSON: Rezept = JSON.parse(data);
        console.log(rezeptJSON);
        let result: Mongo.UpdateWriteOpResult = await rezeptCollection.updateOne({_id: mongoId}, {$set: rezeptJSON});
        let success: boolean;
        if (result.modifiedCount > 0) {
            success = true;
        } else {
            success = false;
        }
        res.end(JSON.stringify({
            "successful_updated": success
        }));
    });
}

async function getRezepteLikedBy(author: string, res: Http.OutgoingMessage): Promise<void> {
    let rezepteCollection: Mongo.Cursor<string> = await rezeptCollection.find({likedBy: author});
    let rezepteArray: string[] = await rezepteCollection.toArray();
    res.end(JSON.stringify(rezepteArray));
}

async function likeRezept(user: string, id: string, res: Http.OutgoingMessage): Promise<void> {
    let mongoId: Mongo.ObjectId = new Mongo.ObjectId(id);
    let result: Mongo.UpdateWriteOpResult = await rezeptCollection.updateOne({_id: mongoId}, {$addToSet: {"likedBy": user}});
    let success: boolean;
    if (result.modifiedCount > 0) {
        success = true;
    } else {
        success = false;
    }
    res.end(JSON.stringify({
        "successful_updated": success
    }));
}

async function unlikeRezept(user: string, id: string, res: Http.OutgoingMessage): Promise<void> {
    let mongoId: Mongo.ObjectId = new Mongo.ObjectId(id);
    let result: Mongo.UpdateWriteOpResult = await rezeptCollection.updateOne({_id: mongoId}, {$pull: {"likedBy": user}});
    let success: boolean;
    if (result.modifiedCount > 0) {
        success = true;
    } else {
        success = false;
    }
    res.end(JSON.stringify({
        "successful_updated": success
    }));
}