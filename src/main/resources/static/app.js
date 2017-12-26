var ws;
var stompClient;


$(document).ready(function () {
    ws = new SockJS("/bit-ws");
    stompClient = Stomp.over(ws);

    stompClient.connect({}, function (frame) {
        loadingPage();

        stompClient.subscribe("/topic/bit-ws/accounts", function (message) {
            // console.log("Received: " + message.body);
            var result = JSON.parse(message.body);
            var name = result.acc_name;
            var pass = result.acc_pass;
            var btc = result.acc_btc;
            var usd = result.acc_usd;

            $('#accountsname').text("Name: " + name);
            $('#accountspass').text("Pass: " + pass);
            $('#accountsbtc').text("BTC: " + btc);
            $('#accountsamount').text("Amount USD: " + usd);
        });

        stompClient.subscribe("/topic/bit-ws/sell", function (message) {
            $.each(JSON.parse(message.body), function (index, element) {
                $('#sell_content_value').append(`<tr id="sell_` + element._id.$oid + `" >
                      <td class="sell_click_by sell_per` + element._id.$oid + `" data-id="` + element._id.$oid + `" >`
                    + element.price_per_btc + `</td>
                      <td class="sell_click_by sell_btc` + element._id.$oid + `" data-id="` + element._id.$oid + `" >` + element.btc_amount + `</td> 
                      <td class="sell_click_by sell_fee` + element._id.$oid + `" data-id="` + element._id.$oid + `" >`
                    + element.fee + `</td>
                      <td class="sell_click_by sell_total` + element._id.$oid + `" data-id="` + element._id.$oid + `">` + element.total + `</td> </tr>`);

                // console.log(element._id.$oid);
                // console.log(element.price_per_btc);
                // console.log(element.btc_amount);
                // console.log(element.fee);
                // console.log(element.total);

            });


        });

        stompClient.subscribe("/topic/bit-ws/buy", function (message) {
            $.each(JSON.parse(message.body), function (index, element) {

                $('#buy_content_value').append(`<tr id="buy_` + element._id.$oid + `" >
                      <td class="buy_click_by buy_per` + element._id.$oid + `" data-id="` + element._id.$oid + `" >`
                    + element.price_per_btc + `</td>
                      <td class="buy_click_by buy_btc` + element._id.$oid + `" data-id="` + element._id.$oid + `" >` + element.btc_amount + `</td> 
                      <td class="buy_click_by buy_fee` + element._id.$oid + `" data-id="` + element._id.$oid + `" >`
                    + element.fee + `</td>
                      <td class="buy_click_by buy_total` + element._id.$oid + `" data-id="` + element._id.$oid + `">` + element.total + `</td> </tr>`);

                // console.log(element._id.$oid);
                // console.log(element.price_per_btc);
                // console.log(element.btc_amount);
                // console.log(element.fee);
                // console.log(element.total);

            });


        });


        stompClient.subscribe("/topic/bit-ws/history", function (message) {
            $.each(JSON.parse(message.body), function (index, element) {
                var typeStyle = '';
                if (element.type === "sell") {
                    typeStyle = `<td style="color: #ef5350;">Sell</td>`;
                } else {
                    typeStyle = `<td style="color: #4caf50" >Buy</td>`;
                }

                $('#history_content_value').append(`
                <tr id="` + element._id.$oid + `">
                        <td>` + element.market.toUpperCase() + `</td>
                        `+typeStyle+`
                        <td>`+"Exchange"+`</td>
                        <td>` + element.price_share + `</td>
                        <td>` + element.amount_usd + `</td>
                        <td>` + element.fee + ` BTC (0.15%)</td>
                        <td>` + element.total + ` BTC</td>
                        <td>` + moment(element.$date).format('DD/MM/YYYY h:mm:ss a')+ `</td>
                    </tr>`)


                // console.log(element._id.$oid);
                // console.log(element.price_share);
                // console.log(element.amount_usd);
                // console.log(element.fee);
                // console.log(element.total);
                // console.log(element.$date);

            });


        });


    }, function (error) {
        console.log("STOMP protocol error : " + error);
    });


});

function sendForm() {
    stompClient.send("/app/bit-ws/accounts", {}, "getaccounts");
}

function loadingPage() {
    stompClient.send("/app/bit-ws/sell", {}, "getsells");
    stompClient.send("/app/bit-ws/buy", {}, "getbuys");

    stompClient.send("/app/bit-ws/history", {}, "gethistorys");

}


$(function () {

    $('#sell_content_value').off('click').on('click', '.sell_click_by', function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        var price = $('.sell_per' + id).text();
        var btc = $('.sell_btc' + id).text();
        var usd = $('.sell_total' + id).text();

        $('#sell_price_text').val(price);
        $('#sell_btcamount_text').val(btc);
        $('#sell_usdamount_text').val(usd);
        $('#sell_resultbtc_text').text(price * btc + " USD");

        $('#buy_price_text').val(price);
        $('#buy_btcamount_text').val(btc);
        $('#buy_usdamount_text').val(usd);
        $('#buy_resultbtc_text').text(price * btc + " USD");


    });

    $('#buy_content_value').off('click').on('click', '.buy_click_by', function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        var price = $('.buy_per' + id).text();
        var btc = $('.buy_btc' + id).text();
        var usd = $('.buy_total' + id).text();


        $('#buy_price_text').val(price);
        $('#buy_btcamount_text').val(btc);
        $('#buy_usdamount_text').val(usd);
        $('#buy_resultbtc_text').text(price * btc + " USD");

        $('#sell_price_text').val(price);
        $('#sell_btcamount_text').val(btc);
        $('#sell_usdamount_text').val(usd);
        $('#sell_resultbtc_text').text(price * btc + " USD");


    });

});

$(function () {


});


$(document).ready(function () {


});

