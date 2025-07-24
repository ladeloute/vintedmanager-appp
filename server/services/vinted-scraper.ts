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
    console.log(`Récupération des annonces depuis: ${profileUrl}`);
    
    // Essayer d'abord l'API Vinted directe
    const userId = extractUserIdFromUrl(profileUrl);
    if (userId) {
      try {
        const apiAnnonces = await getVintedAPI(userId);
        if (apiAnnonces.length > 0) {
          console.log(`${apiAnnonces.length} annonces trouvées via API`);
          return apiAnnonces;
        }
      } catch (apiError) {
        console.log('API Vinted non accessible, tentative de scraping HTML...');
      }
    }
    
    // Fallback: scraping HTML
    const response = await fetch(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const html = await response.text();
    
    // Log pour debug
    console.log('HTML reçu, taille:', html.length);
    console.log('Première partie du HTML:', html.substring(0, 500));
    
    // Extraire les données des annonces depuis le HTML
    const annonces = extractAnnoncesFromHTML(html);
    
    console.log(`${annonces.length} annonces trouvées`);
    
    // Si aucune annonce trouvée via scraping HTML
    if (annonces.length === 0) {
      throw new Error('Impossible de récupérer les annonces Vinted automatiquement. Vinted utilise du JavaScript dynamique qui empêche l\'extraction automatique. Vous devrez ajouter les articles manuellement ou fournir une solution alternative.');
    }
    
    return annonces;
    
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces Vinted:', error);
    throw new Error('Import Vinted échoué: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
  }
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