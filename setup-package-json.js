var fs = require('fs');
var pack = require('./package.json');

var packageJson = {
    version: pack.version,
    name: pack.name,
    main: './main.js',
    dependencies: pack.dependencies,
    devDependencies: pack.devDependencies,
    peerDependencies: pack.peerDependencies,
    repository: pack.repository
}

var targetPath = './lib/package.json';

try {
    fs.writeFileSync(targetPath, JSON.stringify(packageJson, null, '  '));
} catch (err) {
    console.error(err);
}
