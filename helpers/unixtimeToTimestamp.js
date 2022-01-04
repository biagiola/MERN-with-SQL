function unixtimeToTimestamp(unixTime) {
  let unix = unixTime.toString().slice(0,10) // borrar milisegundos
  //let unixString = '1621726083'
  //console.log('unixtime', unixString)
    
  let reduceTime = new Date(unix*1000); 
  
  let year = reduceTime.getUTCFullYear()
  let month = (reduceTime.getUTCMonth() + 1).toString().padStart(2,0) // zero base value
  let date = reduceTime.getUTCDate().toString().padStart(2,0);

  let hours = reduceTime.getUTCHours().toString().padStart(2,0);
  let minutes = reduceTime.getUTCMinutes().toString().padStart(2,0);
  let seconds = reduceTime.getUTCSeconds().toString().padStart(2,0);

  let timeStamp = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  //let TimeStamp = `${hours}:${minutes}:${seconds}`;

  return timeStamp
}

module.exports.unixtimeToTimestamp = unixtimeToTimestamp