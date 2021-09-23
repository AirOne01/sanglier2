import { Client, Collection } from "discord.js";
import { readdirSync } from "fs";
import * as path from "path";
import { Command, Config, Event } from "../Interfaces";
import * as config from "../config.json";

class ExtendedClient extends Client {
  public commands: Collection<string, Command> = new Collection();
  public events: Collection<string, Event> = new Collection();
  public config: Config = config;
  public aliases: Collection<string, Command> = new Collection();

  public async init() {
    // logs in with Discord#Client class
    this.login(this.config.token);

    /* Commands 
       Magical command importing loop (c) */
    const commandPath: string = path.join(__dirname, "../Commands");
    readdirSync(commandPath).forEach((d) => {
      const commands: string[] = readdirSync(`${commandPath}/${d}`).filter((f) =>
        f.endsWith(".ts")
      ); // filters out files

      for (const f of commands) {
        // gets command
        const command = require(`${commandPath}/${d}/${f}`);
        // actually adds the command to the collection
        this.commands.set(command.name, command);
        // adds aliases
        if (command?.aliases.length !== 0) {
          command.aliases.forEach((a: string) => {
            this.aliases.set(a, command); // sets alias in collection
          });
        }
      }
    });

    /* Events 
       Magical event importing loop (c) */
    const eventPath: string = path.join(__dirname, "../Events");
    readdirSync(eventPath).forEach(async (f) => {
      // gets the event
      const event: any = await import(`${eventPath}/${f}`);
      // actually adds it to the collection
      this.events.set(event.name, event);
      console.log(`🧬 Event ${event.name} chargé ✔️`);  // pretty verbose
      // and then binds it to the corresponding event
      this.on(event.name, event.run.bind(null, this));
    });
  }
}

export default ExtendedClient;
