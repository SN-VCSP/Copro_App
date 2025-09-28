# Poubelles Copro — Version Google Sheets + Glide-ready

Cette version remplace le `localStorage` par **Google Sheets** via un **Web App Google Apps Script**.
Tu pourras ensuite **connecter la même feuille** à **Glide** pour générer l'app finale.

---

## 1) Créer le Google Sheet + Apps Script

1. Crée un nouveau **Google Sheet** (ex: `Poubelles Copro`).
2. Menu `Extensions` → `Apps Script`.
3. Colle le contenu de `apps_script/Code.gs` dans l'éditeur. Sauvegarde.
4. Menu `Déployer` → `Déployer en tant qu'application web` :
   - *Description*: `API Poubelles`
   - *Exécuter en tant que*: **Vous**
   - *Qui a accès*: **Toute personne disposant du lien**
   - Clique **Déployer** puis copie l’**URL Web** fournie (elle finit par `/exec`).

> Si l'éditeur te demande des autorisations, accepte-les.

---

## 2) Configurer l'URL dans l'app

1. Ouvre `index.html`.
2. Remplace la constante `API_BASE` :
   ```js
   const API_BASE = "https://script.google.com/macros/s/AKfycb.../exec";
   ```
3. Ouvre `index.html` dans ton navigateur. La ligne “Stockage: Google Sheets …” doit afficher `• à jour` après quelques secondes.

> Hors connexion, l’app utilise un cache local et synchronise à la reconnexion.

---

## 3) Schéma des données (simple)

L’API stocke **tout l’état** dans la cellule **A1** de la feuille **`State`** au format JSON.
C’est compatible avec l’app actuelle.

Si tu veux un schéma **plus “Glide friendly”** (tables normalisées), voici une option alternative (facultative) :
- Feuille `Plan` : `id, date, semaine, libelle, personne, status`
- Feuille `Stats` : `personne, done, missed, points, streak`
- Feuille `Changes` : `taskId, from, to, at`
> Cette version de code n’en a pas besoin, mais tu peux évoluer vers ça pour Glide.

---

## 4) Utiliser avec Glide (optionnel maintenant, utile après)

1. Dans Glide, choisis **Google Sheets** comme source et sélectionne ton fichier.
2. Commence par afficher la feuille `State` (ou un dérivé que tu crées depuis le JSON).
3. Tu peux aussi créer des **Actions Glide** pour marquer une tâche comme faite, etc.

---

## 5) Développement local / hébergement

- Ouvre simplement `index.html` dans le navigateur (fichier local) ou héberge-le sur Netlify/Vercel/etc.
- Assure-toi que l’URL `API_BASE` pointe vers ton déploiement **/exec**.

---

## 6) Notes techniques

- Concurrence: l’écriture côté Apps Script est protégée par `LockService`.
- CORS: publication “toute personne disposant du lien” est suffisante pour `fetch` depuis un fichier local.
- P2P WebRTC reste présent pour des syncs rapides **en plus** du backend Google Sheets.

Bon build ! 🚀
