const fs = require("fs")
const { Client, GatewayIntentBits } = require('discord.js');

//defs
var key = JSON.parse(fs.readFileSync("./key.json"))["key"]
var data = JSON.parse(fs.readFileSync("./data.json"))
var prefix = "-!"

const client = new Client({intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]});

//funcs
function table_out(jsonObject, num){
    let out_vals = []
    let out_labels = []
    let out_string = ""

    for (const [key, value] of Object.entries(jsonObject)) {
        out_vals.push((num / value).toFixed(2))
        out_labels.push(key)
    }

    let rand_choice = Math.floor(Math.random() * out_labels.length)

    //final output
    out_string = num.toString() + "kč? To je přesně " + out_vals[rand_choice].toString() + " kusů " + out_labels[rand_choice] + "!"
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

        message.reply(out)
    }
});

//make sure this line is the last line
client.login(key); //login bot using token