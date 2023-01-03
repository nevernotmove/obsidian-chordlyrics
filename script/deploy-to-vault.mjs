import open from "open";
import fs, {readFileSync} from "fs";

function copyBuild() {
    const srcDir = '../build/';
    const manifest = JSON.parse(readFileSync("../manifest.json", "utf8"));
    const {id} = manifest;
    const dstDirBase = '../test-vault/.obsidian';
    const dstDir = dstDirBase + `/plugins/${id}`;

    console.info("Deleting previous data at", dstDirBase);
    fs.rmSync(dstDirBase, {recursive: true, force: true});

    console.info("Wanting to copy from", srcDir, "to", dstDir);

    console.info("Testing if", dstDir, "directory exists");
    if (!fs.existsSync(dstDir)) {
        console.info("It does not exist, creating", dstDir);
        fs.mkdirSync(dstDir, {recursive: true});
    }

    console.info("Getting all files to copy");
    const filesToCopy = fs.readdirSync(srcDir);
    console.info("About to copy the following files", filesToCopy, "from", srcDir);

    filesToCopy.forEach((file) => {
        fs.copyFileSync(`${srcDir}/${file}`, `${dstDir}/${file}`);
        console.info(`Copied ${file} to ${dstDir}`);
    });
}

async function openObsidian() {
    const uri = 'obsidian://open?vault=test-vault&file=chord-lyrics';
    console.info(`Opening Obsidian (${uri})`);
    await open(uri);
}

copyBuild();
openObsidian().then(); // TODO You can be better
