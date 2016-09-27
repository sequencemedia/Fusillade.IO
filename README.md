# Fusillade.IO

Fusillade is a Promise interface to the load-testing tool Artillery.

Fusillade executes Artillery scripts and generates Artillery reports, then stores the results in `MongoDB` and dispatches notifications by email.

You can [read about Artillery.IO on GitHub](https://github.com/shoreditch-ops/artillery).

## Installation

```
npm install fusillade
```

Fusillade is dependent  on `MongoDB` which you should install (and start) separately.

## Implementation

`fusillade` exposes a single function, which returns a Promise:

```
var fusillade = require('fusillade').fusillade;

fusillade()
  .then(function () { console.log('Done') })
  .catch(function (e) { console.log('Error', e.message) });
```
It should be configured with a JSON object which resides in your application root:
```
{
  "fusillade": {
    "src": "/path/to/your/artillery/scripts",
    "log": "/path/for/artillery/artifacts"
  },
  "mongo": {
    "uri": "mongodb://localhost:27017/fusillade",
    "options": {
      "host": "localhost",
      "port": 27017,
      "database": "fusillade"
    }
  },
  "mailer": {
    "transport": {
      "host": "smtp.anemailhost.com",
      "port": 465,
      "auth": {
        "user": "AUsername",
        "pass": "APassword"
      }
    },
    "message": {
      "from": "'Your Name' <an@email.address>",
      "to": "your.recipients@email.address",
      "subject": "Load and performance for {startDate} at {startTime}"
    }
  }
}
```
All of these attributes are **required**, but the `fusillade` section of the configuration object has defaults:

```
{
  "fusillade": {
    "src": "./fusillade/src",
    "log": "./fusillade/log"
  }
}
```
But that section of the configuration object and the defaults can be overriden by passing parameters to the function:
```
fusillade({ src: '/a/different/src/path', log: '/a/different/log/path' })
```

Fusillade also implements `mongoose` models. You can override them by passing different models as parameters to the function, instead:
```
fusillade({
  models: {
    HtmlModel: YourHtmlModel,
    HtmlListModel: YourHtmlListModel,
    JsonModel: YourJsonModel,
    JsonListModel: YourJsonListModel,
    ExceptionModel: YourExceptionModel
  }
})
```
In which case, you should ensure that they are initialised before they are passed to Fusillade.
