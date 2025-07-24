// Service pour récupérer les annonces Vinted d'un profil public
export interface VintedAnnonce {
  title: string;
  price: string;
  size: string;
  brand: string;
  imageUrl: string;
}

export async function getVintedAnnonces(profileUrl: string): Promise<VintedAnnonce[]> {
  try {
    console.log(`Récupération automatique des annonces depuis: ${profileUrl}`);
    
    const userId = extractUserIdFromUrl(profileUrl);
    if (!userId) {
      throw new Error('Impossible d\'extraire l\'ID utilisateur depuis l\'URL');
    }

    // Essayer plusieurs méthodes d'API Vinted
    const methods = [
      () => getVintedAPIv2(userId),
      () => getVintedAPIv1(userId),
      () => getVintedProfileData(profileUrl),
      () => getVintedWithProxy(profileUrl)
    ];

    for (const method of methods) {
      try {
        const annonces = await method();
        if (annonces.length > 0) {
          console.log(`${annonces.length} annonces récupérées automatiquement`);
          return annonces;
        }
      } catch (methodError) {
        console.log('Méthode échouée, essai suivant...');
      }
    }

    // Si toutes les méthodes échouent, utiliser les données du profil
    console.log('Import automatique - utilisation des données du profil public');
    return await getVintedPublicData(userId);
    
  } catch (error) {
    console.error('Erreur lors de la récupération automatique:', error);
    throw new Error('Import automatique échoué: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
  }
}

async function getVintedAPIv2(userId: string): Promise<VintedAnnonce[]> {
  const apiUrl = `https://www.vinted.fr/api/v2/users/${userId}/items?page=1&per_page=20`;
  
  const response = await fetch(apiUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
      'Referer': 'https://www.vinted.fr/',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });
  
  if (!response.ok) {
    throw new Error(`API v2 Error: ${response.status}`);
  }
  
  const data = await response.json();
  return parseVintedItems(data.items || []);
}

async function getVintedAPIv1(userId: string): Promise<VintedAnnonce[]> {
  const apiUrl = `https://www.vinted.fr/api/v1/users/${userId}/items`;
  
  const response = await fetch(apiUrl, {
    headers: {
      'User-Agent': 'VintedMobileApp',
      'Accept': 'application/json',
    }
  });
  
  if (!response.ok) {
    throw new Error(`API v1 Error: ${response.status}`);
  }
  
  const data = await response.json();
  return parseVintedItems(data.items || []);
}

async function getVintedProfileData(profileUrl: string): Promise<VintedAnnonce[]> {
  const response = await fetch(profileUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
    }
  });

  if (!response.ok) {
    throw new Error(`Profile Error: ${response.status}`);
  }

  const html = await response.text();
  
  // Chercher les données JSON dans le script
  const jsonDataRegex = /window\.App\s*=\s*({.*?});/;
  const match = html.match(jsonDataRegex);
  
  if (match) {
    try {
      const appData = JSON.parse(match[1]);
      if (appData.items) {
        return parseVintedItems(appData.items);
      }
    } catch (e) {
      console.log('Erreur parsing JSON:', e);
    }
  }
  
  return extractAnnoncesFromHTML(html);
}

async function getVintedWithProxy(profileUrl: string): Promise<VintedAnnonce[]> {
  // Utiliser un service proxy simple pour contourner les restrictions
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(profileUrl)}`;
  
  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error(`Proxy Error: ${response.status}`);
  }
  
  const data = await response.json();
  return extractAnnoncesFromHTML(data.contents);
}

async function getVintedPublicData(userId: string): Promise<VintedAnnonce[]> {
  throw new Error('Import automatique Vinted impossible: Vinted protège ses données avec des mesures anti-scraping. L\'extraction automatique nécessiterait un navigateur complet (Puppeteer/Selenium) qui n\'est pas disponible dans cet environnement.');
}

function parseVintedItems(items: any[]): VintedAnnonce[] {
  const annonces: VintedAnnonce[] = [];
  
  items.forEach((item: any) => {
    if (item.title && item.price && item.photos && item.photos.length > 0) {
      annonces.push({
        title: item.title.trim(),
        price: formatPrice(item.price),
        size: item.size_title || 'Taille unique',
        brand: item.brand_title || 'Sans marque',
        imageUrl: item.photos[0].high_resolution?.url || item.photos[0].url
      });
    }
  });
  
  return annonces;
}

function extractUserIdFromUrl(url: string): string | null {
  const match = url.match(/\/member\/(\d+)/);
  return match ? match[1] : null;
}

async function getVintedAPI(userId: string): Promise<VintedAnnonce[]> {
  const apiUrl = `https://www.vinted.fr/api/v2/users/${userId}/items`;
  
  const response = await fetch(apiUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Referer': 'https://www.vinted.fr/',
    }
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  const data = await response.json();
  const annonces: VintedAnnonce[] = [];
  
  if (data.items && Array.isArray(data.items)) {
    data.items.forEach((item: any) => {
      if (item.title && item.price && item.photos && item.photos.length > 0) {
        annonces.push({
          title: item.title.trim(),
          price: formatPrice(item.price),
          size: item.size_title || 'Taille unique',
          brand: item.brand_title || 'Sans marque',
          imageUrl: item.photos[0].high_resolution?.url || item.photos[0].url
        });
      }
    });
  }
  
  return annonces;
}



function extractAnnoncesFromHTML(html: string): VintedAnnonce[] {
  const annonces: VintedAnnonce[] = [];
  
  try {
    // Chercher les données JSON dans le HTML (Vinted utilise des données structurées)
    const scriptRegex = /<script[^>]*>.*?window\.App\s*=\s*({.*?});.*?<\/script>/;
    const scriptMatches = html.match(scriptRegex);
    
    if (scriptMatches && scriptMatches[1]) {
      const appData = JSON.parse(scriptMatches[1]);
      
      // Parcourir les données pour trouver les articles
      if (appData.items && Array.isArray(appData.items)) {
        appData.items.forEach((item: any) => {
          if (item.title && item.price && item.photos && item.photos.length > 0) {
            annonces.push({
              title: item.title.trim(),
              price: formatPrice(item.price),
              size: item.size_title || 'Taille unique',
              brand: item.brand_title || 'Sans marque',
              imageUrl: item.photos[0].full_size_url || item.photos[0].url
            });
          }
        });
      }
    } else {
      // Fallback: parsing HTML direct si pas de données JSON
      const itemRegex = /<div[^>]*class="[^"]*item-card[^"]*"[^>]*>.*?<\/div>/g;
      let match;
      
      while ((match = itemRegex.exec(html)) !== null) {
        const itemHTML = match[0];
        
        const titleMatch = itemHTML.match(/title="([^"]+)"/);
        const priceMatch = itemHTML.match(/([0-9,]+)\s*€/);
        const imageMatch = itemHTML.match(/src="([^"]+)"/);
        
        if (titleMatch && priceMatch && imageMatch) {
          annonces.push({
            title: titleMatch[1].trim(),
            price: priceMatch[1].replace(',', '.'),
            size: 'Taille unique',
            brand: 'À définir',
            imageUrl: imageMatch[1]
          });
        }
      }
    }
    
  } catch (error) {
    console.error('Erreur lors de l\'extraction des données:', error);
  }
  
  return annonces;
}

function formatPrice(price: any): string {
  if (typeof price === 'number') {
    return price.toString();
  }
  if (typeof price === 'string') {
    return price.replace(',', '.');
  }
  if (price && price.amount) {
    return (price.amount / 100).toString(); // Vinted stocke souvent en centimes
  }
  return '0';
}