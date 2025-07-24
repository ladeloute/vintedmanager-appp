export interface VintedAnnonce {
  title: string;
  price: string;
  size: string;
  brand: string;
  imageUrl: string;
}

export async function getVintedAnnonces(profileUrl: string): Promise<VintedAnnonce[]> {
  try {
    console.log(`🔍 Récupération automatique des annonces depuis: ${profileUrl}`);
    
    // Essayer plusieurs méthodes de scraping avec délai respectueux
    const methods = [
      () => scrapWithPuppeteer(profileUrl),
      () => scrapWithCheerio(profileUrl),
      () => scrapWithAxios(profileUrl)
    ];

    for (const method of methods) {
      try {
        console.log('🔧 Essai d\'une méthode de scraping...');
        const annonces = await method();
        if (annonces.length > 0) {
          console.log(`✅ ${annonces.length} annonces récupérées avec succès`);
          return annonces;
        }
      } catch (methodError) {
        console.log('⚠️ Méthode échouée, tentative suivante...');
        // Délai respectueux entre les tentatives
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    throw new Error('Toutes les méthodes de scraping ont échoué');
    
  } catch (error) {
    console.error('❌ Erreur lors du scraping Vinted:', error);
    throw new Error('Import automatique échoué: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
  }
}

// Méthode 1: Puppeteer pour navigateur complet avec JavaScript
async function scrapWithPuppeteer(profileUrl: string): Promise<VintedAnnonce[]> {
  const puppeteer = await import('puppeteer');
  console.log('🤖 Lancement de Puppeteer...');
  
  const browser = await puppeteer.default.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // User agent respectueux
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('📄 Chargement de la page...');
    await page.goto(profileUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Attendre le chargement des articles - essayer plusieurs sélecteurs
    try {
      await page.waitForSelector('.feed-grid', { timeout: 10000 });
    } catch {
      try {
        await page.waitForSelector('[data-testid="item-box"]', { timeout: 5000 });
      } catch {
        await page.waitForSelector('.ItemBox', { timeout: 5000 });
      }
    }
    
    console.log('🔍 Extraction des données...');
    const annonces = await page.evaluate(() => {
      const articles: any[] = [];
      // Essayer plusieurs sélecteurs pour les articles
      const selectors = [
        '.feed-grid .feed-grid__item',
        '[data-testid="item-box"]',
        '.ItemBox',
        '.c-item-box',
        '.item-card'
      ];
      
      let itemElements: NodeListOf<Element> | null = null;
      for (const selector of selectors) {
        itemElements = document.querySelectorAll(selector);
        if (itemElements.length > 0) break;
      }
      
      if (!itemElements) return articles;
      
      itemElements.forEach((item, index) => {
        if (index >= 20) return; // Limiter à 20 articles max
        
        try {
          const titleElement = item.querySelector('[data-testid="item-title"]') || 
                              item.querySelector('.ItemBox_overlay__1kNfX a') ||
                              item.querySelector('a[title]');
          
          const priceElement = item.querySelector('[data-testid="item-price"]') || 
                              item.querySelector('.ItemBox_price__X9NTr') ||
                              item.querySelector('.web_ui__Text__text');
          
          const imageElement = item.querySelector('img[src*="images.vinted.net"]') as HTMLImageElement;
          
          const linkElement = item.querySelector('a[href*="/items/"]') as HTMLAnchorElement;
          
          if (titleElement && priceElement && imageElement) {
            const title = titleElement.textContent?.trim() || '';
            const priceText = priceElement.textContent?.trim() || '';
            const price = priceText.replace(/[^\d,]/g, '').replace(',', '.');
            
            // Extraire taille et marque du titre si possible
            const titleParts = title.split(' ');
            const possibleSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '34', '36', '38', '40', '42', '44', '46', '48'];
            const foundSize = titleParts.find(part => possibleSizes.includes(part.toUpperCase()));
            
            articles.push({
              title: title,
              price: price,
              size: foundSize || 'Taille unique',
              brand: titleParts[0] || 'Marque inconnue',
              imageUrl: imageElement.src
            });
          }
        } catch (e) {
          console.log('Erreur extraction article:', e);
        }
      });
      
      return articles;
    });

    console.log(`📦 ${annonces.length} annonces extraites avec Puppeteer`);
    return annonces;
    
  } finally {
    await browser.close();
  }
}

// Méthode 2: Cheerio avec axios pour le HTML statique
async function scrapWithCheerio(profileUrl: string): Promise<VintedAnnonce[]> {
  const axios = await import('axios');
  const { load } = await import('cheerio');
  
  console.log('🔧 Scraping avec Cheerio...');
  
  const response = await axios.default.get(profileUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br'
    },
    timeout: 15000
  });

  const $ = load(response.data);
  const annonces: VintedAnnonce[] = [];
  
  // Rechercher les données JSON dans le script
  $('script').each((i: number, script: any) => {
    const content = $(script).html();
    if (content && content.includes('window.App')) {
      try {
        const match = content.match(/window\.App\s*=\s*({.*?});/);
        if (match) {
          const appData = JSON.parse(match[1]);
          if (appData.items) {
            appData.items.slice(0, 20).forEach((item: any) => {
              if (item.title && item.price) {
                annonces.push({
                  title: item.title.trim(),
                  price: formatPrice(item.price),
                  size: item.size_title || 'Taille unique',
                  brand: item.brand_title || 'Marque inconnue',
                  imageUrl: item.photos?.[0]?.high_resolution?.url || item.photos?.[0]?.url || ''
                });
              }
            });
          }
        }
      } catch (e) {
        // Ignorer les erreurs de parsing JSON
      }
    }
  });
  
  console.log(`📦 ${annonces.length} annonces extraites avec Cheerio`);
  return annonces;
}

// Méthode 3: Axios simple avec extraction de base
async function scrapWithAxios(profileUrl: string): Promise<VintedAnnonce[]> {
  const axios = await import('axios');
  
  console.log('🌐 Scraping avec Axios...');
  
  const response = await axios.default.get(profileUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    timeout: 10000
  });

  return extractAnnoncesFromHTML(response.data);
}

// Fonction utilitaire pour formater le prix
function formatPrice(price: any): string {
  if (typeof price === 'string') {
    return price.replace(/[^\d,]/g, '').replace(',', '.');
  }
  if (typeof price === 'number') {
    return price.toString();
  }
  if (price && price.amount) {
    return price.amount.toString();
  }
  return '0';
}

function extractUserIdFromUrl(url: string): string | null {
  const match = url.match(/\/member\/(\d+)/);
  return match ? match[1] : null;
}

function extractAnnoncesFromHTML(html: string): VintedAnnonce[] {
  const annonces: VintedAnnonce[] = [];
  
  // Chercher les données JSON dans window.App
  const jsonMatch = html.match(/window\.App\s*=\s*({.*?});/);
  if (jsonMatch) {
    try {
      const appData = JSON.parse(jsonMatch[1]);
      if (appData.items) {
        appData.items.slice(0, 20).forEach((item: any) => {
          if (item.title && item.price) {
            annonces.push({
              title: item.title.trim(),
              price: formatPrice(item.price),
              size: item.size_title || 'Taille unique',
              brand: item.brand_title || 'Marque inconnue',
              imageUrl: item.photos?.[0]?.high_resolution?.url || item.photos?.[0]?.url || ''
            });
          }
        });
      }
    } catch (e) {
      console.log('Erreur parsing JSON depuis HTML:', e);
    }
  }
  
  // Fallback: extraction basique depuis le HTML
  if (annonces.length === 0) {
    const itemBoxes = html.match(/<div[^>]*class="[^"]*ItemBox[^"]*"[^>]*>.*?<\/div>/g) || [];
    
    itemBoxes.slice(0, 10).forEach((box, index) => {
      const titleMatch = box.match(/title="([^"]+)"/);
      const priceMatch = box.match(/€\s*(\d+(?:,\d+)?)/);
      const imageMatch = box.match(/src="([^"]*images\.vinted\.net[^"]*)"/);
      
      if (titleMatch && priceMatch) {
        annonces.push({
          title: titleMatch[1].trim(),
          price: priceMatch[1].replace(',', '.'),
          size: 'Taille unique',
          brand: 'Marque inconnue',
          imageUrl: imageMatch?.[1] || ''
        });
      }
    });
  }
  
  return annonces;
}