import fs from 'fs';

try {
  let html = fs.readFileSync('code.html', 'utf-8');
  
  // Remove CDN scripts
  html = html.replace('<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>', '');
  html = html.replace(/<script id="tailwind-config">[\s\S]*?<\/script>/, '');
  
  // Replace custom style with external link
  const styleRegex = /<style type="text\/tailwindcss">[\s\S]*?<\/style>/;
  if(styleRegex.test(html)) {
    html = html.replace(styleRegex, '<link rel="stylesheet" href="/style.css" />');
  } else {
    // If not found, inject into head
    html = html.replace('</head>', '<link rel="stylesheet" href="/style.css" />\n</head>');
  }
  
  // Add main.js module
  if (!html.includes('src="/main.js"')) {
    html = html.replace('</body>', '<script type="module" src="/main.js"></script>\n</body>');
  }
  
  fs.writeFileSync('index.html', html);
  console.log("Successfully transformed code.html to index.html");
} catch(err) {
  console.error("Error transforming HTML:", err);
}
