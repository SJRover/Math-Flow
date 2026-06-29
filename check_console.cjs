const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    await page.goto('http://localhost:5174/');
    
    // Click PLAY STORY SAGA
    await page.waitForFunction(() => document.body.innerText.includes('PLAY STORY SAGA'));
    
    const playBtn = await page.evaluateHandle(() => {
        return Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('PLAY STORY SAGA'));
    });
    
    await playBtn.click();
    await new Promise(r => setTimeout(r, 500));
    
    // Click Node 1
    const node1 = await page.evaluateHandle(() => {
        return Array.from(document.querySelectorAll('div')).find(d => d.innerText === '1' && d.style.borderRadius === '50%');
    });
    
    if (node1) {
        console.log("Clicking Node 1");
        await node1.click();
        await new Promise(r => setTimeout(r, 1000));
    }
    
    await browser.close();
})();
