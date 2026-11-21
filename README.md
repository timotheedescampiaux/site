# Néo — l'IA en 5 minutes par jour (prototype)

> Nom et mascotte provisoires.

## Mission
Démocratiser l'IA : permettre à n'importe qui de **comprendre** l'IA, de **s'en servir** et de **suivre son évolution**, grâce à un jeu quotidien, gratuit pour tous, financé à terme par les écoles (puis par les entreprises).

## Cadrage du prototype

**Objectif** : avoir une démo jouable sur téléphone à montrer à des étudiants et à une école pilote, pour tester le format (« est-ce qu'on a envie d'y revenir demain ? »).

**Public test** : des étudiants francophones, débutants ou intermédiaires en IA.

**Dans le prototype**
| Brique | Contenu |
|---|---|
| Onboarding | Présentation de la mascotte Néo, prénom, promo, objectif quotidien |
| Parcours | « Les bases de l'IA » : 3 unités, 9 leçons de 3 à 5 minutes, carte de progression |
| 6 types de défis | Notion, QCM, vrai/faux, « choisis le meilleur prompt », « remets dans l'ordre », « repère l'erreur de l'IA » |
| Gamification | XP, objectif du jour, série de jours (streak), combo, badges, erreurs à rejouer en fin de leçon |
| Défi actu | La nouveauté IA de la semaine, expliquée en 2 minutes + quiz |
| Ligue | Classement hebdo de la promo (camarades fictifs pour la démo) |
| Profil | Stats et badges |

**Hors prototype** (étapes suivantes) : vrais comptes et ligues réelles (backend), tableau de bord enseignant, certificats, notifications, back-office pour publier le défi actu, app native.

**Technique** : HTML/CSS/JS sans dépendance ni build, mobile-first. La progression est sauvegardée dans le navigateur. Hébergeable gratuitement (GitHub Pages, Netlify).

## Lancer
Ouvrir `index.html` dans un navigateur, ou :
```bash
python3 -m http.server 8000
```
puis aller sur http://localhost:8000.

## Modifier le contenu
Toutes les leçons et les défis actu sont dans `js/content.js`. Chaque leçon est une liste d'exercices (`learn`, `qcm`, `tf`, `prompt`, `order`, `spot`).

---
Projet indépendant, non affilié à OpenAI, Anthropic, Google ou Mistral AI. Les noms cités le sont à titre informatif.
