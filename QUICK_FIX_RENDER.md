# 🚨 Fix Rapide pour Render

## Problème détecté
- `vite: not found` dans le build Render
- Build command incorrecte dans le Dockerfile

## Solutions créées
1. **`render.yaml`** : Configuration spécifique Render
2. **`build.sh`** : Script de build robuste 
3. **`.buildpacks`** : Buildpack Node.js correct

## Action immédiate requise

### 1. Push les corrections
```bash
git add .
git commit -m "Add Render config files and fix build"
git push origin main
```

### 2. Dans l'interface Render
- Va dans "Settings" de ton service
- Cherche "Build & Deploy"
- Change le **Build Command** par : `./build.sh`
- Change le **Start Command** par : `node dist/server.js`

### 3. Ajouter les variables d'environnement
```
DATABASE_URL = postgresql://neondb_owner:npg_Xr6q3iWBZCpn@ep-divine-queen-aedkofyc-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

GEMINI_API_KEY = [récupère sur https://makersuite.google.com/app/apikey]

NODE_ENV = production
```

### 4. Redéployer
- Clique "Manual Deploy" dans Render
- Le build va maintenant fonctionner

## Résultat attendu
✅ Build successful avec frontend + backend
✅ App accessible sur l'URL Render
✅ Toutes fonctionnalités IA opérationnelles