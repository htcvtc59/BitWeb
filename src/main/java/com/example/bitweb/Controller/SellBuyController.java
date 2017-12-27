package com.example.bitweb.Controller;


import com.example.bitweb.MongoDBFactory;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.model.Filters;
import org.bson.BsonDouble;
import org.bson.BsonInt32;
import org.bson.BsonObjectId;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.util.Date;
import java.util.Random;


@Controller
public class SellBuyController {
    @MessageMapping("/bit-ws/sell_val")
    public String processSell(String message) {
        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(message, JsonObject.class);
        String market = jsonObject.get("market").getAsString();
        String price_per = jsonObject.get("price_per").getAsString();
        String btc = jsonObject.get("btc").getAsString();
        String usd = jsonObject.get("usd").getAsString();
        String type = jsonObject.get("type").getAsString();
        String id = jsonObject.get("id").getAsString();

        Document doc = new Document("price_per_btc", new BsonDouble(Double.valueOf(price_per)))
                .append("btc_amount", new BsonDouble(Double.valueOf(btc)))
                .append("fee", new BsonDouble(Double.valueOf(0.15)))
                .append("type", type)
                .append("total", new BsonDouble(Double.valueOf(usd)))
                .append("personal", new ObjectId(id))
                .append("createdat", new Date(new Date().getTime()))
                .append("category", new Document("waiting", new BsonInt32(1))
                        .append("exchange", new BsonInt32(0)));
        MongoDBFactory.getCollectionmarket().insertOne(doc);

        ObjectId idresult = (ObjectId) doc.get("_id");

        String result = "";

        FindIterable<Document> resultsell = MongoDBFactory.getCollectionmarket().find(new Document("_id", idresult));
        for (Document docs : resultsell) {
            result +=docs.toJson();
        }

        MongoDBFactory.getMongoClient().close();
        return result;
    }

    @MessageMapping("/bit-ws/buy_val")
    public String processBuy(String message) {

        System.out.println(message);


        return "";
    }
}
