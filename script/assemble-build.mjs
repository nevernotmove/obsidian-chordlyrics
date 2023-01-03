import * as fs from "fs";

// Change to project dir script is started in script folder
if (process.cwd().endsWith('script')) process.chdir("../");

const buildDirectory = './build';
const filesToCopy = ['styles.css', 'manifest.json'];

// Create build directory if it doesn't exist
if (!fs.existsSync(buildDirectory)) {
    fs.mkdirSync(buildDirectory);
}

// Copy each file to the build directory
filesToCopy.forEach((file) => {
    fs.copyFileSync(file, `${buildDirectory}/${file}`);
    console.log(`Copied ${file} to ${buildDirectory}`);
});
