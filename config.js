module.exports = {
    irc_server: "irc.reversing-ninja.com",  // Server to connect to
    irc_channel: ["#pirategod"],            // Channel the bot will automatically join
    irc_nickname: "IArrrC",                 // Nickname of the bot on the IRC Channel
    irc_realname: "IArrrC by K0vichski",    // Realname of the bot
    bot_password: "di{]KfJS<&!pe+@#A<D+UK2g\"J|YC,duTn", // Sometimes there is a role that we need to be able to bot properly
    max_logs_line: 20000,                   // Save logs to file every 100 lines of text and cleanup array
    logfile_name: "iaaarc.logs",            // Log file name
    autoRejoin: true,                       // Auto Rejoin if the bot lose connection
    autoRenick: true,                       // Auto Renick if nickname is already token by someone
}
