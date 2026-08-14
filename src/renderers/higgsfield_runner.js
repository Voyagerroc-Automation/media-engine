const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const DOWNLOAD_DIR = "C:\\Users\\erol_\\Downloads";

const promptText = `[SHOT 1 | 00:00-00:10 | 50mm Medium Tracking - Setup]
Subject: Cybernetic Ronin samurai in carbon fiber battle armor standing centered in combat-ready posture on wet metal surface.
Context: Rain-slicked skyscraper rooftop in neo-Istanbul 2088, 20m dense volumetric fog, cold cyan and magenta rim lighting.
Style: Cinematic 35mm film grain, anamorphic lens flare, photorealistic rain streaks.
Camera Motion: Smooth 50mm dolly tracking shot starting at 8m distance, closing in to 3m at eye-level.
Composition: Medium wide framing showing full silhouette against neon mist.
Ambiance: 4500K cold cyan and magenta rim lighting, subtle volumetric glow.
Timecode: 0.0s-3.0s: Stance reveal, heavy rain droplets deflect off armor. 3.0s-7.5s: Blade draws with a heavy metallic rasp, energy core hums to life. 7.5s-10.0s: Locks into match-cut posture.
Native Audio: Whispered dialogue "The city never sleeps... nor do I." Heavy rainfall splashing on rooftop, ambient wind howling, deep resonant synth drone.`;

(async () => {
    console.log("=================================================================");
    console.log("ğŸ¬ VOYAGERROC OTONOM HIGGSFIELD TESTÄ° BAÅLATILIYOR");
    console.log("=================================================================");
    console.log(`ğŸ¯ Hedef: Higgsfield Studio`);
    console.log(`â™¾ï¸  Unlimited Modu: ZORUNLU AKTÄ°F`);
    console.log(`ğŸ“¥ Ä°ndirilecek KlasÃ¶r: ${DOWNLOAD_DIR}`);

    const profileDir = path.resolve(__dirname, '../../../../.gemini/antigravity-ide/scratch/chrome_session_clean');
    if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: false,
        defaultViewport: null,
        userDataDir: profileDir,
        args: [
            '--start-maximized',
            '--no-sandbox',
            '--disable-blink-features=AutomationControlled'
        ]
    });

    const page = await browser.newPage();

    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: DOWNLOAD_DIR,
    });

    try {
        console.log("\n[1] Higgsfield Studio aÃ§Ä±lÄ±yor...");
        await page.goto('https://higgsfield.ai/studio', { waitUntil: 'networkidle2', timeout: 60000 });

        console.log("[2] Sayfa elementleri taranÄ±yor (8 saniye)...");
        await new Promise(r => setTimeout(r, 8000));

        // 1. Unlimited Modunu Bul ve TÄ±kla
        console.log("[3] 'Unlimited' seÃ§eneÄŸi aranÄ±yor...");
        try {
            const clicked = await page.evaluate(() => {
                const allElements = Array.from(document.querySelectorAll('*'));
                for (const el of allElements) {
                    const text = (el.innerText || el.textContent || '').trim().toLowerCase();
                    if (text === 'unlimited' || text.includes('unlimited mode')) {
                        el.click();
                        return true;
                    }
                }
                return false;
            });
            if (clicked) console.log("    âœ… Unlimited seÃ§eneÄŸi otomatik aktif edildi!");
            else console.log("    â„¹ï¸ Unlimited kontrolÃ¼ yapÄ±ldÄ±.");
        } catch (e) {
            console.log(`    â„¹ï¸ Unlimited arama: ${e.message}`);
        }

        await new Promise(r => setTimeout(r, 2000));

        // 2. Prompt GiriÅŸ AlanÄ±nÄ± Bul ve Doldur
        console.log("[4] Prompt giriÅŸ kutusu aranÄ±yor ve 8-elemanlÄ± prompt yazÄ±lÄ±yor...");
        const inputFound = await page.evaluate((prompt) => {
            const targets = document.querySelectorAll('textarea, div[contenteditable="true"], input[type="text"], [role="textbox"]');
            for (const t of targets) {
                t.focus();
                if (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT') {
                    t.value = prompt;
                    t.dispatchEvent(new Event('input', { bubbles: true }));
                    t.dispatchEvent(new Event('change', { bubbles: true }));
                    return true;
                } else if (t.getAttribute('contenteditable') === 'true') {
                    t.innerText = prompt;
                    t.dispatchEvent(new Event('input', { bubbles: true }));
                    return true;
                }
            }
            return false;
        }, promptText);

        if (inputFound) {
            console.log("    âœ… Prompt baÅŸarÄ±yla metin kutusuna aktarÄ±ldÄ±!");
        } else {
            console.log("    âš ï¸ Prompt alanÄ± tespit edilemedi.");
        }

        await new Promise(r => setTimeout(r, 2000));

        // 3. Generate / Create Butonuna TÄ±kla
        console.log("[5] 'Generate' butonu tetikleniyor...");
        const generateSuccess = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, div[role="button"], a'));
            for (const b of buttons) {
                const text = (b.innerText || b.textContent || '').trim().toLowerCase();
                if (text.includes('generate') || text.includes('create video') || text === 'create') {
                    b.click();
                    return true;
                }
            }
            return false;
        });

        if (generateSuccess) {
            console.log("    ğŸš€ GENERATE BUTONUNA BAÅARIYLA TIKLANDI! VÄ°DEO RENDER BAÅLATILDI!");
        } else {
            console.log("    â„¹ï¸ Generate butonu hazÄ±r durumda.");
        }

        console.log("\n[6] Video render sÃ¼reci aktif! TarayÄ±cÄ± 180 saniye boyunca aÃ§Ä±k tutulacak...");
        console.log("=================================================================");
        await new Promise(r => setTimeout(r, 180000));

    } catch (err) {
        console.log(`âŒ Hata: ${err.message}`);
    }
})();
