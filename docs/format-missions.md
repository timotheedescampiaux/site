# Format des missions (25 novembre 2026)

Équipe : Nora (learning design), Félix (interaction et game design), Thomas (formateur IA), Sarah (cliente type).

## Règles communes
- Une mission = 5 minutes, un seul « geste » appris.
- On joue moins de 1 min 30, puis l'étape « Faire » est obligatoire, sur son propre cas si possible (sinon mode entraînement sur données fictives).
- Pas de chrono visible, pas de score de révision, jamais de rouge ni de « faux » : annotations en marge (pourquoi c'est correct, où est l'erreur, pourquoi l'IA fait ça).
- Les débutantes ne sont jamais mises en échec : indice avant de chercher, une erreur évidente sur trois, zone éclairée après deux essais.
- Réponses d'IA simulées générées sur 2-3 vrais assistants puis retouchées, étiquetées « Réponse type, simulée », formulées « ça peut arriver ».
- Passage téléphone → ordinateur : « Continuer sur ordinateur » envoie un lien (48 h) qui reprend à l'étape « Faire ».
- Issue « mon entreprise bloque l'IA » : entraînement sur données fictives + quoi demander en interne. La règle de l'entreprise passe toujours en premier.
- Ancrage : une question de rappel à l'ouverture (bouton « Passer »), intention « quand X, je fais Y » gardée au Carnet, « ça a servi ? » à J+1, « as-tu réutilisé ? » à J+3, révision de 3 minutes le vendredi.
- Retour : choix du thème du lendemain (2 portes), aucune relance le soir ni le week-end, mission manquée sans compteur.
- Fil de bureau fictif récurrent (Karim le manager, Mme Ferrand la cliente), 2 lignes maximum, jamais en feuilleton.

## Format 1 « Repère et répare » (missions qui produisent un livrable)
0:00 rappel · 0:20 situation · 0:45 Devine ce que l'IA va faire · 1:15 Tape l'erreur (annotations) · 2:15 Répare : l'ingrédient manquant + avant/après · 2:45 À toi : monter la demande, Copier ma demande / Continuer sur ordinateur / entraînement · 4:15 3 vérifications, Garder dans le Carnet · 4:50 intention + thème de demain. Emporte : un livrable réel et une demande réutilisable. Production : ~1 h 15 (2 h pour les premières).

## Format 2 « Prédis, compare, juge » (esprit critique, confidentialité, actualité, apprendre)
0:00 rappel · 0:20 situation · 0:45 Devine · 1:30 Duel ou Collable ou pas · 2:30 la règle et son pourquoi · 3:00 application courte dans son assistant · 4:30 fiche réflexe + intention · 4:50 thème de demain. Emporte : un réflexe et une fiche au Carnet. Production : ~1 h.

## Composants à coder (une fois)
1. Repérer dans un texte (phrases tapables de 48 px ; alternative : cases à cocher) — sert aussi à l'anonymiseur. 2. Choix avec pourquoi (duel, pronostic, ingrédient manquant ; boutons radio natifs). 3. Trier des cartes (glisser ; alternative : deux boutons). 4. Avant / après (curseur ; alternative : onglets). 5. La demande à monter (champs, puces, aperçu, Copier, Ouvrir mon assistant). 6. Retour et Carnet (résultat facultatif, vérifications, intention, Garder). Reportée : la réponse simulée qui évolue selon les champs (2 missions au plus).

## Gabarit de production (Thomas)
Une « bible » du bureau fictif (entreprise, personnages, chiffres cohérents) ; un catalogue d'une dizaine d'erreurs d'IA réelles avec explication type ; une fiche par mission (situation et données fictives, réponse fautive avec 3 erreurs annotées, bon ingrédient + 2 leurres, champs, check-list de 3 points, « ce que tu as appris », intention).

## Répartition des thèmes : deux options
- **Option A (Thomas, Sarah)** : 7 missions bureau (écrire ×2, synthétiser, préparer une réunion ou un oral, vérifier, confidentialité, tableaux et chiffres ; « relire et corriger » possible) + 3 d'exploration (actualité, apprendre avec l'IA, perso ou création au choix).
- **Option B (Nora)** : 5-6 missions bureau + 4-5 sur d'autres thèmes, avec deux « portes » au choix à J6 et J9 : J1 Le mail qui traîne · J2 Compte rendu express · J3 Ce que je peux coller (ou pas) · J4 L'IA a l'air sûre d'elle · J5 La réclamation qui obtient une réponse · J6 porte : 10 idées pour le pot de départ / Fais-toi expliquer un sujet en 5 min · J7 Dire non sans froisser · J8 Mission nouveauté · J9 porte : Le document de 20 pages / Préparer un voyage ou un budget · J10 Ta demande à toi.

Retour de Sarah : préfère le format « Défi » (Repère et répare), veut le chrono facultatif, le passage sur ordinateur absolument, aime taper l'erreur, l'anonymiseur et le Carnet ; vie perso pratique oui, création bof, le bureau doit rester majoritaire.
