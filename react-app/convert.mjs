import fs from 'fs-extra';
import path from 'path';
import { globSync } from 'glob';
import { JSDOM } from 'jsdom';
import HTMLtoJSX from 'htmltojsx';

const srcDir = 'c:/laragon/www/Talkinexx/download-version';
const outDir = 'c:/laragon/www/Talkinexx/react-app/src/pages';
const componentsDir = 'c:/laragon/www/Talkinexx/react-app/src/components';

const converter = new HTMLtoJSX({
  createClass: false,
});

async function run() {
  await fs.ensureDir(outDir);
  await fs.ensureDir(componentsDir);

  const files = globSync('*.html', { cwd: srcDir });
  
  let routes = [];
  let imports = [];

  for (const file of files) {
    if (file === 'mail.php') continue;
    
    const content = await fs.readFile(path.join(srcDir, file), 'utf-8');
    const dom = new JSDOM(content);
    
    // Get everything inside body, except scripts. We can keep scripts if they are needed, 
    // but usually in React we handle them in index.html or useEffect. 
    // For now, let's keep all elements except script tags at the end.
    
    const body = dom.window.document.body;
    
    // Remove script tags at the end if they are just vendor scripts.
    // Actually, keeping them inside React components might cause issues with execution.
    // It's better to move all body scripts to the public/index.html.
    const scripts = Array.from(body.querySelectorAll('script'));
    let scriptTagsHTML = '';
    scripts.forEach(s => {
      scriptTagsHTML += s.outerHTML + '\n';
      s.remove();
    });
    
    // Save the scripts for index.html if it's the main index
    if (file === 'index.html') {
      await fs.writeFile('scripts.html', scriptTagsHTML);
    }

    const preloader = body.querySelector('#preloader');
    if (preloader) preloader.remove();
    
    let innerHTML = body.innerHTML;
    let jsx = converter.convert(innerHTML);
    // Replace .html in hrefs
    jsx = jsx.replace(/href="([^"]+)\.html"/g, (match, p1) => {
      if (p1 === 'index') return 'href="/"';
      return `href="/${p1}"`;
    });
    
    // The converter returns the JSX string. We wrap it in a functional component.
    const componentName = file.replace('.html', '').split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('') || 'Home';
    const finalComponentName = componentName === 'Index' ? 'Home' : componentName;

    // Aior template has some things like <!--[if lte IE 9]> which htmltojsx might not handle perfectly, 
    // but we can try. Also, replace <a> tags that have href="#" or similar if needed.

    const code = `
import React, { useEffect } from 'react';

const ${finalComponentName} = () => {
    
    return (
        <>
            ${jsx}
        </>
    );
};

export default ${finalComponentName};
    `;

    await fs.writeFile(path.join(outDir, `${finalComponentName}.jsx`), code);
    
    const routePath = file === 'index.html' ? '/' : `/${file.replace('.html', '')}`;
    imports.push(`import ${finalComponentName} from './pages/${finalComponentName}';`);
    routes.push(`        <Route path="${routePath}" element={<${finalComponentName} />} />`);
    
    console.log(`Converted ${file} to ${finalComponentName}.jsx`);
  }

  // Generate App.jsx
  const appCode = `
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
${imports.join('\n')}

function App() {
  return (
    <Router>
      <Routes>
${routes.join('\n')}
      </Routes>
    </Router>
  );
}

export default App;
  `;

  await fs.writeFile('c:/laragon/www/Talkinexx/react-app/src/App.jsx', appCode);
  console.log("Done generating App.jsx");
}

run().catch(console.error);
