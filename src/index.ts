import Vorpal, { Args } from "vorpal";
import axios from "axios";
import fs from "fs";
const cli = new Vorpal().delimiter("server-manager");

// Show existing servers
cli.command("show [type]", "Show server types")
    .autocomplete(["factorio", "minecraft", "terraria"])
    // @ts-expect-error
    .action((args: Args, cb: () => void) => {
        if (args.type) {
            switch (args.type.toLowerCase()) {
                case "factorio":
                    cli.log("factori0");
                    break;
                case "minecraft":
                    cli.log("meinkamph");
                    break;
                case "terraria":
                    cli.log("terra");
                    break;
                default:
                    cli.log("empty");
            }
        }
        cb();
    });

cli.command("fetch <game> <version>")
    .autocomplete(["factorio", "minecraft", "terraria"])
    // @ts-expect-error
    .action(async (args: Args, cb: () => void) => {
        if (args.game) {
            const arg = args.game.toLowerCase();
            if (arg === "factorio") {
                cli.log("factori0");
            } else if (arg === "minecraft") {
                const manifest = (await axios.get("https://launchermeta.mojang.com/mc/game/version_manifest.json")).data;
                const version = manifest.versions.find((v: any) => v.id === args.version);
                if (!version) {
                    cli.log("Version not found");
                    return cb();
                }

                const props = (await axios.get(version.url)).data;
                axios
                    .get(props.downloads.server.url)
                    .then((res) =>
                        fs.writeFileSync("server.jar", res.data, { encoding: "binary" })
                    );
                cli.log("meinkamph");
            } else if (arg === "terraria") {
                cli.log("terra");
            } else {
                cli.log("empty");
            }
        }

        cb();
    });

cli.show();
