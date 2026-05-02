# Cahier de recette — Playlink v2

**Projet :** Playlink — Application de jeux de cartes en soirée
**Date de rédaction :** 02/05/2026
**Architecture :** Monorepo pnpm — 4 packages (api, user-app, admin, shared)

---

## Environnements

| Service | URL locale |
|---|---|
| App utilisateur | http://localhost:3000 |
| Admin | http://localhost:3001 |
| API Express | http://localhost:3002 |

## Légende des statuts

| Statut | Signification |
|---|---|
| ✅ | Validé |
| ❌ | Échoué |
| ⚠️ | Partiel / à revoir |
| — | Non testé |

---

## 1. App utilisateur — Page d'accueil

### APP-01 — Affichage de la liste des jeux actifs

**Préconditions :** L'API est démarrée. Au moins un jeu est marqué actif en base. L'utilisateur est connecté au réseau.

**Étapes :**
1. Ouvrir http://localhost:3000
2. Attendre le chargement de la page

**Résultat attendu :** La liste des jeux actifs s'affiche. Chaque jeu présente son nom, son emoji et sa couleur associée.

**Statut :** —

---

### APP-02 — Mise en cache des jeux dans le localStorage

**Préconditions :** L'API est démarrée. Au moins un jeu actif existe.

**Étapes :**
1. Ouvrir http://localhost:3000
2. Attendre le chargement complet
3. Ouvrir les outils développeur → onglet Application → LocalStorage
4. Vérifier la présence d'une clé liée au cache des jeux

**Résultat attendu :** Les données issues de `/api/cards/export` sont stockées dans le localStorage.

**Statut :** —

---

### APP-03 — Mode offline avec cache disponible

**Préconditions :** L'app a déjà été chargée une fois avec réseau (cache localStorage présent).

**Étapes :**
1. Ouvrir les outils développeur → onglet Network → cocher "Offline"
2. Recharger la page http://localhost:3000

**Résultat attendu :** La liste des jeux s'affiche depuis le cache. Une bannière "Hors ligne" est visible dans l'interface.

**Statut :** —

---

### APP-04 — Mode offline sans cache

**Préconditions :** Le localStorage est vide (effacer manuellement les données ou utiliser une navigation privée vierge).

**Étapes :**
1. Ouvrir les outils développeur → onglet Network → cocher "Offline"
2. Ouvrir http://localhost:3000

**Résultat attendu :** Un message d'erreur clair s'affiche, indiquant que les jeux ne sont pas disponibles et qu'une connexion est nécessaire. Aucun crash ou écran blanc.

**Statut :** —

---

### APP-05 — Retour en ligne après mode offline

**Préconditions :** Le mode offline a été activé (APP-03 ou APP-04).

**Étapes :**
1. Désactiver le mode offline dans les outils développeur
2. Recharger la page

**Résultat attendu :** La liste des jeux se charge normalement depuis l'API. La bannière "Hors ligne" disparaît si elle était présente.

**Statut :** —

---

## 2. App utilisateur — Dark mode

### APP-06 — Activation du dark mode

**Préconditions :** L'app est ouverte en mode clair (par défaut).

**Étapes :**
1. Ouvrir http://localhost:3000
2. Cliquer sur le bouton de bascule du dark mode dans le header

**Résultat attendu :** L'interface passe immédiatement en mode sombre. Le fond, les textes et les composants adoptent les couleurs du thème sombre.

**Statut :** —

---

### APP-07 — Persistance du dark mode au rechargement

**Préconditions :** Le dark mode a été activé (APP-06).

**Étapes :**
1. Recharger la page (F5 ou Cmd+R)

**Résultat attendu :** La page se recharge directement en mode sombre, sans passer brièvement par le mode clair.

**Statut :** —

---

### APP-08 — Absence de flash au rechargement (FOUC)

**Préconditions :** Le dark mode est activé et persisté en localStorage.

**Étapes :**
1. Recharger la page plusieurs fois en observant attentivement le rendu initial

**Résultat attendu :** Aucun flash blanc (FOUC — Flash Of Unstyled Content) n'est visible au chargement. Le thème est appliqué avant le premier paint.

**Statut :** —

---

### APP-09 — Désactivation du dark mode et persistance

**Préconditions :** Le dark mode est activé.

**Étapes :**
1. Cliquer sur le bouton de bascule pour repasser en mode clair
2. Recharger la page

**Résultat attendu :** L'interface repasse en mode clair. Après rechargement, le mode clair est maintenu.

**Statut :** —

---

## 3. App utilisateur — Page de jeu

### APP-10 — Navigation vers une page de jeu valide

**Préconditions :** Au moins un jeu actif avec des catégories et des cartes existe.

**Étapes :**
1. Depuis la page d'accueil, cliquer sur un jeu

**Résultat attendu :** La page `/game/[slug]` s'ouvre. Un sélecteur de catégories est affiché.

**Statut :** —

---

### APP-11 — Sélection d'une catégorie et lancement du deck

**Préconditions :** La page d'un jeu est ouverte (APP-10).

**Étapes :**
1. Cliquer sur une catégorie disponible

**Résultat attendu :** Le deck de cartes de cette catégorie se lance. La première carte est affichée.

**Statut :** —

---

### APP-12 — Navigation par swipe gauche (carte suivante)

**Préconditions :** Un deck est en cours (APP-11), au moins 2 cartes dans la catégorie.

**Étapes :**
1. Effectuer un swipe vers la gauche sur la carte affichée (simuler via touch events ou tester sur mobile)

**Résultat attendu :** La carte suivante s'affiche.

**Statut :** —

---

### APP-13 — Navigation par swipe droite (carte précédente)

**Préconditions :** Au moins 2 cartes ont été consultées dans le deck en cours.

**Étapes :**
1. Effectuer un swipe vers la droite sur la carte affichée

**Résultat attendu :** La carte précédente s'affiche.

**Statut :** —

---

### APP-14 — Navigation par bouton chevron suivant

**Préconditions :** Un deck est en cours, au moins 2 cartes.

**Étapes :**
1. Cliquer sur le bouton chevron droit (ou "suivant") de l'interface

**Résultat attendu :** La carte suivante s'affiche. Comportement identique au swipe gauche.

**Statut :** —

---

### APP-15 — Navigation par bouton chevron précédent

**Préconditions :** Au moins 2 cartes ont été consultées dans le deck.

**Étapes :**
1. Cliquer sur le bouton chevron gauche (ou "précédent") de l'interface

**Résultat attendu :** La carte précédente s'affiche. Comportement identique au swipe droite.

**Statut :** —

---

### APP-16 — Écran de fin de deck

**Préconditions :** Un deck est en cours, toutes les cartes ont été consultées.

**Étapes :**
1. Naviguer jusqu'à la dernière carte
2. Passer à la carte suivante

**Résultat attendu :** Un écran de fin s'affiche avec l'emoji 🎉 et un bouton "Changer de catégorie".

**Statut :** —

---

### APP-17 — Retour au sélecteur de catégorie depuis l'écran de fin

**Préconditions :** L'écran de fin de deck est affiché (APP-16).

**Étapes :**
1. Cliquer sur le bouton "Changer de catégorie"

**Résultat attendu :** Le sélecteur de catégories s'affiche à nouveau. L'utilisateur peut lancer un nouveau deck.

**Statut :** —

---

### APP-18 — Accès à un slug invalide

**Préconditions :** Aucun jeu n'a le slug "inexistant".

**Étapes :**
1. Saisir manuellement l'URL http://localhost:3000/game/inexistant

**Résultat attendu :** Un message "Jeu introuvable" s'affiche. L'application ne crashe pas, ne renvoie pas d'écran blanc ni d'erreur technique.

**Statut :** —

---

## 4. Admin — Authentification

### ADM-01 — Affichage de la page de login

**Préconditions :** Aucune session admin active.

**Étapes :**
1. Ouvrir http://localhost:3001/login

**Résultat attendu :** La page de connexion s'affiche avec un formulaire email/mot de passe.

**Statut :** —

---

### ADM-02 — Connexion avec des identifiants valides

**Préconditions :** Un compte admin existe dans Supabase.

**Étapes :**
1. Ouvrir http://localhost:3001/login
2. Saisir l'email et le mot de passe d'un compte admin valide
3. Cliquer sur "Se connecter"

**Résultat attendu :** L'utilisateur est redirigé vers http://localhost:3001/ (dashboard). Un token JWT est stocké dans la session.

**Statut :** —

---

### ADM-03 — Connexion avec des identifiants invalides

**Préconditions :** Aucune.

**Étapes :**
1. Ouvrir http://localhost:3001/login
2. Saisir un email valide et un mot de passe erroné
3. Cliquer sur "Se connecter"

**Résultat attendu :** Un message d'erreur s'affiche. L'utilisateur reste sur la page /login.

**Statut :** —

---

### ADM-04 — Auth guard : accès direct au dashboard sans session

**Préconditions :** Aucune session admin active (navigation privée ou session expirée).

**Étapes :**
1. Saisir directement http://localhost:3001/ dans le navigateur

**Résultat attendu :** L'utilisateur est automatiquement redirigé vers http://localhost:3001/login. La page du dashboard n'est pas accessible.

**Statut :** —

---

### ADM-05 — Déconnexion

**Préconditions :** Une session admin est active.

**Étapes :**
1. Cliquer sur le bouton de déconnexion dans l'interface admin
2. Tenter d'accéder à http://localhost:3001/

**Résultat attendu :** La session est détruite. L'accès à / redirige vers /login.

**Statut :** —

---

## 5. Admin — Dashboard

### ADM-06 — Affichage des compteurs

**Préconditions :** Session admin active. La base de données contient au moins 1 jeu, 1 catégorie, 1 carte.

**Étapes :**
1. Ouvrir http://localhost:3001/
2. Observer les compteurs affichés

**Résultat attendu :** Les compteurs affichent le nombre total de jeux, catégories et cartes en base. Les chiffres correspondent aux données réelles.

**Statut :** —

---

### ADM-07 — Mise à jour des compteurs après création

**Préconditions :** Session admin active. Les compteurs sont visibles.

**Étapes :**
1. Créer un nouveau jeu depuis la page Jeux
2. Revenir au dashboard

**Résultat attendu :** Le compteur "Jeux" est incrémenté de 1.

**Statut :** —

---

## 6. Admin — Gestion des jeux

### ADM-08 — Affichage du tableau paginé des jeux

**Préconditions :** Session admin active. Au moins 11 jeux existent en base.

**Étapes :**
1. Ouvrir la page Jeux dans l'admin
2. Observer le tableau

**Résultat attendu :** Le tableau affiche 10 jeux par page. Les boutons "Précédent" et "Suivant" sont présents. Le bouton "Précédent" est désactivé sur la première page.

**Statut :** —

---

### ADM-09 — Pagination : page suivante

**Préconditions :** Au moins 11 jeux existent. On est sur la page 1 (ADM-08).

**Étapes :**
1. Cliquer sur "Suivant"

**Résultat attendu :** La page 2 s'affiche avec les jeux suivants. Le bouton "Précédent" devient actif.

**Statut :** —

---

### ADM-10 — Création d'un jeu avec slug auto-généré

**Préconditions :** Session admin active.

**Étapes :**
1. Cliquer sur le bouton de création de jeu
2. Saisir un nom de jeu (ex : "Mon Super Jeu")
3. Observer le champ slug

**Résultat attendu :** Le slug est automatiquement généré depuis le nom (ex : `mon-super-jeu`), en minuscules et sans caractères spéciaux.

**Statut :** —

---

### ADM-11 — Création d'un jeu avec emoji picker

**Préconditions :** Session admin active, formulaire de création ouvert.

**Étapes :**
1. Cliquer sur le sélecteur d'emoji
2. Choisir un emoji dans le picker
3. Valider la création du jeu

**Résultat attendu :** L'emoji sélectionné est associé au jeu. Il s'affiche dans le tableau et sur l'app utilisateur.

**Statut :** —

---

### ADM-12 — Création d'un jeu en collant son propre emoji

**Préconditions :** Session admin active, formulaire de création ouvert.

**Étapes :**
1. Dans le champ emoji, coller manuellement un emoji (ex : 🃏)
2. Compléter les autres champs et valider

**Résultat attendu :** L'emoji collé est accepté et sauvegardé. Il s'affiche correctement.

**Statut :** —

---

### ADM-13 — Création d'un jeu avec couleurs personnalisées

**Préconditions :** Session admin active, formulaire de création ouvert.

**Étapes :**
1. Sélectionner ou saisir des couleurs (fond, texte, etc.) selon les champs proposés
2. Valider la création

**Résultat attendu :** Le jeu est créé avec les couleurs choisies. Elles sont visibles dans l'app utilisateur.

**Statut :** —

---

### ADM-14 — Modification d'un jeu existant

**Préconditions :** Au moins un jeu existe. Session admin active.

**Étapes :**
1. Cliquer sur le bouton "Modifier" d'un jeu
2. Changer le nom ou l'emoji
3. Valider les modifications

**Résultat attendu :** Les modifications sont sauvegardées. Le tableau se met à jour avec les nouvelles valeurs.

**Statut :** —

---

### ADM-15 — Suppression d'un jeu avec confirmation

**Préconditions :** Au moins un jeu existe. Session admin active.

**Étapes :**
1. Cliquer sur le bouton "Supprimer" d'un jeu
2. Observer la boîte de dialogue de confirmation
3. Confirmer la suppression

**Résultat attendu :** Une boîte de dialogue de confirmation s'affiche avant la suppression. Après confirmation, le jeu est supprimé et le tableau se met à jour.

**Statut :** —

---

### ADM-16 — Annulation de la suppression d'un jeu

**Préconditions :** Au moins un jeu existe. Session admin active.

**Étapes :**
1. Cliquer sur "Supprimer" d'un jeu
2. Dans la boîte de dialogue, cliquer sur "Annuler"

**Résultat attendu :** La boîte de dialogue se ferme. Le jeu est toujours présent dans le tableau.

**Statut :** —

---

### ADM-17 — Export CSV des jeux

**Préconditions :** Au moins un jeu existe. Session admin active.

**Étapes :**
1. Cliquer sur le bouton "Exporter CSV" depuis la page Jeux

**Résultat attendu :** Un fichier `games.csv` est téléchargé. Il contient les colonnes attendues (id, nom, slug, emoji, couleurs, etc.) et les données correspondent aux jeux en base.

**Statut :** —

---

### ADM-18 — Import CSV : affichage du formulaire

**Préconditions :** Session admin active.

**Étapes :**
1. Cliquer sur le bouton "Importer CSV" depuis la page Jeux

**Résultat attendu :** Un formulaire d'import s'affiche avec : zone de drag-and-drop, bouton "Parcourir", lien de téléchargement du modèle CSV.

**Statut :** —

---

### ADM-19 — Import CSV : téléchargement du modèle

**Préconditions :** Le formulaire d'import est ouvert (ADM-18).

**Étapes :**
1. Cliquer sur le lien "Télécharger le modèle"

**Résultat attendu :** Un fichier CSV modèle est téléchargé avec les colonnes vides et les en-têtes corrects.

**Statut :** —

---

### ADM-20 — Import CSV : preview du nombre de lignes

**Préconditions :** Le formulaire d'import est ouvert. Un fichier CSV valide est disponible.

**Étapes :**
1. Déposer ou sélectionner un fichier CSV de jeux via la zone d'import

**Résultat attendu :** Avant de valider l'import, le nombre de lignes détectées dans le fichier s'affiche à titre de prévisualisation.

**Statut :** —

---

### ADM-21 — Import CSV : création de nouveaux jeux (sans id)

**Préconditions :** Un CSV valide contenant des lignes sans colonne `id` est disponible.

**Étapes :**
1. Importer le CSV via le formulaire
2. Valider l'import

**Résultat attendu :** Les jeux sont créés en base. Le rapport d'import indique le nombre d'entrées créées.

**Statut :** —

---

### ADM-22 — Import CSV : mise à jour de jeux existants (avec id)

**Préconditions :** Un CSV contenant des lignes avec un `id` correspondant à des jeux existants est disponible.

**Étapes :**
1. Modifier quelques valeurs dans le CSV (ex : nom)
2. Importer le CSV

**Résultat attendu :** Les jeux existants sont mis à jour. Le rapport indique le nombre d'entrées mises à jour. Aucun doublon n'est créé.

**Statut :** —

---

### ADM-23 — Import CSV : rollback total sur erreur de validation

**Préconditions :** Un CSV contenant une ou plusieurs lignes avec des données invalides (ex : slug dupliqué, champ obligatoire manquant) est disponible.

**Étapes :**
1. Importer le CSV avec des données partiellement invalides

**Résultat attendu :** L'import est annulé en totalité (rollback). Aucune ligne n'est insérée ni modifiée. Un message d'erreur explicite est affiché avec les lignes problématiques.

**Statut :** —

---

## 7. Admin — Gestion des catégories

### ADM-24 — Affichage des catégories avec filtre par jeu

**Préconditions :** Session admin active. Plusieurs jeux et catégories existent.

**Étapes :**
1. Ouvrir la page Catégories
2. Sélectionner un jeu dans le filtre

**Résultat attendu :** Seules les catégories appartenant au jeu sélectionné s'affichent.

**Statut :** —

---

### ADM-25 — Création d'une catégorie

**Préconditions :** Session admin active. Au moins un jeu existe.

**Étapes :**
1. Cliquer sur le bouton de création de catégorie
2. Renseigner le nom et associer un jeu
3. Valider

**Résultat attendu :** La catégorie est créée et apparaît dans le tableau.

**Statut :** —

---

### ADM-26 — Modification d'une catégorie

**Préconditions :** Au moins une catégorie existe.

**Étapes :**
1. Cliquer sur "Modifier" d'une catégorie
2. Changer le nom
3. Valider

**Résultat attendu :** Les modifications sont sauvegardées et visibles dans le tableau.

**Statut :** —

---

### ADM-27 — Suppression d'une catégorie

**Préconditions :** Au moins une catégorie existe.

**Étapes :**
1. Cliquer sur "Supprimer" d'une catégorie
2. Confirmer dans la boîte de dialogue

**Résultat attendu :** La catégorie est supprimée après confirmation.

**Statut :** —

---

### ADM-28 — Export CSV des catégories avec filtre actif

**Préconditions :** Un filtre par jeu est actif sur la page Catégories.

**Étapes :**
1. Appliquer un filtre par jeu
2. Cliquer sur "Exporter CSV"

**Résultat attendu :** Le fichier CSV exporté contient uniquement les catégories correspondant au filtre actif, pas toutes les catégories.

**Statut :** —

---

### ADM-29 — Import CSV des catégories (création et mise à jour)

**Préconditions :** Un CSV valide de catégories est disponible, contenant des lignes avec et sans `id`.

**Étapes :**
1. Importer le CSV via le formulaire d'import des catégories

**Résultat attendu :** Les nouvelles catégories sont créées, les existantes sont mises à jour. Le rapport d'import est affiché.

**Statut :** —

---

### ADM-30 — Import CSV des catégories : rollback sur erreur

**Préconditions :** Un CSV invalide (ex : référence à un jeu inexistant) est disponible.

**Étapes :**
1. Importer le CSV invalide

**Résultat attendu :** Rollback total. Aucune modification en base. Message d'erreur affiché.

**Statut :** —

---

## 8. Admin — Gestion des cartes

### ADM-31 — Affichage paginé des cartes (20 par page)

**Préconditions :** Session admin active. Au moins 21 cartes existent.

**Étapes :**
1. Ouvrir la page Cartes

**Résultat attendu :** Le tableau affiche 20 cartes par page. Les boutons de pagination sont présents.

**Statut :** —

---

### ADM-32 — Filtre par jeu sur la page Cartes

**Préconditions :** Plusieurs jeux et cartes existent.

**Étapes :**
1. Sélectionner un jeu dans le filtre
2. Observer le tableau

**Résultat attendu :** Seules les cartes appartenant au jeu sélectionné s'affichent.

**Statut :** —

---

### ADM-33 — Filtre par catégorie sur la page Cartes

**Préconditions :** Un jeu est sélectionné dans le filtre (ADM-32). Plusieurs catégories existent pour ce jeu.

**Étapes :**
1. Sélectionner une catégorie dans le filtre catégorie
2. Observer le tableau

**Résultat attendu :** Seules les cartes de la catégorie sélectionnée s'affichent.

**Statut :** —

---

### ADM-34 — Filtre par recherche texte sur la page Cartes

**Préconditions :** Des cartes existent avec du contenu textuel varié.

**Étapes :**
1. Saisir un mot-clé dans le champ de recherche texte

**Résultat attendu :** Seules les cartes dont le contenu correspond au mot-clé s'affichent.

**Statut :** —

---

### ADM-35 — Reset de la pagination au changement de filtre

**Préconditions :** On est sur la page 2 ou suivante de la liste des cartes.

**Étapes :**
1. Changer la valeur d'un filtre (jeu, catégorie ou recherche)

**Résultat attendu :** La pagination revient automatiquement à la page 1.

**Statut :** —

---

### ADM-36 — Export CSV des cartes avec filtres actifs

**Préconditions :** Des filtres sont actifs (jeu + catégorie + recherche texte).

**Étapes :**
1. Appliquer plusieurs filtres simultanément
2. Cliquer sur "Exporter CSV"

**Résultat attendu :** Le fichier CSV exporté contient uniquement les cartes correspondant à la combinaison de tous les filtres actifs.

**Statut :** —

---

### ADM-37 — Import CSV des cartes

**Préconditions :** Un CSV valide de cartes est disponible.

**Étapes :**
1. Cliquer sur "Importer CSV"
2. Déposer ou sélectionner le fichier
3. Valider l'import

**Résultat attendu :** Les cartes sont importées. Le rapport indique le nombre de lignes créées/mises à jour.

**Statut :** —

---

### ADM-38 — Import en masse via bulk text

**Préconditions :** Session admin active.

**Étapes :**
1. Ouvrir le formulaire d'import en masse (bulk text)
2. Coller plusieurs cartes sous forme textuelle dans la zone dédiée
3. Valider l'import

**Résultat attendu :** Les cartes saisies en masse sont créées en base. Le nombre de cartes importées est confirmé.

**Statut :** —

---

### ADM-39 — Import CSV des cartes : rollback sur erreur

**Préconditions :** Un CSV invalide est disponible (ex : référence à une catégorie inexistante).

**Étapes :**
1. Importer le CSV invalide

**Résultat attendu :** Rollback total. Aucune carte insérée. Message d'erreur explicite.

**Statut :** —

---

## 9. API — Routes publiques

### API-01 — GET /api/games : liste des jeux actifs

**Préconditions :** L'API est démarrée. Au moins un jeu actif et un jeu inactif existent.

**Étapes :**
1. Envoyer une requête `GET http://localhost:3002/api/games`

**Résultat attendu :** Réponse 200 avec un tableau JSON contenant uniquement les jeux dont le statut est actif. Les jeux inactifs ne figurent pas dans la réponse.

**Statut :** —

---

### API-02 — GET /api/cards/export : export complet

**Préconditions :** L'API est démarrée. Des jeux, catégories et cartes actives existent.

**Étapes :**
1. Envoyer une requête `GET http://localhost:3002/api/cards/export`

**Résultat attendu :** Réponse 200 avec un objet JSON structuré contenant les jeux, leurs catégories et les cartes actives associées. Les cartes inactives sont exclues.

**Statut :** —

---

### API-03 — GET /api/cards/export : cohérence des données avec l'app utilisateur

**Préconditions :** L'API est démarrée. L'app utilisateur est démarrée.

**Étapes :**
1. Appeler `GET /api/cards/export`
2. Comparer la structure retournée avec ce qu'affiche l'app utilisateur

**Résultat attendu :** Les jeux et catégories affichés dans l'app correspondent exactement aux données de l'API.

**Statut :** —

---

## 10. API — Routes admin protégées

### API-04 — Accès à une route admin sans token : 401

**Préconditions :** L'API est démarrée.

**Étapes :**
1. Envoyer une requête GET ou POST sur une route admin (ex : `GET http://localhost:3002/api/admin/games`) sans header `Authorization`

**Résultat attendu :** La réponse est `401 Unauthorized`. Aucune donnée n'est retournée.

**Statut :** —

---

### API-05 — Accès à une route admin avec un token invalide : 401

**Préconditions :** L'API est démarrée.

**Étapes :**
1. Envoyer une requête sur une route admin avec le header `Authorization: Bearer token_invalide`

**Résultat attendu :** La réponse est `401 Unauthorized`.

**Statut :** —

---

### API-06 — Accès à une route admin avec un token valide : 200

**Préconditions :** Un token JWT valide est disponible (obtenu via le login admin).

**Étapes :**
1. Envoyer une requête `GET http://localhost:3002/api/admin/games` avec le header `Authorization: Bearer <token_valide>`

**Résultat attendu :** La réponse est `200 OK` avec les données attendues.

**Statut :** —

---

### API-07 — Export CSV via l'API : format correct

**Préconditions :** Token valide disponible.

**Étapes :**
1. Appeler l'endpoint d'export CSV admin (jeux, catégories ou cartes) avec le token valide

**Résultat attendu :** La réponse contient le header `Content-Type: text/csv` et le corps est un CSV bien formé avec les en-têtes de colonnes appropriées.

**Statut :** —

---

### API-08 — Import CSV via l'API : transaction rollback sur erreur

**Préconditions :** Token valide. Un CSV contenant des données invalides est disponible.

**Étapes :**
1. Envoyer le CSV invalide à l'endpoint d'import admin
2. Vérifier l'état de la base de données après la requête

**Résultat attendu :** La réponse indique une erreur. La base de données est dans le même état qu'avant l'import (aucune ligne partiellement insérée).

**Statut :** —

---

### API-09 — Filtre combiné gameId + categoryId sur /api/admin/cards

**Préconditions :** Token valide. Des cartes existent pour plusieurs jeux et catégories.

**Étapes :**
1. Appeler `GET /api/admin/cards?gameId=<id>&categoryId=<id>` avec des valeurs valides

**Résultat attendu :** Seules les cartes correspondant aux deux filtres simultanément sont retournées. Les cartes d'autres jeux ou catégories sont exclues.

**Statut :** —

---

### API-10 — Filtre gameId seul sur /api/admin/cards

**Préconditions :** Token valide.

**Étapes :**
1. Appeler `GET /api/admin/cards?gameId=<id>` sans paramètre categoryId

**Résultat attendu :** Toutes les cartes du jeu spécifié sont retournées, toutes catégories confondues.

**Statut :** —

---

## 11. Tests transversaux

### TRANS-01 — Cohérence des données après import CSV (admin → app utilisateur)

**Préconditions :** Un CSV de cartes a été importé avec succès dans l'admin.

**Étapes :**
1. Importer un CSV de nouvelles cartes via l'admin
2. Ouvrir l'app utilisateur
3. Naviguer jusqu'aux cartes importées

**Résultat attendu :** Les nouvelles cartes sont visibles dans l'app utilisateur (en tenant compte de l'éventuel cache).

**Statut :** —

---

### TRANS-02 — Invalidation du cache après mise à jour des données

**Préconditions :** L'app utilisateur a du contenu en cache. Un jeu a été modifié dans l'admin.

**Étapes :**
1. Modifier un jeu dans l'admin (ex : changer son nom)
2. Recharger l'app utilisateur (ou attendre l'expiration du cache selon la stratégie implémentée)

**Résultat attendu :** L'app utilisateur affiche le nom mis à jour. Le cache ne présente pas de données obsolètes indéfiniment.

**Statut :** —

---

### TRANS-03 — Comportement sur mobile (responsive)

**Préconditions :** Un appareil mobile ou l'émulateur mobile des DevTools est disponible.

**Étapes :**
1. Ouvrir l'app utilisateur sur mobile (ou en mode responsive 375px)
2. Naviguer dans un jeu et tester le swipe sur une carte

**Résultat attendu :** L'interface est lisible et utilisable sur mobile. Le swipe fonctionne avec les interactions tactiles.

**Statut :** —

---

### TRANS-04 — Accès à l'admin depuis un appareil non autorisé

**Préconditions :** Aucune session admin active.

**Étapes :**
1. Tenter d'accéder directement à différentes pages admin : `/`, `/games`, `/categories`, `/cards`

**Résultat attendu :** Toutes ces pages redirigent vers `/login`. Aucune donnée admin n'est exposée sans authentification.

**Statut :** —

---

### TRANS-05 — Stabilité générale : pas d'erreur console critique

**Préconditions :** L'ensemble de la stack est démarrée.

**Étapes :**
1. Ouvrir l'app utilisateur et l'admin
2. Naviguer dans les principales fonctionnalités
3. Observer la console des outils développeur

**Résultat attendu :** Aucune erreur JavaScript non gérée (`Uncaught Error`, `TypeError`, etc.) dans la console lors d'une utilisation normale.

**Statut :** —

---

## Récapitulatif

| ID | Module | Titre | Statut |
|---|---|---|---|
| APP-01 | App utilisateur | Affichage de la liste des jeux actifs | — |
| APP-02 | App utilisateur | Mise en cache dans le localStorage | — |
| APP-03 | App utilisateur | Mode offline avec cache | — |
| APP-04 | App utilisateur | Mode offline sans cache | — |
| APP-05 | App utilisateur | Retour en ligne | — |
| APP-06 | App utilisateur | Activation du dark mode | — |
| APP-07 | App utilisateur | Persistance du dark mode | — |
| APP-08 | App utilisateur | Absence de flash au rechargement | — |
| APP-09 | App utilisateur | Désactivation du dark mode | — |
| APP-10 | App utilisateur | Navigation vers une page de jeu | — |
| APP-11 | App utilisateur | Sélection de catégorie et lancement du deck | — |
| APP-12 | App utilisateur | Swipe gauche (carte suivante) | — |
| APP-13 | App utilisateur | Swipe droite (carte précédente) | — |
| APP-14 | App utilisateur | Bouton chevron suivant | — |
| APP-15 | App utilisateur | Bouton chevron précédent | — |
| APP-16 | App utilisateur | Écran de fin de deck | — |
| APP-17 | App utilisateur | Retour au sélecteur depuis la fin de deck | — |
| APP-18 | App utilisateur | Slug invalide → "Jeu introuvable" | — |
| ADM-01 | Admin | Affichage de la page de login | — |
| ADM-02 | Admin | Connexion valide | — |
| ADM-03 | Admin | Connexion invalide | — |
| ADM-04 | Admin | Auth guard sans session | — |
| ADM-05 | Admin | Déconnexion | — |
| ADM-06 | Admin | Affichage des compteurs dashboard | — |
| ADM-07 | Admin | Mise à jour des compteurs après création | — |
| ADM-08 | Admin | Tableau paginé des jeux | — |
| ADM-09 | Admin | Pagination page suivante | — |
| ADM-10 | Admin | Création jeu avec slug auto-généré | — |
| ADM-11 | Admin | Création jeu avec emoji picker | — |
| ADM-12 | Admin | Création jeu avec emoji collé | — |
| ADM-13 | Admin | Création jeu avec couleurs | — |
| ADM-14 | Admin | Modification d'un jeu | — |
| ADM-15 | Admin | Suppression avec confirmation | — |
| ADM-16 | Admin | Annulation de suppression | — |
| ADM-17 | Admin | Export CSV des jeux | — |
| ADM-18 | Admin | Import CSV : affichage formulaire | — |
| ADM-19 | Admin | Import CSV : téléchargement modèle | — |
| ADM-20 | Admin | Import CSV : preview lignes | — |
| ADM-21 | Admin | Import CSV : création (sans id) | — |
| ADM-22 | Admin | Import CSV : mise à jour (avec id) | — |
| ADM-23 | Admin | Import CSV : rollback sur erreur | — |
| ADM-24 | Admin | Catégories : filtre par jeu | — |
| ADM-25 | Admin | Création d'une catégorie | — |
| ADM-26 | Admin | Modification d'une catégorie | — |
| ADM-27 | Admin | Suppression d'une catégorie | — |
| ADM-28 | Admin | Export CSV catégories avec filtre | — |
| ADM-29 | Admin | Import CSV catégories | — |
| ADM-30 | Admin | Import CSV catégories rollback | — |
| ADM-31 | Admin | Cartes : pagination 20/page | — |
| ADM-32 | Admin | Cartes : filtre par jeu | — |
| ADM-33 | Admin | Cartes : filtre par catégorie | — |
| ADM-34 | Admin | Cartes : filtre par texte | — |
| ADM-35 | Admin | Cartes : reset pagination sur filtre | — |
| ADM-36 | Admin | Cartes : export CSV avec filtres | — |
| ADM-37 | Admin | Cartes : import CSV | — |
| ADM-38 | Admin | Cartes : bulk text import | — |
| ADM-39 | Admin | Cartes : import CSV rollback | — |
| API-01 | API | GET /api/games | — |
| API-02 | API | GET /api/cards/export | — |
| API-03 | API | Cohérence export / app utilisateur | — |
| API-04 | API | Route admin sans token → 401 | — |
| API-05 | API | Route admin token invalide → 401 | — |
| API-06 | API | Route admin token valide → 200 | — |
| API-07 | API | Export CSV format correct | — |
| API-08 | API | Import CSV rollback transaction | — |
| API-09 | API | Filtre gameId + categoryId combinés | — |
| API-10 | API | Filtre gameId seul | — |
| TRANS-01 | Transversal | Cohérence import CSV → app utilisateur | — |
| TRANS-02 | Transversal | Invalidation du cache | — |
| TRANS-03 | Transversal | Responsive mobile + swipe tactile | — |
| TRANS-04 | Transversal | Protection de toutes les pages admin | — |
| TRANS-05 | Transversal | Absence d'erreurs console critiques | — |

---

*Total : 70 cas de test — À compléter avec les statuts ✅ / ❌ / ⚠️ lors des sessions de recette.*
