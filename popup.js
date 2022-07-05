document.getElementById('update').addEventListener('click', function(){
    let apikey = document.getElementById('apikey').value;
    browser.storage.local.set({'apikey':apikey+'&t='});
    document.getElementById('apikey').value ='';
});
