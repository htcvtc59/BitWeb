package com.example.bitweb.Controller;


import com.example.bitweb.MongoDBFactory;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.mongodb.client.FindIterable;
import org.bson.Document;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class LoginController {
    @MessageMapping("/bit-ws/logins")
    public String processLogin(String message) {
        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(message, JsonObject.class);
        String name = jsonObject.get("name").getAsString();
        String pass = jsonObject.get("pass").getAsString();

        FindIterable<Document> login = MongoDBFactory.getCollectionaccounts().find(new Document("acc_name", name)
                .append("acc_pass", pass));

        String result = "";
        for (Document doc : login) {
            result = doc.toJson();
        }
        MongoDBFactory.getMongoClient().close();
        if (result.length() > 0) {
            return result;
        } else {
            return "";
        }
    }

}
