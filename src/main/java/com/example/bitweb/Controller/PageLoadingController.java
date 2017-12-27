package com.example.bitweb.Controller;

import com.example.bitweb.MongoDBFactory;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.mongodb.client.FindIterable;
import com.mongodb.client.model.Filters;
import org.bson.Document;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class PageLoadingController {
    @MessageMapping("/bit-ws/sell")
    public String processLoadingSell(String message) {
        String result = "";
        FindIterable<Document> sell = MongoDBFactory.getCollectionmarket()
                .find(Filters.text("sell")).limit(10);

        JsonArray array = new JsonArray();
        for (Document doc : sell) {
            result += doc.toJson();
            JsonElement element = new Gson().fromJson(doc.toJson(), JsonElement.class);
            array.add(element);
        }
        MongoDBFactory.getMongoClient().close();
        return array.toString();
    }

    @MessageMapping("/bit-ws/buy")
    public String processLoadingBuy(String message) {
        String result = "";
        FindIterable<Document> buy = MongoDBFactory.getCollectionmarket()
                .find(Filters.text("buy")).limit(10);

        JsonArray array = new JsonArray();
        for (Document doc : buy) {
            result += doc.toJson();
            JsonElement element = new Gson().fromJson(doc.toJson(), JsonElement.class);
            array.add(element);
        }
        MongoDBFactory.getMongoClient().close();
        return array.toString();
    }

    @MessageMapping("/bit-ws/history")
    public String processLoadingHistory(String message) {
        String result = "";
        FindIterable<Document> buy = MongoDBFactory.getCollectionhistory()
                .find();

        JsonArray array = new JsonArray();
        for (Document doc : buy) {
            result += doc.toJson();
            JsonElement element = new Gson().fromJson(doc.toJson(), JsonElement.class);
            array.add(element);
        }
        MongoDBFactory.getMongoClient().close();
        return array.toString();
    }

}
