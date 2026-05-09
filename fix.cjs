const fs = require('fs');
let content = fs.readFileSync('src/editor/Toolbar.tsx', 'utf8');
content = content.replace(/ \};\uFFFDلآن',\s+fontSize: 40,\s+fontFamily: 'Alexandria',\s+fontWeight: 'bold',\s+fill: '#FFFFFF',\s+align: 'center',\s+width: 400\s+\}\);\s+\};/, '  };');
content = content.replace(/  \};\n.*?لآن',\n.*?\}\);\n  \};/s, '  };\n');
fs.writeFileSync('src/editor/Toolbar.tsx', content);
