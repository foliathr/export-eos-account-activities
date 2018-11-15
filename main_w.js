function downloadCSV(args, csv) {
  var data, filename, link;
  if (csv == null) return;
  filename = args.filename || 'export.csv';
  if (!csv.match(/^data:text\/csv/i)) {
    csv = 'data:text/csv;charset=utf-8,' + csv;
  }
  data = encodeURI(csv);
  link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
}

function startWorker(account, numbertransactions) {
  if (typeof(Worker) === "undefined") {
    return document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Workers...";
  }

  var w = new Worker("worker.js");
  w.postMessage({
    account: account,
    numbertransactions: numbertransactions
  });
  w.onmessage = function(event) {
    downloadCSV({
      filename: "Export Data For Account  " + account + ".csv"
    }, event.data);
    w.terminate();
    w = undefined;
  };

}

function exportAccount() {
  var eosAccount = document.getElementById("eosaccount").value;
  var numbertransactions = document.getElementById("numbertransactions").value;
  startWorker(eosAccount, numbertransactions)
  return false;
}