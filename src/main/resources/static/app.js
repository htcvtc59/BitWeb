var ws;
var stompClient;

var accountlogin = {
    acc_name: null,
    acc_btc: null,
    acc_usd: null,
    acc_id: null
}


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
                      <td class="sell_click_by sell_per` + element._id.$oid + `" data-id="` + element._id.$oid + `"  date-personal="` + element.personal.$oid + `"  >`
                    + element.price_per_btc + `</td>
                      <td class="sell_click_by sell_btc` + element._id.$oid + `" data-id="` + element._id.$oid + `" date-personal="` + element.personal.$oid + `"  >` + element.btc_amount + `</td> 
                      <td class="sell_click_by sell_fee` + element._id.$oid + `" data-id="` + element._id.$oid + `" date-personal="` + element.personal.$oid + `"  >`
                    + element.fee + `</td>
                      <td class="sell_click_by sell_total` + element._id.$oid + `" data-id="` + element._id.$oid + `" date-personal="` + element.personal.$oid + `" >` + element.total + `</td> </tr>`);

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
                      <td class="buy_click_by buy_per` + element._id.$oid + `" data-id="` + element._id.$oid + `"  date-personal="` + element.personal.$oid + `" >`
                    + element.price_per_btc + `</td>
                      <td class="buy_click_by buy_btc` + element._id.$oid + `" data-id="` + element._id.$oid + `"  date-personal="` + element.personal.$oid + `" >` + element.btc_amount + `</td> 
                      <td class="buy_click_by buy_fee` + element._id.$oid + `" data-id="` + element._id.$oid + `"  date-personal="` + element.personal.$oid + `" >`
                    + element.fee + `</td>
                      <td class="buy_click_by buy_total` + element._id.$oid + `" data-id="` + element._id.$oid + `" date-personal="` + element.personal.$oid + `" >` + element.total + `</td> </tr>`);

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
                        ` + typeStyle + `
                        <td>` + "Exchange" + `</td>
                        <td>` + element.price_share + `</td>
                        <td>` + element.amount_usd + `</td>
                        <td>` + element.fee + ` BTC (0.15%)</td>
                        <td>` + element.total + ` BTC</td>
                        <td>` + moment(element.transaction_date.$date).format("DD-MM-YYYY HH:mm:ss a") + `</td>
                    </tr>`)


                // console.log(element._id.$oid);
                // console.log(element.price_share);
                // console.log(element.amount_usd);
                // console.log(element.fee);
                // console.log(element.total);
                // console.log(element.$date);

            });


        });


        // Login

        stompClient.subscribe("/topic/bit-ws/logins", function (message) {
            if (message.body.length > 0) {
                var result = JSON.parse(message.body);
                accountlogin.acc_name = result.acc_name;
                accountlogin.acc_btc = result.acc_btc;
                accountlogin.acc_usd = result.acc_usd;
                accountlogin.acc_id = result._id.$oid;

                $('#status_logined').removeAttr("data-toggle");
                $('#status_logined').removeAttr("data-target");
                // $('#status_logined').attr("data-toggle", "dropdown");
                // $('#status_logined').attr("aria-haspopup", "true");
                // $('#status_logined').attr("aria-expanded", "false");
                $('#status_logined').addClass("dropdown");


                $('#status_logined').html(`<a class="dropdown-toggle"
                 id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Logined
                </a>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <div class="dropdown-item" href="#">Name: ` + accountlogin.acc_name + `</div>
                    <div class="dropdown-item" href="#">BTC: ` + accountlogin.acc_btc + `</div>
                <div class="dropdown-item" href="#">Amount USD: ` + accountlogin.acc_usd + `</div>
                <div class="dropdown-divider"></div>
                    <a  class="dropdown-item" onclick="logout()">Logout</a>
                </div>`);

                // $('#status_logined').text('Logined');
                $('#exampleModalLogin').modal('hide');
            } else {
                var valuelabel = $('#exampleModalLabelLogin').text();
                $('#exampleModalLabelLogin').text(valuelabel + "         " + "Account Fail");
            }

        });


        // Sell
        stompClient.subscribe("/topic/bit-ws/sell_val", function (message) {
            var result = JSON.parse(message.body);

            var id = result._id.$oid;
            var price_per_btc = result.price_per_btc;
            var btc_amount = result.btc_amount;
            var total = result.total;
            var fee = result.fee;
            var personalsell = result.personal.$oid;


            $('#sell_content_value').prepend(`<tr id="sell_` + id + `" >
                          <td class="sell_click_by sell_per` + id + `" data-id="` + id + `"  date-personal="` + personalsell + `" >`
                + price_per_btc + `</td>
                          <td class="sell_click_by sell_btc` + id + `" data-id="` + id + `"  date-personal="` + personalsell + `" >` + btc_amount + `</td>
                          <td class="sell_click_by sell_fee` + id + `" data-id="` + id + `"  date-personal="` + personalsell + `" >`
                + fee + `</td>
                          <td class="sell_click_by sell_total` + id + `" data-id="` + id + `" date-personal="` + personalsell + `" >` + total + `</td> </tr>`);


        });

        // Buy
        stompClient.subscribe("/topic/bit-ws/buy_val", function (message) {

            alert(message.body);

        });

    }, function (error) {
        console.log("STOMP protocol error : " + error);
    });


    // Login form

    $('#form_login').click(function (e) {
        e.preventDefault();
        var name = $('#logininputName').val();
        var pass = $('#logininputPassword').val();
        stompClient.send("/app/bit-ws/logins", {}, JSON.stringify({name: name, pass: pass}));
    });


    //Sell Form
    $('form.form_Sell').on("submit", function (e) {
        e.preventDefault();
        var valueform = $(this).serialize();
        var market = jQuery('select[name="market"]').val();
        var price_per = jQuery('input[name="price_per"]').val();
        var btc = jQuery('input[name="btc"]').val();
        var usd = jQuery('input[name="usd"]').val();

        if (accountlogin.acc_name === null) {
            alert("You must login , please!");
        } else {
            stompClient.send("/app/bit-ws/sell_val", {}, JSON.stringify({
                market: market,
                price_per: price_per,
                btc: btc,
                usd: usd,
                type: "sell",
                id: accountlogin.acc_id
            }));
        }


    });

    //Buy Form
    $('form.form_Buy').on("submit", function (e) {
        e.preventDefault();
        var valueform = $(this).serialize();
        var market = jQuery('select[name="market"]').val();
        var price_per = jQuery('input[name="price_per"]').val();
        var btc = jQuery('input[name="btc"]').val();
        var usd = jQuery('input[name="usd"]').val();

        if (accountlogin.acc_name === null) {
            alert("You must login , please!");
        } else {
            stompClient.send("/app/bit-ws/buy_val", {}, JSON.stringify({
                market: market,
                price_per: price_per,
                btc: btc,
                usd: usd,
                type: "buy",
                id: accountlogin.acc_id
            }));
        }

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


function logout() {
    $('#status_logined').html('');
    $('#status_logined').text("Login");

    $('#status_logined').attr("data-toggle","modal");
    $('#status_logined').attr("data-target","#exampleModalLogin");
    $('#status_logined').removeClass("dropdown");

    accountlogin.acc_id = null;
    accountlogin.acc_name = null;
    accountlogin.acc_usd = null;
    accountlogin.acc_btc = null;
}

$(function () {


});


$(document).ready(function () {


});

