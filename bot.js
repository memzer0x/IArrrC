'use strict';

// Module imports
const irc = require('irc');
const colors = require('irc-colors');
const os = require('os');
const path = require('path');
const fs = require('fs');
// Include Javascript Configuration File
const config = require('./config');
const exec = require('child_process').exec;

// Textual banner for bot
var banner = ["                                                                                     ",
"                                                          .-.                        ",
"    .--.     ___ .-.     .--.     .--.      .-..         ( __)  ___ .-.      .--.    ",
"  /  _  \\   (   )   \\   /    \\   /    \\    /    \\        (''\") (   )   \\    /    \\   ",
" . .' `. ;   |  .-. .  |  .-. ; |  .-. ;  ' .-,  ;        | |   | ' .-. ;  |  .-. ;  ",
" | '   | |   | |  | |  | |  | | | |  | |  | |  . |        | |   |  / (___) |  |(___) ",
" _\\_`.(___)  | |  | |  | |  | | | |  | |  | |  | |        | |   | |        |  |      ",
"(   ). '.    | |  | |  | |  | | | |  | |  | |  | |        | |   | |        |  | ___  ",
" | |  `\\ |   | |  | |  | '  | | | '  | |  | |  ' |  .-.   | |   | |        |  '(   ) ",
" ; '._,' '   | |  | |  '  `-' / '  `-' /  | `-'  ' (   )  | |   | |        '  `-' |  ",
"  '.___.'   (___)(___)  `.__.'   `.__.'   | \\__.'   `-'  (___) (___)        `.__,'   ",
"                                          | |  ~ by kov1chski                         ",
"                                         (___)                                       "]

// Welcome Function
function welcome(){
    banner.forEach((x, i) => console.log(x));
    console.log("[SERVER]   => [" + config.irc_server + "]");
    console.log("[CHANNEL]  => [" + config.irc_channel + "]");
    console.log("[NICKNAME] => [" + config.irc_nickname + "]");
}

// Function responsible for determining the command to run
function commandHandler(from, to, message){
    //Make sure we are dealing with the command !host and not (!host127.0.0.1)
    if(message.substring(message.search("!") + 1, message.search(" ")) == "host"){
        // Check if our string contains bad characters with `regpattern`
        if(RegExp("[^a-zA-Z0-9.\/ \^-]").test(message.substring(message.search(" ") + 1, message.length))){
            // Tells the user that no he can eat a dick.
            irc_connection.say(config.irc_channel, colors.bold.red.bgyellow("Command \"host\" failed. [Invalid host]"));
            return -1;
        } else {
            //Check that we are not trying to scan a machine on our local network
            if(message.search("((192|127|10|255)).[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}|(255.255.255.0)|(0.0.0.0)") !== -1){
                irc_connection.say(config.irc_channel, colors.bold.red.bgyellow("Command \"host\" failed. [Invalid host]"));
                return -1;
            }
            // Run the command with arguments and exec.
            exec(message.substring(message.search("!") + 1, message.length), function(error, stdout, stderr){
                if(error !== null){
                    irc_connection.say(config.irc_channel, colors.bold.red.bgyellow("Command \"host\" failed. [Failed to execute command]"));
                    console.log(stderr);
                    return -1;
                } else {
                    var output = stdout.split("\n");
                    output.forEach((x, i) => {
                        if(x.length > 1){
                            irc_connection.say(config.irc_channel, colors.bold.lime.bgblack(x));
                        }
                    })
                }
            })
            return 0;
        }
    }

    // Print General Logs
    if(message.substring(message.search("!") + 1, message.search(" ")) == "logs"){
        // Take the first argument and transform it into an integer/
        var logs_count = parseInt(message.substring(message.search(" ") + 1, message.length).split(" ", 1)[0]);
        // Make sure integer conversion succeeded.
        if(isNaN(logs_count)){
            irc_connection.say(config.irc_channel, colors.bold.red.bgyellow("Failed to print logs. [Invalid value]"))
            return -1;
        }
        print_logs(logs_count);
        return 0;
    }

    // Print Self Logs
    if(message.substring(message.search("!") + 1, message.search(" ")) == "slogs"){
        // Take the first argument and transform it into an integer
        var logs_count = parseInt(message.substring(message.search(" ") + 1, message.length).split(" ", 1)[0]);
        // Make sure integer conversion succeeded.
        if(isNaN(logs_count)){
            irc_connection.say(config.irc_channel, colors.bold.red.bgyellow("Failed to print logs. [Invalid value]"))
            return -1;
        }
        print_slogs(logs_count, from);
        return 0;
    }

    // Print other people logs
    if(message.substring(message.search("!") + 1, message.search(" "))  == "ologs"){
        // Take the first argument and transform it into an integer
        var to = message.substring(message.search(" ") + 1, message.length).split(" ", 1)[0];
        var logs_count = parseInt(message.substring(message.search(" ") + 1, message.length).split(" ",2)[1]);
        // Make sure integer conversion succeeded.
        if(isNaN(logs_count)){
            irc_connection.say(config.irc_channel, colors.bold.red.bgyellow("Failed to print logs. [Invalid value]"));
            return -1;
        }

        // Extract the first parameter of the message
        print_ologs(logs_count, to);
        return 0;
    }

    if(message.substring(message.search("!") + 1, message.search(" ")) == "who"){
        // Extract the first argument
        var target = message.substring(message.search(" ") + 1, message.length).split(" ")[0];
        irc_connection.whois(target, (info) => {
            irc_connection.say(config.irc_channel, colors.bold.lime.bgblack("<--------[WHOIS " + target + "]-------->"));
            irc_connection.say(config.irc_channel, colors.bold.lime.bgblack("      nick: " + (typeof(info.nick) !== "Undefined" ? info.nick : "Undefined")));
            irc_connection.say(config.irc_channel, colors.bold.lime.bgblack("      user: " + (typeof(info.user) !== "Undefined" ? info.user : "Undefined")));
            irc_connection.say(config.irc_channel, colors.bold.lime.bgblack("      host: " + (typeof(info.host) !== "Undefined" ? info.host : "Undefined")));
            irc_connection.say(config.irc_channel, colors.bold.lime.bgblack("      realname: " + (typeof(info.realname) !== "Undefined" ? info.nick : "Undefined")));
            irc_connection.say(config.irc_channel, colors.bold.lime.bgblack("      channels: " + (typeof(info.channels) !== "Undefined" ? info.channels : "Undefined")));
            irc_connection.say(config.irc_channel, colors.bold.lime.bgblack("      server: " + (typeof(info.server) !== "Undefined" ? info.server : "Undefined")));
            irc_connection.say(config.irc_channel, colors.bold.lime.bgblack("      serverinfo: " + (typeof(info.serverinfo) !== "Undefined" ? info.serverinfo : "Undefined")));
            irc_connection.say(config.irc_channel, colors.bold.lime.bgblack("      operator: " + (typeof(info.operator) !== "Undefined" ? info.operator : "Undefined")));
            irc_connection.say(config.irc_channel, colors.bold.lime.bgblack("<---------------" + "-".repeat(target.length) + "--------->"))
        })
        return 0;
    }

    if(message.substring(message.search("!") + 1, message.search(" ")) == "whois"){
        // Extract the first argument
        var domain = message.substring(message.search(" ") + 1, message.length).split(" ")[0];
        if(RegExp("[^a-zA-Z0-9.\/ \^-]").test(message.substring(message.search(" ") + 1, message.length))){
            // Tell the user that no he can go eat a dick
            irc_connection.say(config.irc_channel, colors.bold.red.bgyellow("Command \"whois\" failed. [Invalid Arguments]"));
            return -1;
        } else {
            if(RegExp("((192|127|10|255)).[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}|(255.255.255.0)|(0.0.0.0)").test(message.substring(message.search(" ") + 1, message.length))){
                irc_connection.say(config.irc_channel, colors.bold.red.bgyellow("Command \"whois\" failed. [Invalid Arguments]"));
                return -1;
            }
            // Execute Command
            exec(message.substring(message.search("!") + 1, message.length), function(error, stdout, stderr){
                if(error !== null){
                    irc_connection.say(config.irc_channel, colors.bold.red.bgyellow("Command \"whois\" failed. [Failed to execute command]"))
                    console.log(error);
                    return -1
                } else {
                    var output = stdout.split("\n");
                    output.forEach((x, i) => {
                        // Make sure we don't send empty lines.
                        if(x.length > 1){
                            irc_connection.say(config.irc_channel, colors.bold.lime.bgblack(x));
                        }
                    })
                }
            })
            return 0;
        }
    }
    if(message.substring(message.search("!") + 1, message.search(" ")) == "nslookup"){
        // Check if we can extract an argument
        if(message.substring(message.search(" ") + 1, message.length).length < 1){
            irc_connection.say(config.irc_channel, colors.bold.red.bgyellow("Command \"nslookup\" failed. [Invalid Arguments]"));
            return -1;
        }
        // Extract the first argument
        if(RegExp("[^a-zA-Z0-9.\/ \^-]").test(message.substring(message.search(" ") + 1, message.length))){
            // Tell the user that no he can eat a dick
            irc_connection.say(config.irc_channel, colors.bold.red.bgyellow("Command \"nslookup\" failed. [Invalid host]"));
            return -1;
        } else {
            if(message.search(RegExp("((192|127|10|255)).[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}|(255.255.255.0)|(0.0.0.0)")) !== -1){
                irc_connection.say(config.irc_channel, colors.bold.red.bgyellow("Command \"nslookup\" failed. [Invalid host]"));
                return -1;
            }
            // Prepare nslookup call
            exec(message.substring(message.search("!") + 1, message.length), function(error, stdout, stderr){
                if(error !== null){
                    irc_connection.say(config.irc_channel, colors.bold.red.bgyellow("Command \"nslookup\" failed. [Failed to execute command]"));
                    console.log(error);
                    return -1
                } else {
                    var output = stdout.split("\n");
                    output.forEach((x, i) => {
                        if(x.length > 1){
                            irc_connection.say(config.irc_channel, colors.bold.lime.bgblack(x.replace("\t", "    ").replace("\t", "    ")));
                        }
                    })
                }
            })
            return 0;
        }
    }
}

// Function responsible for printing logs
function print_logs(logs_count){
    //Make sure we have enough logs in our chatlogs array
    if(logs_count > chatlogs.length){
        irc_connection.say(config.irc_channel, colors.bold.red("You asked for " + logs_count + " log entries but only " + chatlogs.length + " were available, showing the last " + chatlogs.length + " log entries :"));
        // If we don't have enough logs, set logs_count to chatlogs.length
        logs_count = chatlogs.length;
    }

    // Make sure we are not trying to read too much logs
    if(logs_count < 1 || logs_count > 500){
        irc_connection.say(config.irc_channel, colors.bold.red.bgyellow("Failed to print logs. [Invalid Logs Count]"));
        return -1;
    }

    var log_found = false;
    for(var i = 0; i < logs_count; i++){
        // console.log(chatlogs[chatlogs.length - i]);
        irc_connection.say(config.irc_channel, colors.bold.lime.bgblack(`${i+1} - ` + chatlogs[i]));
        log_found = true;
    }

    if(log_found === false){
        irc_connection.say(config.irc_channel, color.bold.red("No logs found !"))
    }

    return 0;
}

function print_slogs(logs_count, from){
    // Make sure we have enough logs in our chatlogs array
    if(logs_count > chatlogs.length){
        irc_connection.say(config.irc_channel, colors.bold.red("You asked for " + logs_count + " log entries but only " + chatlogs.length + " were available, shrinking to " + chatlogs.length + " log entries :"));
        // If we don't have enough logs, set logs_count to chatlogs.length
        logs_count = chatlogs.length;
    }

    // Make sure we are not trying to read too much logs
    if(logs_count < 1 || logs_count > 500){
        irc_connection.say(config.irc_channel, colors.bold.red.bgyellow("Failed to print logs. [Invalid Logs Count]"));
        return -1;
    }

    var log_found = false;
    for(var i = 0; i < logs_count; i++){
        // Check if this is the user logs
        if(chatlogs[i].startsWith(from)){
            console.log(from);
            // Send the logs back to the user in a private message
            irc_connection.say(config.irc_channel, colors.bold.lime.bgblack(`${i+1} - ` + chatlogs[i]));
            log_found = true;
        }
    }

    if(log_found === false){
        irc_connection.say(config.irc_channel, colors.bold.red("No logs found !"))
    }

    return 0;

}

function print_ologs(logs_count, to){
    // Make sure we have enough logs in our chatlogs array
    if(logs_count > chatlogs.length){
        irc_connection.say(config.irc_channel, colors.bold.red("You asked for " + logs_count + " log entries but only " + chatlogs.length + " were available, shrinking to " + chatlogs.length + " log entries :"));
        // If we don't have enough logs, set logs_count to chatlogs.length
        logs_count = chatlogs.length;
    }

    // Make sure we're not trying to read a too small or big value.
    if(logs_count < 1 || logs_count > 500){
        irc_connection.say(config.irc_channel, colors.bold.red.bgyellow("Failed to print logs. [Invalid Logs Count]"));
        return -1;
    }

    var log_found = false;
    for(var i = 0; i < logs_count; i++){
        // Make sure our chat logs is the from the right user
        if(chatlogs[i].startsWith(to)){
            // Print the chat logs
            irc_connection.say(config.irc_channel, colors.bold.lime.bgblack(`${i+1} - ` + chatlogs[i]));
            log_found = true;
        }
    }

    if(log_found === false){
        irc_connection.say(config.irc_channel, colors.bold.red("No logs found for " + to))
    }

    return 0;
}

var chatlogs = [];

// Program Begins
welcome();

// Get an IRC Connection
var irc_connection = new irc.Client(config.irc_server, "IArrrC", {
    userName: config.irc_nickname,
    realName: config.irc_realname,
    channels: config.irc_channel,
    autoRejoin: config.autoRejoin,
    autoRenick: config.autoRenick,
});

irc_connection.addListener('error', function(message) {
    console.log('error: ', message);
});

// Listen for every messages on the server
irc_connection.addListener('message', function(from, to, message){
    // Keep logs of messages
    var msg_time = new Date();
    chatlogs.push(from + " => " + to + ": " + message + " | " + msg_time.toString());
    // Check if our commands starts with a known prefix
    if(message.startsWith("!")){
        commandHandler(from, to, message);
    }
    if(message.startsWith("$")){
        // ASCII Art Handler -> artHandler(message)
    }
});

