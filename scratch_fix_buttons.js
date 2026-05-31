const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory() && f !== 'node_modules' && f !== '.next' && f !== '.git') {
            walkDir(dirPath, callback);
        } else if (f.match(/\.(jsx|js)$/)) {
            callback(dirPath);
        }
    });
}

walkDir('.', (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix buttons missing type="button"
    content = content.replace(/<button type="button"(?![^>]*\btype=)([^>]*)>/g, '<button type="button"$1>');
    // Fix next/ui Button components if they don't have type
    // Wait, the user specifically said "button", but in React often it's `<Button type="button">`
    // I'll add type="button" to <Button type="button"> as well if not present
    content = content.replace(/<Button type="button"(?![^>]*\btype=)([^>]*)>/g, '<Button type="button"$1>');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed buttons in ' + filePath);
    }
});
