$(document).ready(function () {
  let contentHolder = $("#content");
  let user, reference, token;
  let flwAuthToken;
  let API_publicKey;
  let API_secretKey;
  let pubKey = "FLWPUBK_TEST-0db01907c1b990c273c365a696c1613d-X";
  let secKey = "FLWSECK_TEST-624d8f04393b01cac90d02f562b26389-X";
  let loginButton = $("#login");
  let getKeys = $("#submit");
  let payButton = $("#pay");
  let chargeTitle = $("#charge");
  let verifyTitle = $("#verify");
  let paymentplanTitle = $("#paymentplan");
  let tokenizeTitle = $("#tokenize");
  let successTitle = $("#success");
  let codebox = $(".codebox");
  let codeboxBanner = $("#banner");

  var copyButton = $("<button/>", {
    text: "Copy",
    class: "copy-btn"
  });
  var copyArea = $("<input />", {
    placeholder: "placeholder for copied text",
    class: "copy-area",
    id: "copied"
  });
  var userInfo = $("<div />", {
    class: "user-image"
  });
  var userSpan = $("<p>" + user + "</p>");

  function displayUser() {
    $("#login").remove();
    $("user-image").append(userSpan);
    $(".header-nav").append(userInfo);
  }

   // Anchor links functionality for all headers
    const appendAnchorLinks = function () {
    const headings = document.querySelectorAll("h2,h3");
    const linkContent = "  &#9875";
  
    for (const heading of headings) {
      const linkIcon = document.createElement("a");
      linkIcon.setAttribute("href", `#${heading.id}`);
      linkIcon.setAttribute("class", "anchor");
      linkIcon.innerHTML = linkContent;
      heading.append(linkIcon);
    }
    };
  
  

  

  appendAnchorLinks();
  // Append copy buttons to all code snippets on document ready
  $(".highlight")
    .append(copyButton)
    .click(".copy-btn", function () {
      $("#inputContainer").append(copyArea);
      var content = $(this)
        .text()
        .slice(0, -4);

      $("#copied").val(content);

      API_publicKey = window.localStorage.getItem("API_publicKey");
      API_secretKey = window.localStorage.getItem("API_secretKey");

      var pub = content.search("pin");
      var sec = content.search("ravepay");
      if (pub > 0) {
        content = content.replace("pin", "newpin");
        $("#copied").val(content);
      } else if (sec > 0) {
        content = content.replace("ravepay", "newRavepay");
        $("#copied").val(content);
      } else {
        console.log("not here");
      }

      var copyText = $("#copied");

      copyText.select();
      document.execCommand("copy");
      copyArea.remove();
    });

  $(".left-nav").on("click", ".get-content", function (e) {
    $("#log").html("");
    e.preventDefault();
    var addedUrl = $(this).attr("id");

    $(this).addClass("active");

    $.ajax({
      url:
        "https://api.github.com/repos/anjolabassey/test-docs/contents" +
        addedUrl,
      type: "get",
      success: function (data) {
        // let con = atob(response.content);
        let con = b64DecodeUnicode(data.content);

        // If you're in the browser, the Remarkable class is already available in the window
        var md = new Remarkable({
          html: true
        });

        $(".doc-content").html(md.render(con));
        $(".doc-content H2").attr("id", "h2");

        // console.log(md.render(con));

        // console.log($("pre").html());
        $("pre").addClass("highlight");

        (html = $.parseHTML(md.render(con))), (nodeNames = []);

        $.each(html, function (i, el) {
          if (el.nodeName == "H2") {
            nodeNames[i] =
              '<li class="listing"><a href="#h2">' + el.innerText + "</li></a>";
          }
        });

        $("#log").append("<h4>TABLE OF CONTENTS</h4>");
        $("<ol></ol>")
          .append(nodeNames.join(""))
          .appendTo("#log");
        
        
  appendAnchorLinks();

        // Append copy buttons to all code sinppets on document ready
        $(".highlight")
          .append(copyButton)
          .click(".copy-btn", function () {
            $("#inputContainer").append(copyArea);
            var content = $(this)
              .text()
              .slice(0, -4);

            $("#copied").val(content);

            var pub = content.search("pin");
            var sec = content.search("ravepay");
            if (pub > 0) {
              content = content.replace("pin", "newpin");
              $("#copied").val(content);
            } else if (sec > 0) {
              content = content.replace("ravepay", "newRavepay");
              $("#copied").val(content);
            } else {
              console.log("not here");
            }

            var copyText = $("#copied");

            copyText.select();
            document.execCommand("copy");
            copyArea.remove();
          });
      },
      error: function (xhr, textStatus, errorThrown) {
        var errorText = xhr.responseJSON;
        console.log(errorText);
      }
    });

    
  });

  // displaying search modal when seach bar is clicked
  $(".searchWrapper").click(function () {
    $(".searchModal").removeClass("hide");
    $(".searchBox").blur();
    $(".ais-search-box--input").focus();
  });

  // displaying the right transfer pages when the right nav is clicked
  $(".right-nav").on("change", ".transfer-select", function (e) {
    var gg = $(this).attr("class");
    console.log(gg);
  });

  // When the user clicks anywhere outside of the modal, close it
  $(document).on("click", function (event) {
    // console.log(event.target.className);
    // console.log($(".searchModal"))
    if (event.target == $(".searchModal")) {
      $(".searchModal").addClass("hide");
    }
  });

  $(".modal-close").click(function () {
    console.log("gvh");
    $(".searchModal").removeClass("show");
    $(".searchModal").addClass("hide");
  });

  // Decoding string from github API response
  function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(
      atob(str)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }

  loginButton.click(function () {
    // window.open(
    //   "{{site.baseurl}}/login",
    //   null,
    //   "height=200,width=400,status=yes,toolbar=no,menubar=no,location=no"
    // );

    keyObject = window.localStorage.getItem("liveKeys");
  });

  getKeys.click(function (e) {
    e.preventDefault();

    $("#email").blur();

    let email = $("#email").val();
    let password = $("#password").val();

    $(".error").remove();

    if (email.length < 1) {
      $("#email").after('<span class="error">This field is required</span>');
    }
    if (password.length < 1) {
      $("#password").after('<span class="error">This field is required</span>');
    }

    let requestObject = {
      identifier: email,
      password: password
    };

    getKeys.text("Fetching your test keys");
    getKeys.attr("disabled", true);

    var loggedIn = $.ajax({
      url: "https://api.ravepay.co/login",
      type: "post",
      data: requestObject,
      headers: {
        "v3-xapp-id": 1
      },
      dataType: "json",
      success: function (data) {
        flwAuthToken = data.data["flw-auth-token"];
        user = data.data.user["first_name"];
        window.sessionStorage.setItem("user", user);
      },
      error: function (xhr, textStatus, errorThrown) {
        var errorText = xhr.responseJSON;
        console.log(errorText.message);

        if (
          errorText.message == "identifier is required , password is required"
        ) {
          $(".error").remove();
          $("#submit").after('<span class="error"></span>');
        } else if (
          errorText.message ==
          "Error: You have logged in too many times. Please wait an hour before trying again"
        ) {
          $(".error").remove();
          $("#submit").after(
            '<span class="error">' + errorText.message + "</span>"
          );
        } else {
          $(".error").remove();
          $("#submit").after(
            '<span class="error">' + errorText.message + "</span>"
          );
        }
      }
    });

    loggedIn.done(function () {
      $.ajax({
        url: "https://api.ravepay.co/merchant/accounts/update",
        type: "post",
        data: {
          merchant_status: "test"
        },
        headers: {
          "flw-auth-token": flwAuthToken,
          alt_mode_auth: 0
        },
        dataType: "json",
        success: function (data) {
          console.log("just toggled to test");
          console.log(data);
        },
        error: function (xhr, textStatus, errorThrown) {
          var errorText = xhr.responseJSON;

          $(".error").remove();
          $("#submit").after(
            '<span class="error">' + errorText.message + "</span>"
          );
        }
      }).done(function () {
        console.log("get the keys now");

        $.ajax({
          url: "https://api.ravepay.co/v2/merchantkeys?include_v1_keys=1",
          type: "get",
          headers: {
            "flw-auth-token": flwAuthToken,
            alt_mode_auth: 0
          },
          dataType: "json",
          success: function (data) {
            // var flwAuthToken = data.data["flw-auth-token"];
            console.log(data);
            API_publicKey = data.data.v1keys.public_key;
            API_secretKey = data.data.v1keys.secret_key;

            // Check browser support
            if (typeof Storage !== "undefined") {
              // Store
              window.sessionStorage.setItem("API_publicKey", API_publicKey);
              window.sessionStorage.setItem("API_secretKey", API_secretKey);
            } else {
              console.log(
                "Sorry, your browser does not support Web Storage..."
              );
            }

            // opener.location.reload(true);
            // self.close();
          },
          error: function (xhr, textStatus, errorThrown) {
            var errorText = xhr.responseJSON;
            console.log(errorText);
            $(".error").remove();
            $("#submit").after('<span class="error">' + errorText + "</span>");
          }
        }).done(function () {
          $.ajax({
            url: "https://api.ravepay.co/merchant/accounts/update",
            type: "post",
            data: {
              merchant_status: "prod"
            },
            headers: {
              "flw-auth-token": flwAuthToken,
              alt_mode_auth: 0
            },
            dataType: "json",
            success: function (data) {
              console.log("just toggled to live");
              console.log(data);
            },
            error: function (xhr, textStatus, errorThrown) {
              var errorText = xhr.responseJSON;
              $(".error").remove();
              $("#submit").after(
                '<span class="error">' + errorText.message + "</span>"
              );
            }
          });
        });
      });
    });
  });

  // function to power adding rave to your project section
  payButton.click(function () {

    var x = getpaidSetup({
      PBFPubKey: pubKey,
      customer_email: "user@example.com",
      amount: 2000,
      customer_phone: "234099940409",
      currency: "NGN",
      txref: Date.now(),
      meta: [
        {
          metaname: "flightID",
          metavalue: "AP1234"
        }
      ],
      onclose: function () { },
      callback: function (response) {
        reference = response.tx.txRef; // collect txRef returned and pass to a server page to complete status check.
        console.log("This is the response returned after a charge", response);
        if (
          response.tx.chargeResponseCode == "00" ||
          response.tx.chargeResponseCode == "0"
        ) {
          // redirect to a success page
          chargeTitle.removeClass("text-current").addClass("text-completed");
          $("#charge span")
            .removeClass("trynow-current")
            .addClass("trynow-completed");
          verifyTitle.removeClass("text-waiting").addClass("text-current");
          $("#verify span")
            .removeClass("trynow-waiting")
            .addClass("trynow-current");

          codebox.html(
            `<pre>
            curl --request POST \ 
              --url https://api.ravepay.co/flwv3-pug/getpaidx/api/v2/verify \ 
              --header 'content-type: application/json' \ 
              --data '{"txref":"${reference}","SECKEY":"${secKey}"}'
            </pre>`
          );
          codebox.append(
            "<button id='verifyPayment' class='btn'>Verify Payment</button>"
          );
          codeboxBanner.text(
            "Your card has been charged successfully. Now we verify the payment to get our token for tokenized charges."
          );
          $("#note").html(
            `you can access the token like this: <br> token = response.data.card.card_tokens.embedtoken;`
          );
        } else {
          // redirect to a failure page.
        }

        x.close(); // use this to close the modal immediately after payment.
      }
    });
  });

  // verifying the transaction when the verify payment button is clicked
  $("body").on("click", "#verifyPayment", function () {
    console.log("verifying");
    $.post(
      "https://api.ravepay.co/flwv3-pug/getpaidx/api/v2/verify",
      {
        txref: reference,
        SECKEY: secKey
      },
      function (data, status) {
        token = data.data.card.card_tokens[0].embedtoken;

        paymentplanTitle.removeClass("text-waiting").addClass("text-current");
        $("#paymentplan span")
          .removeClass("trynow-waiting")
          .addClass("trynow-current");
        verifyTitle.removeClass("text-current").addClass("text-completed");
        $("#verify span")
          .removeClass("trynow-current")
          .addClass("trynow-completed");

        codebox.html(
          `<pre>curl --request POST \ 
          --url https://api.ravepay.co/v2/gpx/paymentplans/create \ 
          --data '{"amount":"100",
          "name":"Gate Waters",
          "interval":"hourly",
          "duration":3,
          "seckey":"${secKey}"}'</pre>`
        );
        codebox.append(
          "<button id='createPlan' class='btn'>Create Plan</button>"
        );
        codeboxBanner.text(
          "On successful verification, we will store the token for future tokenized charges. We now have to create a plan for subscriptions"
        );
      }
    );
  });

  // create a payment plan when the payment plan button is clicked
  $("body").on("click", "#createPlan", function () {
    $.post(
      "https://api.ravepay.co/v2/gpx/paymentplans/create",
      {
        amount: "100",
        name: "Gate Waters",
        interval: "hourly",
        duration: "3",
        seckey: secKey
      },
      function (data, status) {
        planId = data.data.id;

        tokenizeTitle.removeClass("text-waiting").addClass("text-current");
        $("#tokenize span")
          .removeClass("trynow-waiting")
          .addClass("trynow-current");
        paymentplanTitle.removeClass("text-current").addClass("text-completed");
        $("#paymentplan span")
          .removeClass("trynow-current")
          .addClass("trynow-completed");

        codebox.html(`<pre>
        curl --request POST \
          --url https://api.ravepay.co/flwv3-pug/getpaidx/api/tokenized/charge \ 
          --data '{"SECKEY":"${secKey}",
          "duration":"3",
          "interval":"hourly",
          "name":"Gate Waters",
          "amount":"100"}'</pre>`);
        codebox.append(
          "<button id='tokenizedCharge' class='btn'>Tokenized Recurring Charge</button>"
        );
        codeboxBanner.text(
          "You have successfully created a payment plan, you can now add it to your charge payload to start a subscription."
        );
        codebox.append("<div id='note'></div>");
        $("#note").html(
          "You can access the payment plan like this: var planId = data.data.id;<br> you can also add the token gotten earlier to charge our saved card"
        );
      }
    );
  });

  // tokenized recurring charge
  $("body").on("click", "#tokenizedCharge", function () {
    $.post(
      "https://api.ravepay.co/flwv3-pug/getpaidx/api/tokenized/charge",
      {
        SECKEY: secKey,
        name: "Gate Waters",
        token: token,
        currency: "NGN",
        country: "NG",
        amount: 300,
        email: "user@example.com",
        txRef: "MC-835468",
        payment_plan: planId
      },
      function (data, status) {
        console.log(data);

        tokenizeTitle.removeClass("text-current").addClass("text-completed");
        $("#tokenize span")
          .removeClass("trynow-current")
          .addClass("trynow-completed");
        successTitle.removeClass("text-waiting").addClass("text-current");
        $("#success span")
          .removeClass("trynow-waiting")
          .addClass("trynow-current");

        codebox.html('<pre>closing tex</pre>');
        codebox.remove(
          "<button id='tokenizedCharge' class='btn'>Tokenized Recurring Charge</button>"
        );
        codeboxBanner.text(
          "You have successfully added rave to your project by charging a card, saving that card and creating a subscription for the user"
        );
        
      }
    );
  });



});
