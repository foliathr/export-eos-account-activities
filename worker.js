function convertArrayOfObjectsToCSV(args) {
  var result = '';
  var data = args.data;
  if (data.length == 0) return result;
  var firstItem = data[0];
  var keys = [];

  for (var key in firstItem) {
    keys.push(key);
  }
  result += '"' + keys.join('","') + '"' + "\n\r";
  data.forEach(function(item) {
    var lines = [];
    keys.forEach(function(key) {
      lines.push(item[key]);
    });
    result += '"' + lines.join('","') + '"' + "\n\r";
  });

  return result;
}

self.onmessage = function(msg) {
  console.log(msg.data.account);
  const account = msg.data.account;
  const numbertransactions = msg.data.numbertransactions
  const Http = new XMLHttpRequest();
  var link = "https://history.cryptolions.io/v1/history/get_actions/" + account + "?skip=0&limit=" + numbertransactions;
  Http.open("GET", link);
  Http.send();
  Http.onreadystatechange = (e) => {
    if (Http.readyState == 4 && Http.status == 200) {
      var data = JSON.parse(Http.responseText)
      var filterData = [];
      var pushedTxs = [];
      data.actions.forEach(function(loopItem) {
        if (pushedTxs.indexOf( loopItem.trx_id ) == -1){
          pushedTxs.push( loopItem.trx_id )
          var createAt = new Date(loopItem.createdAt)
          var item = {
            "Transaction ID": loopItem.trx_id,
            "Created At": createAt.toGMTString()
          };
          item.Contract = loopItem.act.account;
          item.Name = loopItem.act.name;
          item.Data = '';
          for (var key in loopItem.act.data) {
            if (typeof(loopItem.act.data[key]) == "string") {
              if (item.Data) {
                item.Data += "\n\r";
              }
              item.Data += key + ' : ' + loopItem.act.data[key].replace(/\"/g, '""')
            }
          }
          filterData.push(item);          
        }

      });
      postMessage(convertArrayOfObjectsToCSV({
        data: filterData
      }));

    }
  }
}