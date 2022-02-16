var fonts=['Acrobatic','Alligator','Avatar','Banner','Basic','Big','Binary','Bulbhead','Doh','Epic','Standard'];
figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts/' });
figlet.preloadFonts(fonts,function(){
    fonts.forEach(font=> figlet.textSync("A", {font: font}));
});

activeUser="guest";

commands={};

commands.clear = {
    info: "clear the terminal screen",
    usage: "clear",
    description: "clears your screen if this is possible, including its scrollback buffer"
}

commands.contact = {
    info: "displays contact information",
    usage: "contact",
    description: "Displays contact information of the site owner",
    exec: function(_this,term, args){
        term.echo("Email    : contact@pinchflat.dev");
        term.echo("Github   : https://github.com/pfltdv");
        term.echo("LinkedIn : https://www.linkedin.com/in/pinchflat");
    }
}

commands.date = {
    info: "print the system date and time",
    usage: "date",
    description: "Display the current time in figlet FORMAT",
    exec: function(_this,term, args){
        var dt = new Date().toLocaleString();
        commands.figlet.exec(_this,term,[dt]);
    }
}

commands.figlet = {
    info: "display large characters made up of ordinary screen characters",
    usage: "figlet [-f "+fonts.join("|")+"] [message]",
    description: "figlet prints its input using large characters made up of ordinary screen characters with random or selected fonts.",
    exec: function(_this,term, args){
        if (args && args.length > 0){
            var msg = "";
            var font = 'Standard';
            if (args[0] === "-f"){
                font = args[1];
                args.splice(0,2);

            }
            msg = args.join(" ");
            const cols = term.cols();
            term.echo("\n"+figlet.textSync(args.join(" "), {
                font: font,
                width: term.cols(),
                whitespaceBreak: true
            })+"\n");
        }else{
            term.echo("-pinchflat: figlet: no message provided .  Try `figlet message`");
        }
    }
}

commands.help = {
    info: "display information about builtin commands.",
    usage: "help [name]",
    description: "Displays brief summaries of builtin commands. If NAME is specified, gives detailed help on all commands matching PATTERN, otherwise the list of help topics is printed.",
    default: function(_this,term){
        term.echo("These commands are defined internally.  Type `help` to see this list.");
        term.echo("Type `help name` to find out more about the function `name`.");
        term.echo("");
        for (const key in commands) {
            term.echo(commands[key].usage.padEnd(20," ")+": "+commands[key].info);
        }
    },
    printcmd: function(_this,term,cmd){
        var command = commands[cmd];
        if (command){
            term.echo("\nNAME");
            term.echo("\t"+ cmd +" - "+command.info);
            term.echo("\nSYNOPSIS");
            term.echo("\t"+command.usage);
            term.echo("\nDESCRIPTION");
            term.echo("\t"+command.description+"\n\n");
        }else{
            term.echo("-pinchflat: help: no help topics match `"+cmd+"`.  Try `help`");
        }
    },
    exec: function(_this,term, args){
        if (args && args.length > 0){
            _this.printcmd(_this,term,args[0]);    
        }else{
            _this.default(_this,term);
        }
        
    }
}

commands.login = {
    info: "begin session on the system",
    usage: "login",
    description: "The login program is used to establish a new session with the system.",
    exec: function(_this,term, args){
        term.read("pinchflat login:")
            .then(user=> 
                term.set_mask('').read("Password:").then(pass=> {
                    activeUser=user;
                    term.echo("\nBrilliant. Now i have your password :D\n");
                    term.set_mask(false);  
                    term.set_prompt(activeUser+ "@pinchflat > ");
                }))
    }
}

commands.logout = {
    info: "Exit a login shell",
    usage: "logout",
    description: " Exits a login shell with exit status N.  Returns an error if not executed in a login shell.",
    exec: function(_this,term, args){
        if (activeUser === "guest"){
            term.read ("You are not logged in. Are you sure to terminate your session?[Y/n]").then(prompt=>{
                if (prompt === "Y"){
                     location.href="https://www.youtube.com/watch?v=YDhUMt0aDEQ";
                }else{
                    term.echo("Cool! Follow the white rabbit...")
                }
            });
        }else{
            activeUser="guest";
            term.set_prompt(activeUser+ "@pinchflat > ");
        }
    }
}

commands.projects = {
    info: "Shows projects",
    usage: "projects",
    description: "Displays open source project lists",
    exec: function(_this,term, args){
        term.echo("-------------------------------------------------------------------");
        commands.figlet.exec(_this,term,["anemoi"]);
        term.echo("Vendor independent container registry.");
        term.echo("GitHub: https://github.com/pfltdv/anemoi" );
        term.echo("Home  : https://registry.pinchflat.dev" );
        term.echo("-------------------------------------------------------------------");

    }
}

commands.whoami = {
    info: "print effective userid",
    usage: "whoami",
    description: " Print the user name associated with the current effective user ID.",
    exec: function(_this,term, args){
        term.echo(activeUser);
    }
}

var commandParser = function(commandLine){
    var cmd = $.terminal.parse_command(commandLine);
    var command = commands[cmd.name];
    if (command){
        command.exec(command,this,cmd.args)
    }else{
        this.echo("-pinchflat: "+cmd.name+": command not found!");
    }
}

jQuery(function($, undefined) {
    $('main').terminal(commandParser, {
        greetings: pinchflat.innerHTML,
        name: 'pinchflat',
        height: $('main').height(),
        prompt: 'guest@pinchflat > ',
        completion: Object.keys(commands),
        anyLinks:true,
        convertLinks:true
    });

});
