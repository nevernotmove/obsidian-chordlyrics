import open from "open";
import fs, {readFileSync} from "fs";

function copyBuild() {
    const srcDir = '../build/';
    const manifest = JSON.parse(readFileSync("../manifest.json", "utf8"));
    const {id} = manifest;
    const dstDir = `../test-vault/.obsidian/plugins/${id}`;

    console.log("Copying from", srcDir, "to", dstDir);

    // Create destination directory if it doesn't exist
    console.log("Testing if", dstDir, "directory exists");
    if (!fs.existsSync(dstDir)) {
        console.log("It does not exist, creating", dstDir);
        fs.mkdirSync(dstDir);
    }

    console.log("Getting all files to copy");
    const filesToCopy = fs.readdirSync(srcDir);
    console.log("About to copy the following files", filesToCopy);

    // Copy build into destination directory
    filesToCopy.forEach((file) => {
        fs.copyFileSync(srcDir + file, `${dstDir}/${file}`);
        console.log(`Copied ${file} to ${dstDir}`);
    });
}

// TODO Check out hot reload plugin
copyBuild();
await open('obsidian://open?vault=test-vault&file=chord-lyrics');
