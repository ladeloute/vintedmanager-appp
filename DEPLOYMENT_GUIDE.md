# 🚀 Guide de Déploiement Gratuit - VintedManager

## 📋 Prérequis

Avant de déployer, assure-toi d'avoir :

1. **Compte GitHub** avec ton code pushé
2. **API Key Gemini** (gratuite) : https://makersuite.google.com/app/apikey  
3. **Base de données PostgreSQL gratuite** (voir options ci-dessous)

---

## 🗄️ Étape 1 : Base de données PostgreSQL gratuite

### Option A : Neon (Recommandé - 3GB gratuit)
1. Va sur https://neon.tech
2. Inscription gratuite avec GitHub
3. Créer un nouveau projet
4. Copie l'URL de connexion (format : `postgresql://user:pass@host/db?sslmode=require`)

### Option B : Supabase (500MB gratuit)
1. Va sur https://supabase.com
2. Nouveau projet
3. Va dans Settings > Database 
4. Copie la "Connection string"

### Option C : ElephantSQL (20MB gratuit)
1. Va sur https://elephantsql.com
2. Plan "Tiny Turtle" gratuit
3. Copie l'URL de la base

---

## 🚂 Déploiement sur Railway (Recommandé)

### Étapes :

1. **Inscription Railway**
   - Va sur https://railway.app
   - Connecte-toi avec GitHub

2. **Créer un nouveau projet**
   - Clique "New Project"
   - "Deploy from GitHub repo"
   - Sélectionne ton repo VintedManager

3. **Variables d'environnement**
   Dans le dashboard Railway, ajoute :
   ```
   DATABASE_URL=ton_url_postgresql_complet
   GEMINI_API_KEY=ton_api_key_gemini
   NODE_ENV=production
   ```

4. **Déploiement automatique**
   - Railway détecte automatiquement Node.js
   - Le build se lance avec `nixpacks.toml`
   - Attendre 3-5 minutes

5. **Obtenir l'URL**
   - Dans Settings > Domains
   - Railway génère une URL automatique
   - Ton app sera accessible !

---

## 🎨 Déploiement sur Render (Alternative)

### Étapes :

1. **Inscription Render**
   - Va sur https://render.com
   - Connecte-toi avec GitHub

2. **Nouveau Web Service**
   - "New" > "Web Service"
   - Connecte ton repo GitHub
   - Sélectionne VintedManager

3. **Configuration Build**
   ```
   Build Command: node build-production.js
   Start Command: node start-production.js
   ```

4. **Variables d'environnement**
   Dans Environment, ajoute :
   ```
   DATABASE_URL=ton_url_postgresql_complet
   GEMINI_API_KEY=ton_api_key_gemini
   NODE_ENV=production
   ```

5. **Déployement**
   - Plan gratuit sélectionné
   - "Create Web Service"
   - Build automatique en 5-10 minutes

---

## ✅ Vérification du déploiement

### Tests à faire :

1. **Page d'accueil** : L'interface se charge correctement
2. **Dashboard** : Les statistiques s'affichent (même vides)
3. **Ajout d'article** : Formulaire fonctionne
4. **IA Description** : Test de génération avec Gemini
5. **Base de données** : Articles sauvegardés persistent

### En cas de problème :

1. **Logs Railway** : Dashboard > Deployments > View Logs
2. **Logs Render** : Service > Logs tab
3. **Erreurs communes** :
   - `DATABASE_URL` mal formaté
   - `GEMINI_API_KEY` invalide
   - Port non configuré (automatique sur Railway/Render)

---

## 💰 Coûts

### Railway (Plan gratuit)
- **Usage inclus** : $5 de crédit/mois
- **Limites** : 500h execution, 1GB RAM, 1GB stockage
- **Avantage** : Pas de suspension automatique

### Render (Plan gratuit)  
- **Usage inclus** : 750h/mois
- **Limites** : 512MB RAM, applications dorment après 15min inactivité
- **Avantage** : Simple et fiable

### Bases de données
- **Neon** : 3GB gratuit (largement suffisant)
- **Supabase** : 500MB gratuit
- **ElephantSQL** : 20MB gratuit

---

## 🔧 Maintenance

### Mise à jour du code :
1. Push tes changements sur GitHub
2. Railway/Render redéploie automatiquement
3. Vérifier les logs si problème

### Monitoring :
- Railway : Dashboard avec métriques temps réel
- Render : Metrics tab avec utilisation ressources

### Sauvegarde DB :
- Neon : Snapshots automatiques
- Supabase : Export SQL depuis dashboard

---

## 🆘 Support

En cas de blocage :
1. Vérifier les logs de déploiement
2. Tester les variables d'environnement
3. S'assurer que la DB est accessible
4. Vérifier que l'API Gemini fonctionne

**Ton app sera accessible 24/7 gratuitement !** 🎉