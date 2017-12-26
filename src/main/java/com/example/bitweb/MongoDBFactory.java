package com.example.bitweb;


import com.mongodb.Block;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.async.SingleResultCallback;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.changestream.ChangeStreamDocument;
import com.mongodb.client.model.changestream.FullDocument;
import org.bson.Document;

import static java.util.Arrays.asList;

public class MongoDBFactory {

    public static MongoClient getMongoClient() {
        MongoClientURI connectionString = new MongoClientURI("mongodb://htcvtc59:GTj5xX7Z@ds163796.mlab.com:63796/bitweb");
        MongoClient mongoClient = new MongoClient(connectionString);
        return mongoClient;
    }

    public static MongoDatabase getMongoDatabase() {
        MongoClient mongoClient = getMongoClient();
        MongoDatabase database = mongoClient.getDatabase("bitweb");
        return database;
    }

    public static MongoCollection getCollectionaccounts() {
        MongoCollection<Document> accounts = getMongoDatabase().getCollection("accounts");
        return accounts;
    }

    public static MongoCollection getCollectionhistory() {
        MongoCollection<Document> history = getMongoDatabase().getCollection("history");
        return history;
    }

    public static MongoCollection getCollectionmarket() {
        MongoCollection<Document> market = getMongoDatabase().getCollection("market");
        return market;
    }

}
