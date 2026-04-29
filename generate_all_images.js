const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'images', 'extracted');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png') || f.endsWith('.jpeg'));

let html = '<html><body><h1>All Images</h1><div style="display:flex; flex-wrap:wrap;">';
files.forEach(f => {
    html += `<div style="margin:10px; border:1px solid #ccc; padding:5px;">
        <img src="/images/extracted/${f}" style="max-width:200px; max-height:200px; display:block;">
        <p>${f}</p>
    </div>`;
});
html += '</div></body></html>';

fs.writeFileSync(path.join(__dirname, 'public', 'all_images.html'), html);
