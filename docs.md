---
layout: post
title: defaultdoc
permalink: /docs/
---

<div id="content">
</div>

Getting Started With The Nodejs SDK
==================
The official Nodejs SDK for making both Account and Card charges

{% include notes.html content="this is a sample note" %}


Step 1
------
Install rave in your project


```
npm install ravepay
```

Step 2
------

```
var Ravepay = require('ravepay');
var rave = new Ravepay(PUBLICK_KEY, SECRET_KEY, PRODUCTION_FLAG);
```

**If you pass true as the value for PRODUCTION_FLAG, the library will use the production url
as the base for all calls. Otherwise it will use the staging base url;**


{% highlight javascript %}
var rave = new Ravepay(PUBLICK_KEY, SECRET_KEY, PRODUCTION_FLAG); //Base url is 'http://'
var rave = new Ravepay(PUBLICK_KEY, SECRET_KEY, true); //Base url is 'http://api.ravepay.co'
{% endhighlight %}



### Step 3
**To charge a card, construct an object with the payment details and pass to
ravePay Card charge method.**

{% highlight javascript %}
var payload = {
            "cardno": "5438898014560229",
            "cvv": "789",
            "expirymonth": "07",
            "expiryyear": "18",
            "currency": "NGN",
            "pin": "7552",
            "country": "NG",
            "amount": "10",
            "email": "user@example.com",
            "phonenumber": "1234555",
            "suggested_auth": "PIN",
            "firstname": "user1",
            "lastname": "user2",
            "IP": "355426087298442",
            "txRef": "MC-7663-YU",
            "device_fingerprint": "69e6b7f0b72037aa8428b70fbe03986c"
};
{% endhighlight %}
