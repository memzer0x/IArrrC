# IArrrC
IArrrC or I Arrr C (for the pirates) 🦜 is just a simple bot i've decided i was going to make for IRC to improve my javascript and node skills.

<p align="center">
  <img src="https://media3.giphy.com/media/3o6Zt3KyN0vd1S97d6/giphy.gif"/>
</p>

It has multiple functionalities, but i can't guarantee that it safe to use yet in production, so i wouldn't yet use it in a IRC server. You are still free to clone the repo and modify it as much as you like, or even take inspiration from it.
Note that when i say it's not safe for use yet, it's because chat commands like 'nmap', 'dig', 'host', 'nslookup', 'whois' rely on the `exec` function from the `child_process` module, this function can potentially be "jailbreak" and the user might gain code execution.

I will spend the next few days working on different security concepts in this project this way it can eventually safely be used in a IRC server, for now i've implemented regex patterns and a lot of check on input, but we never are too cautious.

*Note that i made this warning because i don't consider a professional javascript programmer, i believe i'm doing great but i will always make more mistakes than someone who programmed with js for a long period, however i do intend to become better at it ;)*
