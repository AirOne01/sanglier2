import Client from "../Client";
import { Message } from "discord.js";

interface Run {
  (client: Client, msg: Message, args: string[]): void;
}

export interface Command {
  name: string;
  description?: string;
  aliases?: string[];
  group?: string;
  run: Run;
}
