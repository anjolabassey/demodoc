$(document).ready(function() {
  let contentHolder = $("#content");
  let user;
  let flwAuthToken;
  let API_publicKey;
  let API_secretKey;
  let loginButton = $("#login");
  let getKeys = $("#submit");

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

  // Append copy buttons to all code sinppets on document ready
  $(".highlight")
    .append(copyButton)
    .click(".copy-btn", function() {
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

  $(".left-nav").on("click", ".get-content", function(e) {
    e.preventDefault();
    var addedUrl = $(this).attr("id");

    $(this).addClass("active");

    $.ajax({
      url:
        "https://api.github.com/repos/anjolabassey/test-docs/contents" +
        addedUrl,
      type: "get",
      success: function(data) {
        // let con = atob(response.content);
        let con = b64DecodeUnicode(data.content);

        // If you're in the browser, the Remarkable class is already available in the window
        var md = new Remarkable({
          html: true
        });

        $(".doc-content").html(md.render(con));
        $(".doc-content H2").attr("name", "h2");

        // console.log(md.render(con));

        // console.log($("pre").html());
        $("pre").addClass("highlight");
        // $("pre").prepend('<button class"copy-btn"> Copy </button>').click("", function () {
        //   console.log("clicked");
        // });

          html = $.parseHTML(md.render(con)),
          nodeNames = [];      

        $.each(html, function (i, el) {
          console.log(el.nodeName);
          if (el.nodeName == "H2") {
            nodeNames[i] = '<li class="listing" href="#h2">' + el.innerText + "</li>";
          }
         
        });
        console.log(html)

        $("#log").append("<h4>TABLE OF CONTENTS</h4>");
        $("<ol></ol>")
          .append(nodeNames.join(""))
          .appendTo("#log");

        // Append copy buttons to all code sinppets on document ready
        $(".highlight")
          .append(copyButton)
          .click(".copy-btn", function() {
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
      error: function(xhr, textStatus, errorThrown) {
        var errorText = xhr.responseJSON;
        console.log(errorText);
      }
    });
  });

  // displaying search modal when seach bar is clicked
  $(".searchWrapper").click(function() {
    $(".searchModal").removeClass("hide");
  });

  // When the user clicks anywhere outside of the modal, close it
  $(document).on("click", function(event) {
    // console.log(event.target.className);
    // console.log($(".searchModal"))
    if (event.target == $(".searchModal")) {
      $(".searchModal").addClass("hide");
    }
  });

  // Decoding string from github API response
  function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(
      atob(str)
        .split("")
        .map(function(c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }

  loginButton.click(function() {
    window.open(
      "/login",
      null,
      "height=200,width=400,status=yes,toolbar=no,menubar=no,location=no"
    );

    keyObject = window.localStorage.getItem("liveKeys");
  });

  getKeys.click(function(e) {
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

    var loggedIn = $.ajax({
      url: "https://api.ravepay.co/login",
      type: "post",
      data: requestObject,
      headers: {
        "v3-xapp-id": 1
      },
      dataType: "json",
      success: function(data) {
        flwAuthToken = data.data["flw-auth-token"];
        user = data.data.user["first_name"];
        window.sessionStorage.setItem("user", user);
      },
      error: function(xhr, textStatus, errorThrown) {
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

    loggedIn.done(function() {
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
        success: function(data) {
          console.log("just toggled to test");
          console.log(data);
        },
        error: function(xhr, textStatus, errorThrown) {
          var errorText = xhr.responseJSON;

          $(".error").remove();
          $("#submit").after(
            '<span class="error">' + errorText.message + "</span>"
          );
        }
      }).done(function() {
        console.log("get the keys now");

        $.ajax({
          url: "https://api.ravepay.co/v2/merchantkeys?include_v1_keys=1",
          type: "get",
          headers: {
            "flw-auth-token": flwAuthToken,
            alt_mode_auth: 0
          },
          dataType: "json",
          success: function(data) {
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
          error: function(xhr, textStatus, errorThrown) {
            var errorText = xhr.responseJSON;
            console.log(errorText);
            $(".error").remove();
            $("#submit").after('<span class="error">' + errorText + "</span>");
          }
        }).done(function() {
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
            success: function(data) {
              console.log("just toggled to live");
              console.log(data);
            },
            error: function(xhr, textStatus, errorThrown) {
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
});
