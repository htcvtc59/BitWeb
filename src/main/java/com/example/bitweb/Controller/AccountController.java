package com.example.bitweb.Controller;


import com.example.bitweb.MongoDBFactory;
import org.bson.BsonDouble;
import org.bson.BsonInt32;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import java.util.Date;
import java.util.Random;

@Controller
public class AccountController {
    @MessageMapping("/bit-ws/accounts")
    public String processAccount(String message) {
        String result = "";

        Document doc = new Document("acc_name", "name_" + new Random().nextInt(100))
                .append("acc_pass", "1234").append("acc_btc", new BsonInt32(1000))
                .append("acc_usd", new BsonDouble(10000))
                .append("acc_create_date", new Date(new Date().getTime()));
        MongoDBFactory.getCollectionaccounts().insertOne(doc);


        Document docresult = new Document("_id", (ObjectId) doc.get("_id"))
                .append("acc_name", doc.get("acc_name"))
                .append("acc_pass", doc.get("acc_pass")).append("acc_btc", doc.get("acc_btc"))
                .append("acc_usd", doc.get("acc_usd"))
                .append("acc_create_date", doc.get("acc_create_date"));


        MongoDBFactory.getMongoClient().close();
        return docresult.toJson();
    }

}
