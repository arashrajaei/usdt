const fs = require('fs')

exports.saveBalance = function saveBalance(amount){
  fs.writeFileSync('./balance.data', amount);
}

exports.hasSavedBalance = function hasSavedBalance(){
  return fs.existsSync('./balance.data');
}

exports.loadBalance = function loadBalance(amount){
  return fs.readFileSync('./balance.data', 'utf-8');
}

