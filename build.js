const builder = require('electron-builder');
const Platform = builder.Platform;

async function build() {
    try {
        await builder.build({
            targets: Platform.WINDOWS.createTarget(),
            config: require('./package.json').build
        });
        console.log("✅ Windows build done");

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

build();
