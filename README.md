# 🚀 VintedManager - Gestionnaire de Ventes Vinted avec IA

Application complète pour gérer tes ventes Vinted avec l'intelligence artificielle Gemini pour générer automatiquement les descriptions et répondre aux clients.

## ✨ Fonctionnalités

- **Dashboard Analytics** : Suivi des ventes, revenus et marges en temps réel
- **Gestion d'Inventaire** : Ajout, modification, suppression d'articles
- **IA Gemini** : Génération automatique de descriptions attractives
- **Assistant Client** : Réponses automatiques aux messages clients
- **Export Excel** : Données complètes pour comptabilité
- **Interface Premium** : Design futuriste avec glassmorphisme

## 🛠️ Technologies

- **Frontend** : React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend** : Express.js, Node.js
- **Base de données** : PostgreSQL avec Drizzle ORM  
- **IA** : Google Gemini API
- **Déploiement** : Railway / Render (gratuit)

## 🚀 Déploiement Gratuit

### Prérequis
1. API Key Gemini (gratuite) : https://makersuite.google.com/app/apikey
2. Base PostgreSQL gratuite : Neon, Supabase ou ElephantSQL
3. Compte GitHub avec le code

### Railway (Recommandé)
1. Va sur https://railway.app
2. "New Project" > "Deploy from GitHub repo"
3. Ajoute les variables d'environnement :
   ```
   DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
   GEMINI_API_KEY=ton_api_key
   NODE_ENV=production
   ```
4. Deploy automatique en 3-5 minutes

### Render (Alternative)
1. Va sur https://render.com  
2. "New Web Service" depuis GitHub
3. Configuration :
   ```
   Build Command: node build-production.js
   Start Command: node start-production.js
   ```
4. Ajoute les mêmes variables d'environnement

## 📋 Variables d'Environnement

```bash
# Base de données PostgreSQL
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require

# API Gemini pour l'IA
GEMINI_API_KEY=your_gemini_api_key

# Configuration
NODE_ENV=production
```

## 🧪 Test Local

```bash
# Installation
npm install

# Base de données
npm run db:push

# Développement
npm run dev

# Test build production
node test-production-build.js
```

## 📖 Guide Complet

Voir `DEPLOYMENT_GUIDE.md` pour les instructions détaillées étape par étape.

## 💰 Coûts

- **Railway** : Gratuit (500h/mois, 1GB RAM)
- **Render** : Gratuit (750h/mois, 512MB RAM)  
- **Neon DB** : Gratuit (3GB)
- **Gemini API** : Gratuit (quotas généreux)

**Total : 100% gratuit** 🎉

## 🔧 Support

L'application est prête pour un déploiement en production avec :
- Configuration automatique des ports
- Build optimisé frontend/backend
- Variables d'environnement sécurisées
- Monitoring intégré
- Sauvegarde automatique

---

**Déploie ton gestionnaire Vinted en 5 minutes !** 🚀