import Client from "./Client";
import { ClientOptions } from "discord.js";

const opts: ClientOptions = { intents: ["GUILDS", "GUILD_MESSAGES"] };

new Client(opts).init();
