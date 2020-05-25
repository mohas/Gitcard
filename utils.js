// Required Imports
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const axios = require("axios");

// Variable Declarations
var languages=[]
var freqLanguages={}
var contributions=""
var folio={}

// Basic Details Function
async function basicDetails(username){
    await fetch('https://api.github.com/users/'+username)
    .then(response => response.json())
    .then(json => {
        folio["name"]=json["name"]
        folio["repocount"]=json["public_repos"]
        folio["followers"]=json["followers"]
        folio["following"]=json["following"]
        folio["imgurl"]=json["avatar_url"]
        folio["reposurl"]=json["repos_url"]
    })
    topLanguages(username);
}

// Fetching Top 3 Languages
async function topLanguages(username){
    await fetch(folio["reposurl"])
    .then(response => response.json())
    .then(json => {
        for(var i=0; i<json.length;i++){
            var lang=json[i]["language"]
            if(lang==null){
                continue;
            }
            else if(freqLanguages[lang]){
                freqLanguages[lang]++;
            }
            else{
                freqLanguages[lang]=1
            }
        }
        
        var items = Object.keys(freqLanguages).map(function(key) {
            return [key, freqLanguages[key]];
        });

        items.sort(function(first, second) {
            return second[1] - first[1];
        });
        
        var count=0
        for(var i=0;i<items.length;i++){
            if(count==3){
                break;
            }
            else{
                languages.push(items[i][0])
                count++;
            }
        }
        folio["languages"]=languages
    })
    totalContributions(username);
}

// Fetching Total Contributions
async function totalContributions(username){
    const result = await axios.get('https://github.com/users/'+username+'/contributions');
    const data = cheerio.load(result.data);
    contributions = data("h2").text().trim().replace(/\n/g, '').split(" ")[0]
    folio["contributions"]=contributions
    console.log(folio)
}

module.exports = function Gitfolio(username){
    basicDetails(username);
    console.log(folio)
    return folio
}

basicDetails('capturemathan');