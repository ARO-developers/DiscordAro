const fs = require("fs")
const { Client, GatewayIntentBits } = require('discord.js');
const { fetch_data } = require("./parse")

//defs
var key = JSON.parse(fs.readFileSync("./key.json"))["key"]

//weight is in kg
//density is in kg/m3
//volume is in l
// 
// d = w / v
//

var data = JSON.parse(fs.readFileSync("./data.json"))
var prefix = "-!"

const client = new Client({intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]});

//funcs
function numberWithSpaces(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}

function table_out(jsonObject, num){
    let out_objs = []
    let out_string = ""

    for (const [key, value] of Object.entries(jsonObject)) {
        //out_vals.push((num / value).toFixed(2))
        //out_labels.push(key)
        let numberOf = (num / value["value"]).toFixed(2)
        if(numberOf == undefined){
            continue
        }

        let obj = {
            "label": key,
            "number": numberWithSpaces(numberOf),
            "weight": numberWithSpaces((numberOf * value["weight"]).toFixed(2)),
            "volume": numberWithSpaces((numberOf * value["volume"]).toFixed(2)),
            "density": value["density"] 
        }

        out_objs.push(obj)
    }

    let rand_choice = Math.floor(Math.random() * out_objs.length)

    if (num == undefined){
        return
    }

    //final output
    if (out_objs[rand_choice].volume == out_objs[rand_choice].weight){
        out_string = `${numberWithSpaces(num)}kč? To je přesně ${out_objs[rand_choice].number} kusů ${out_objs[rand_choice].label}.\n Což je ${out_objs[rand_choice].volume} litrů!`
    }
    else{
        out_string = `${numberWithSpaces(num)}kč? To je přesně ${out_objs[rand_choice].number} kusů ${out_objs[rand_choice].label}.\n Což je ${out_objs[rand_choice].volume} litrů nebo ${out_objs[rand_choice].weight} kilogramů!`
    }
    return out_string
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("I " + String.fromCodePoint(0x2665) + " Aro!")
});

client.on("messageCreate", message => {
    if (message.author.bot) return;
    if (message.content.startsWith(prefix)){
        //specified commands
        //fetch new data
        fetch_data()
        var sale = JSON.parse(fs.readFileSync("./akce.json"))
        var message_split = message.content.split(" ")
        console.log(message_split)

        if (message.content.split(" ")[0] == prefix + "akce"){
            let random = Math.round(Math.random() * Object.keys(sale).length)

            let iter = 0;
            for (const [key, value] of Object.entries(sale)) {
                iter += 1

                if (random == iter){
                    message.reply(`Hej! Víš že teď má makro v akci ${key} za ${value["Cena za jednotku"]}?`)
                }
            }
        }

    }
    else{
        //aro
        let str_arr = message.content.split(" ")
        let result = [] //to store numerical values
        for (let i = 0; i < str_arr.length; i++){
            let parse = parseInt(str_arr[i])
            if (!isNaN(parse)){
                result.push(parse)
            }
        }

        let num = result[0]
        let out = table_out(data, num)

        if (out != undefined){
            message.reply(out)
        }
    }
});

//make sure this line is the last line
client.login(key); //login bot using token