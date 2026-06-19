# Déployer le Cockpit Isaacsanka sur Vercel via GitHub

## Ce dont tu as besoin
- Un compte **GitHub** (gratuit) → https://github.com
- Un compte **Vercel** (gratuit) → https://vercel.com
- Le dossier `isaacsanka` téléchargé sur ton ordinateur

---

## Étape 1 — Mettre le dossier sur GitHub

### A. Crée un nouveau dépôt GitHub
1. Va sur https://github.com/new
2. Dans "Repository name", tape : `isaacsanka-cockpit`
3. Laisse tout le reste par défaut
4. Clique **Create repository**

### B. Upload les fichiers directement depuis le navigateur
1. Sur la page qui s'ouvre, clique sur **"uploading an existing file"** (lien en bleu au milieu de la page)
2. Glisse-dépose les 3 fichiers du dossier `isaacsanka` dans la zone :
   - `index.html`
   - `manifest.json`
   - `DEPLOIEMENT.md`
3. En bas de la page, clique **Commit changes**
4. Tes fichiers sont maintenant sur GitHub ✓

---

## Étape 2 — Déployer sur Vercel

1. Va sur https://vercel.com et crée un compte avec ton compte GitHub (bouton "Continue with GitHub")
2. Une fois connectée, clique **Add New Project**
3. Tu vois la liste de tes dépôts GitHub — clique **Import** à côté de `isaacsanka-cockpit`
4. Sur l'écran suivant, ne change rien, clique directement **Deploy**
5. Vercel déploie en 30 secondes
6. Tu reçois une URL du type `isaacsanka-cockpit.vercel.app` → **c'est ton app en ligne** ✓

---

## Étape 3 — Installer l'app sur ton téléphone

### Sur iPhone (Safari uniquement)
1. Ouvre l'URL Vercel dans **Safari** (pas Chrome)
2. Appuie sur l'icône **Partager** (carré avec une flèche vers le haut)
3. Fais défiler et appuie sur **"Sur l'écran d'accueil"**
4. Appuie sur **Ajouter**
5. L'app apparaît sur ton écran d'accueil comme une vraie application

### Sur Android (Chrome)
1. Ouvre l'URL dans **Chrome**
2. Appuie sur les **3 points** en haut à droite
3. Appuie sur **"Ajouter à l'écran d'accueil"**
4. Confirme

---

## Mettre à jour l'app plus tard

Si tu veux modifier ou améliorer l'app :
1. Va sur https://github.com → ton dépôt `isaacsanka-cockpit`
2. Clique sur le fichier `index.html`
3. Clique sur l'icône **crayon** (Edit)
4. Fais tes modifications
5. Clique **Commit changes**
6. Vercel détecte automatiquement le changement et redéploie en moins d'une minute ✓

---

## Notes importantes

- Tes **données** (transactions, projets, tâches) sont sauvegardées dans ton navigateur (localStorage)
- Elles persistent entre les sessions sur le même navigateur et appareil
- Pour sauvegarder ou transférer tes données : utilise le bouton **Export CSV** dans l'app
- L'URL Vercel est permanente et gratuite

