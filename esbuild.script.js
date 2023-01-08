const lodashTransformer = require('esbuild-plugin-lodash');
const fs = require('fs');

// specify the source and destination directories
const src = './src/assets';
const dest = './public/assets';


//delete the elements from assets/public
fs.readdir(dest, (err, files) =>{
    if(err){
        console.error(err);
        return;
    }

    for(const file of files){
        let stats = fs.statSync(dest+ '/' + file);
        if(stats.isFile()) {
            fs.unlink(dest + '/' + file, (err) => {
                if (err) {
                    throw err;
                }
            });
        }else if(stats.isDirectory()){
            fs.rm(dest+ '/' + file, { recursive: true }, err => {
                if (err) {
                    throw err
                }
            });
        }
    }
});

// read the contents of the source directory
fs.readdir(src, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }

    // iterate over the files in the source directory
    for (const file of files) {
        // specify the source and destination paths for the file
        const srcPath = `${src}/${file}`;
        const destPath = `${dest}/${file}`;
        let stats = fs.statSync(srcPath);
        if(stats.isFile()) {
            // move the file from the source to the destination
            fs.copyFile(srcPath, destPath, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }else if(stats.isDirectory()){
            fs.cp(srcPath, destPath, { recursive: true }, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }
    }
});

require("esbuild")
    .build({
            logLevel: "info",
            entryPoints: ["./src/index.ts"],
            define: {
            'process.env.ASSET_PATH': JSON.stringify('./public/assets'),
            },
            platform: 'browser',
            minify: true,
            sourcemap: true,
            bundle: true,
            target: ["es2015"],
            plugins: [lodashTransformer()],
            outfile:'./public/js/index.js',
    }).catch(() => process.exit(1));

