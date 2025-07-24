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
    
    // Récupérer la page du profil
    const response = await fetch(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const html = await response.text();
    
    // Extraire les données des annonces depuis le HTML
    const annonces = extractAnnoncesFromHTML(html);
    
    console.log(`${annonces.length} annonces trouvées`);
    return annonces;
    
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces Vinted:', error);
    throw error;
  }
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