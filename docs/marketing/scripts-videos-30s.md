# Playlink — Scripts vidéo 30 s (format vertical)

11 scénarios : 2 pour l'app (soirée, couple), 1 panorama des 8 jeux, 8 jeux en solo.
Sources : `playlink-mobile/docs/playlink-brand-context.md` (ton, pitchs, couleurs), la v6 déjà générée (structure et punchlines), les captures de l'app.

---

## Décisions validées
- **Production** : en **motion design pur** (avatars emoji et écrans de l'app, comme la v6), réalisée de ton côté. Ce document ne contient que les **scénarios** : minutage, image, texte à l'écran, voix off.
- **Voix** : générée ou enregistrée de ton côté en suivant les lignes et les indications de ton de chaque tableau.
- **Appel à l'action** : « **Disponible sur iOS et Android** ».
- **Plateformes** : TikTok, Reels, Shorts (organique, pas de pub payante).
- **Angle** : la **forte intensité** (4 à 5) fait cliquer. Deux jeux à pousser pour le couple (2 joueurs sur 1 téléphone) : **Icebreaker, Dégât Débat, Qui de nous**.

---

## 0. Règles communes

### Format
- **1080 × 1920 (9:16)**, 30 fps, **30,0 s pile** (la v6 fait 41 s : trop long pour Reels/TikTok/Shorts).
- **Zone sûre** : rien d'important dans les 250 px du haut ni les 400 px du bas (interfaces des plateformes).
- **Fond** `#0B0A0F`, la couleur du jeu en glow derrière (comme l'app). Titres en Fraunces, labels en JetBrains Mono.
- **Sous-titres incrustés** sur toute la voix : 80 % des vues se font sans le son.
- **Hook dans la 1ʳᵉ seconde** : un texte + un son, jamais un logo.
- ✦ = plan de réaction : en motion design, il est rendu par des **avatars emoji** (comme dans la v6) qui rient, rougissent ou se figent.

### Voix : pourquoi elle manque de punch
Je n'ai pas pu écouter ta v6 (je ne peux pas transcrire l'audio ici). Les niveaux sont corrects (moyenne −17 dB, pic −1,4 dB) : ce n'est donc pas un problème de volume, mais de **diction et de rythme**. Ce qui rend une voix off punchy :
1. **Phrases de 3 à 6 mots**, une idée par phrase. Les scripts ci-dessous font 40 à 55 mots pour 30 s : on laisse du silence pour les coupes et les effets sonores.
2. **Un point = un silence net** (0,2 à 0,3 s). Ne jamais lisser le texte en un seul souffle.
3. **Courbe d'énergie** : le hook à 80 % d'énergie, le milieu qui monte, la punchline finale **posée et lente**, pas criée.
4. **Mots-cibles** en **gras** dans les scripts : c'est là qu'on appuie.
5. **Réglages TTS** (ElevenLabs ou équivalent) : stabilité basse, style/exagération haut, vitesse 1,05 à 1,10. Générer **3 prises par ligne** et monter la meilleure. Choisir une voix masculine ou féminine « jeune, un peu moqueuse », pas une voix « pub corporate ».
6. **Mixage** : musique à −20 dB sous la voix (ducking), compression légère sur la voix, **−14 LUFS** au final, un effet sonore sur chaque punchline (whoosh, impact, pop).
7. Si possible, **enregistrer la voix à la main** (même au téléphone) : c'est 10× plus vivant. Les scripts sont écrits pour être dits, pas lus.

### Signature de fin (toutes les vidéos)
Logo en éventail de 4 cartes + « **Playlink** » + « **Disponible sur iOS et Android** » + ligne du bas : « 8 jeux · hors-ligne · gratuit ». Le « gratuit » est valable pour la V1 uniquement (voir le brand context : ne rien promettre sur le freemium).

### Spécial TikTok / Reels / Shorts : la forte intensité comme moteur
1. **Hook = une carte d'intensité 5 floutée** (« Qui de nous… ████████ ? », 5 points allumés, bip de censure). La curiosité retient mieux que n'importe quel logo.
2. **Révélation à la fin** : la carte du début se dévoile aux ~25 s, avec la réaction. C'est ce qui pousse à regarder jusqu'au bout.
3. **Boucle** : la dernière image reprend la première (carte floutée), pour que la vidéo reboucle sans coupure.
4. **Intensité ≠ explicite.** Les cartes d'intensité 5 gênent, font débattre, font avouer : elles n'ont pas besoin d'être sexuelles. Montrer des cartes *Secrets*, *Deep Talk*, *Éthique et Morale*, *Spicy* **édulcorées** ; garder les barres de censure pour le reste. TikTok et Instagram modèrent le contenu suggestif, même en organique, et un retrait coûte plus qu'un hook un peu plus sage.
5. **Question en commentaire épinglé** (« Ta réponse ? ») pour déclencher l'engagement.

### Cartes à utiliser (à prendre dans le back-office)
Les scripts utilisent des cartes d'exemple du code. Pour la version finale, remplacer par de **vraies cartes d'intensité 4-5** (idéalement 2 par jeu), à exporter du back-office en CSV filtré sur l'intensité :

| Script | Carte(s) à fournir |
|---|---|
| Soirée, Couple | 1 carte *Qui de nous* intensité 5 (hook flouté + révélation) |
| Couple | 1 carte *Icebreaker* (Cœur à Cœur, 3), 1 carte *Dégât Débat* (Perso et Relations, 4-5) |
| Action ou Vérité | 1 *Vérité Spicy* + 1 *Action Spicy* (5) |
| Icebreaker | 1 *Deep Talk* (5) |
| Dégât Débat | 1 *Éthique et Morale* (5) |
| Qui de nous | 1 *Secrets et Confessions* (5) |
| Mime | 1 mot d'intensité 5 |
| Thé ou café | 1 mot *Difficile* (5) |
| Dilemme | 1 *Identité et Valeurs* (5) |
| Devine le mot | 1 mot *Abstrait* (5) |

### Écrans de l'app à montrer (déroulé réel)
1. **« C'est à ton tour ! »** + prénom + bouton *Voir la carte*
2. **La carte** (couleur du jeu, catégorie, 5 points d'intensité)
3. **Le vote** : « Est-ce que {joueur} mérite un point ? » **Oui / Non** (libellé de l'app mobile, voir §« À vérifier »)
4. **Le podium** de fin de partie 🥇🥈🥉

---

## 1. L'app, mode soirée entre amis

**Durée** 30 s · **Ton** complice, qui monte en énergie · **Musique** beat house/pop, démarre à 3 s.

| t | Image | Texte écran | Voix off |
|---|---|---|---|
| 0–3 s | **Hook** : carte *Qui de nous* sombre, texte flouté « Qui de nous… ████████ ? », 5 points allumés, **bip** de censure. | `INTENSITÉ 5` | *(sèche)* « **Intensité cinq.** » |
| 3–6 s | Zoom arrière : un salon, 5 avatars autour d'un seul téléphone posé au centre, silence. | `5 POTES · 1 TÉLÉPHONE` | « Cinq potes. **Un seul** téléphone. » |
| 6–12 s | Écran d'accueil Playlink. Les 8 cartes de jeux défilent, chacune avec son glow. SFX *swish* à chaque carte. | `8 JEUX` | *(l'énergie monte)* « **Huit jeux.** Choisis ton poison. » |
| 12–18 s | « C'est à ton tour ! » → *Voir la carte* → carte. Avatars : l'un éclate de rire, l'autre se cache le visage. | — | *(rythmé, 3 coups)* « Tu **tires.** Tu **lis.** Tu **assumes.** » |
| 18–23 s | Vote : « Est-ce que Léa mérite un point ? ». Les pouces montent en même temps. +1 qui pop. | `LA TABLE VOTE` | « La table vote. **Pas d'appel.** » |
| 23–27 s | Curseur d'intensité qui glisse de 1 à 5 ; le flou de la carte du début **se dissipe** et la carte (à remplacer par une vraie carte) apparaît. Les avatars réagissent. | `INTENSITÉ 5` | *(complice, plus bas)* « Toi, tu choisis jusqu'où. **Voilà la carte.** » |
| 27–30 s | Logo + signature + « Disponible sur iOS et Android ». | `Playlink` | *(posée, lente)* « Playlink. Ta soirée **commence maintenant.** » |

---

## 2. L'app, mode date / couple (2 joueurs, 1 téléphone)

**Durée** 30 s · **Ton** intime, charmeur, intensité qui monte · **Musique** lo-fi chaude / R&B doux.
**Jeux mis en avant** : Icebreaker → Dégât Débat → Qui de nous (du doux au piquant). Les autres jeux se jouent mal à deux.
**À tester** : « Qui de nous deux… » à 2 joueurs (les deux doigts pointent), pour être sûr que le jeu se comporte comme montré.

| t | Image | Texte écran | Voix off |
|---|---|---|---|
| 0–3 s | **Hook** : carte *Qui de nous* floutée, « Qui de nous deux… ████████ ? », 5 points allumés, bip. Deux avatars se lisent la carte et se regardent. | `INTENSITÉ 5 · À DEUX` | *(voix basse)* « Intensité **cinq.** À deux. » |
| 3–7 s | Canapé stylisé, deux avatars, un téléphone entre eux, côté écran. | `2 JOUEURS · 1 TÉLÉPHONE` | « Pas besoin d'être dix. **Deux suffisent.** » |
| 7–12 s | **Icebreaker** : carte *Cœur à Cœur* (à fournir, intensité 3). Ils répondent chacun leur tour, sourires. | `ICEBREAKER · ON COMMENCE DOUX` | « On commence **doux.** Une question. Une vraie. » |
| 12–17 s | **Dégât Débat** : carte *Perso et Relations* (à fournir, 4-5). Écran en deux, POUR / CONTRE, les deux avatars se chambrent. | `DÉGÂT DÉBAT · ON SE CHAMBRE` | « Puis on **s'embrouille.** Pour de faux. Enfin… presque. » |
| 17–23 s | **Qui de nous** : deux doigts qui pointent, chacun vers l'autre, puis vers soi (rire). Compte à rebours 3-2-1. | `QUI DE NOUS DEUX…` | « Qui de nous deux… ? Les doigts **partent tout seuls.** » |
| 23–27 s | **Révélation** : le flou de la carte du début se dissipe, carte *Qui de nous* intensité 5 (à remplacer par une vraie carte). Un avatar rougit, l'autre éclate de rire. | `INTENSITÉ 5` | « Et cette carte ? **La voilà. Bon courage.** » |
| 27–30 s | Logo + signature + « Disponible sur iOS et Android ». | `Playlink` | *(posée, complice)* « Playlink. Le date où on se parle **vraiment.** » |

---

## 3. Panorama des 8 jeux

**Durée** 30 s · **Ton** montage-éclair, une punchline par jeu · **Musique** rythmée, un **impact sonore** sur chaque nom de jeu.
Chaque jeu : flash de sa couleur plein cadre (0,2 s) → carte du jeu → nom en gros → punchline. **2,5 s par jeu.**

| t | Jeu | Texte écran | Voix off (≤ 6 mots) |
|---|---|---|---|
| 0–3,5 s | Hook : le téléphone au centre, 8 cartes en éventail qui s'ouvrent. | `8 JEUX · 1 TÉLÉPHONE` | « **Huit jeux.** Un téléphone. **Zéro** préparation. » |
| 3,5–6 s | 🃏 Action ou Vérité `#DC2626` | `Action ou Vérité` | « Avouer… ou **assumer.** » |
| 6–8,5 s | 🧊 Icebreaker `#23B5F7` | `Icebreaker` | « Zappe la **météo.** » |
| 8,5–11 s | 🔥 Dégât Débat `#F97316` | `Dégât Débat` | « La table se coupe **en deux.** » |
| 11–13,5 s | 👀 Qui de nous `#10B981` | `Qui de nous` | « Tes potes **te désignent.** » |
| 13,5–16 s | 🎭 Mime `#F59E0B` | `Mime` | « Pas un mot. **Pas d'excuse.** » |
| 16–18,5 s | 💬 Thé ou café `#7C3AED` | `Thé ou café` | « Deux mots. **Beaucoup** de frustration. » |
| 18,5–21 s | ⚖️ Dilemme `#696A6B` | `Dilemme` | « Deux options. **Aucune** bonne. » |
| 21–23,5 s | 🕵️ Devine le mot `#BE185D` | `Devine le mot` | « Trois indices. **Pas un de plus.** » |
| 23,5–27 s | Les 8 cartes se rejoignent en éventail (le logo), le curseur d'intensité monte à 5 sur chacune. | `28 CATÉGORIES · INTENSITÉ 1 → 5` | « Vingt-huit catégories. **Jusqu'où tu vas ?** » |
| 27–30 s | Logo + signature + « Disponible sur iOS et Android ». | `Playlink` | « Playlink. **Choisis ton jeu.** » |

Note : le visuel de Dilemme est gris (c'est voulu : « pas de bonne réponse »). Dans le panorama, lui donner un **liseré blanc** pour qu'il ressorte entre deux couleurs vives.

---

**Règle pour les 8 scénarios suivants** : chacun **ouvre sur une carte d'intensité 5 floutée** (hook) et la **dévoile avant le logo**, comme dans les scénarios 1 et 2. Les cartes d'exemple ci-dessous sont provisoires, à remplacer par celles du tableau « Cartes à fournir ».

---

## 4. 🃏 Action ou Vérité

**Couleur** rouge `#DC2626 → #761414` · **Ton** défi, moqueur · **Musique** basse tendue qui monte.
**Idée** : « Avouer ou assumer ». Chaque plan est un choix.

| t | Image | Texte écran | Voix off |
|---|---|---|---|
| 0–3 s | Carte rouge qui se retourne, deux mots s'affichent côte à côte. | `AVOUER ou ASSUMER ?` | *(grave, lente)* « **Avouer…** ou **assumer.** » |
| 3–8 s | Les 6 catégories défilent : Vérités légères / Flirt / Spicy, Actions Rigolote / Flirt / Spicy. | `6 CATÉGORIES` | « Six catégories. Du **fou rire**… au **silence gênant.** » |
| 8–14 s | « C'est à ton tour ! Léa » → carte *Vérité*. ✦ Léa se fige. Exemple de carte : « Quel est le mensonge le plus blanc que tu aies dit cette semaine ? » | `VÉRITÉ` | « Léa tire une vérité. Léa **transpire.** » |
| 14–20 s | Carte *Action* : « Appelle quelqu'un au hasard dans tes contacts et chante-lui Joyeux Anniversaire. » ✦ Tom regarde le groupe, atterré. | `ACTION` | « Tom, lui, a une action. Un contact. **Au hasard.** Il chante. » |
| 20–25 s | Vote : « Est-ce que Tom mérite un point ? » Pouces qui montent. | `OUI / NON` | « La table vote. **Un point… ou rien.** » |
| 25–30 s | Carte rouge + logo. | « Le jeu qui a brisé plus d'amitiés que les groupes WhatsApp. » | *(posée)* « Le jeu qui a brisé plus d'amitiés **que les groupes WhatsApp.** » |

---

## 5. 🧊 Icebreaker

**Couleur** bleu `#23B5F7 → #156A91` · **Ton** blasé puis soulagé · **Musique** douce qui se réchauffe.
**Idée** : l'ennui des banalités, puis le glaçon qui éclate.

| t | Image | Texte écran | Voix off |
|---|---|---|---|
| 0–3 s | ✦ Un groupe qui ne se connaît pas, silence poli. Bulle : « T'as fait quoi ce week-end ? » | `~~T'as fait quoi ce week-end ?~~` | *(blasée)* « Tu as fait quoi ce **week-end ?** » |
| 3–6 s | SFX verre qui craque. Le glaçon 🧊 se fissure et éclate en éclats bleus. | — | *(sèche)* « Non. **Stop.** » |
| 6–12 s | Carte réelle de l'app : « Qu'est-ce qui te rend le plus mal à l'aise en soirée ? » (catégorie *Pour se découvrir*, intensité 4/5). | `UNE CARTE. UNE VRAIE QUESTION.` | « Une carte. Une **vraie** question. » |
| 12–18 s | ✦ Une personne répond, les autres l'écoutent vraiment. Les 3 catégories défilent : *Pour se découvrir → Cœur à Cœur → Deep Talk*. | `LÉGER → DEEP TALK` | « Ça commence léger. Et ça descend **vite.** » |
| 18–24 s | Horloge : 21 h → 2 h du matin, la couleur passe du bleu clair au bleu profond. | `21H → 2H DU MAT'` | « Idéal en début de soirée. **Redoutable** à deux heures du matin. » |
| 24–30 s | Logo + glaçon intact qui se refissure. | `Icebreaker` | *(posée)* « Icebreaker. **Sans météo.** » |

---

## 6. 🔥 Dégât Débat

**Couleur** orange `#F97316 → #93440D` · **Ton** vif, provocateur · **Musique** percussive, tension.
**Idée** : l'écran se coupe en deux, comme la table.

| t | Image | Texte écran | Voix off |
|---|---|---|---|
| 0–3 s | Carte orange : « Les réseaux sociaux font-ils plus de bien que de mal à notre société ? » | — | *(cash)* « Les réseaux sociaux : **bien… ou mal ?** » |
| 3–8 s | L'écran se coupe en deux, **POUR** à gauche, **CONTRE** à droite. Les avatars se placent d'un côté ou de l'autre. | `LA TABLE SE COUPE EN DEUX.` | « Et la table **se coupe en deux.** » |
| 8–15 s | ✦ Débat accéléré, coupes très rapides. Sous-titres d'arguments qui fusent : « C'est de la pollution mentale ! » / « Mais t'es sur TikTok, là ! » | — | « Chacun défend son camp. **À voix haute.** Sans filet. » |
| 15–21 s | Vote : « Est-ce que Sam mérite un point ? » Les mains se lèvent. | `LA TABLE TRANCHE` | « Et à la fin… la table **tranche.** » |
| 21–26 s | Les 3 catégories : *Société*, *Perso et Relations*, *Éthique et Morale*. | `SOCIÉTÉ · RELATIONS · MORALE` | « Société. Relations. Morale. **Tout ce qu'on évite au repas de famille.** » |
| 26–30 s | Logo + carte orange. | `Dégât Débat` | *(posée)* « Dégât Débat. **Prépare tes arguments.** » |

---

## 7. 👀 Qui de nous

**Couleur** vert `#10B981 → #07533A` · **Ton** menaçant, taquin · **Musique** pulsation sourde, suspense.
**Idée** : tous les doigts pointent vers toi.

| t | Image | Texte écran | Voix off |
|---|---|---|---|
| 0–3 s | Carte verte, deux yeux 👀 qui clignent. Texte qui s'écrit lettre par lettre. | `Qui de nous…` | *(chuchotée, menaçante)* « **Qui de nous…** » |
| 3–9 s | ✦ Cercle d'amis, regards qui se croisent. Compte à rebours 3-2-1, puis **tous les doigts** pointent le même. Il fait « QUOI ?! ». | `3… 2… 1…` | « Trois. Deux. Un. **Tout le monde te pointe du doigt.** » |
| 9–15 s | Un cadenas qui saute : fini l'anonymat. | `PAS DE VOTE ANONYME.` | « Ici, **pas de vote anonyme.** Tout le monde assume. » |
| 15–21 s | Les 4 catégories en clap : *Personnalité*, *Désir et Attirance*, *Taquineries*, *Secrets et Confessions*. | — | « Personnalité. Désir. Taquineries. **Secrets.** » |
| 21–26 s | ✦ Réaction de la cible : rire gêné, main sur le visage. | `TES POTES PENSENT VRAIMENT…` | « Tu vas enfin savoir ce que tes potes pensent **vraiment** de toi. » |
| 26–30 s | Logo. Le mot « Bon courage. » s'écrit en dernier. | `Bon courage.` | *(posée, un sourire)* « **Bon courage.** » |

---

## 8. 🎭 Mime

**Couleur** ambre → bleu `#F59E0B → #216FB7` · **Ton** comique, rythmé · **Musique** fun, tic-tac discret.
**Idée** : l'humiliation joyeuse, filmée.

| t | Image | Texte écran | Voix off |
|---|---|---|---|
| 0–3 s | ✦ Gros plan sur un joueur qui lit sa carte : « Astronaute » (catégorie *Métiers*). Bouche fermée 🤐. | `PAS UN MOT. PAS UN SON.` | *(énergique)* « **Pas un mot.** Pas un son. » |
| 3–10 s | ✦ Il mime l'astronaute au ralenti. Sous-titres des autres : « Un robot ? » / « Un plongeur ? » / « Un canard ?? » | — | « Un joueur mime. Le groupe devine. Et personne **ne comprend.** » |
| 10–16 s | Chrono 60 s qui défile, anneau qui se vide, SFX tic-tac qui accélère. | `60 SECONDES` | « Le chrono **s'en fout** de ta dignité. » |
| 16–22 s | Les 3 catégories : *Objets du quotidien*, *Actions*, *Métiers*. Cartes qui défilent. | `OBJETS · ACTIONS · MÉTIERS` | « Objets. Actions. Métiers. Des dizaines de mots… **à faire passer avec ton corps.** » |
| 22–27 s | ✦ En fond, un ami lève son téléphone et filme le mime. | `QUELQU'UN FILME.` | « Et **quelqu'un est en train de te filmer.** » |
| 27–30 s | Logo. | `Mime` | *(posée)* « Mime. **Zéro dignité.** » |

---

## 9. 💬 Thé ou café

**Couleur** violet → rose `#7C3AED → #EC4899` · **Ton** comptine qui dérape · **Musique** ludique, pizzicati.
**Idée** : l'entonnoir de mots, qui devient une scène de panique.

| t | Image | Texte écran | Voix off |
|---|---|---|---|
| 0–3 s | Écran violet, deux bulles : « Thé » et « Café ». | `Thé ou café ?` | *(rythme de comptine)* « **Thé…** ou **café ?** » |
| 3–9 s | La chaîne s'écrit : *Thé ou café ? → Café* · *Café ou voiture ? → Voiture* · *Voiture ou vélo ? → Vélo*. Chaque réponse en surbrillance. | — | « Café. Voiture ou vélo ? Vélo. Vélo ou… **trottinette ?** » |
| 9–15 s | ✦ Un joueur, visage de poker, tient le mot. Les autres s'arrachent les cheveux. Mot masqué : « •••••• ». | `1 JOUEUR SAIT. LES AUTRES CHERCHENT.` | « Un joueur connaît le mot. Les autres n'ont que **deux propositions** à la fois. » |
| 15–21 s | « C'est une trottinette ?! » ✓, explosion de confettis, cris. | `TROUVÉ !` | *(explosion)* « **TROTTINETTE !** » *(coupée net, silence 0,3 s)* « … Trouvé. » |
| 21–26 s | 3 pastilles : 🟢 Facile · 🟡 Moyen · 🔴 Difficile. | `FACILE · MOYEN · DIFFICILE` | « Facile. Moyen. Difficile. Tu te crois fort ? **Essaie.** » |
| 26–30 s | Logo. | « Deux propositions. Beaucoup de frustration. » | *(posée)* « Thé ou café. **Beaucoup de frustration.** » |

---

## 10. ⚖️ Dilemme

**Couleur** gris `#696A6B → #CDCFD1` · **Ton** posé, presque philosophique · **Musique** piano épuré, silence entre les phrases.
**Idée** : le seul jeu **sans score** (brand context) : le scénario ne montre donc **ni vote ni points**.

| t | Image | Texte écran | Voix off |
|---|---|---|---|
| 0–3 s | Écran gris, une balance ⚖️ qui oscille, deux plateaux vides. | `DEUX OPTIONS.` | *(calme)* « Deux options. **Aucune** bonne. » |
| 3–8 s | Carte : « Plutôt avoir les mains à la place des pieds ou les pieds à la place des mains ? » Les 2 options s'affichent côte à côte. | — | « Les mains à la place des pieds… **ou les pieds à la place des mains ?** » |
| 8–14 s | ✦ Gros plan sur un visage qui hésite, regard qui hésite entre les deux. Bulle : « Je… ne peux pas passer ? » | `PAS LE DROIT DE BOTTER EN TOUCHE.` | « Tu ne peux pas passer. **Tu choisis.** » |
| 14–20 s | ✦ Le joueur s'explique, les autres écoutent, un ricane, un hoche la tête. | `PUIS TU JUSTIFIES.` | « Puis tu justifies. **Devant tout le monde.** » |
| 20–25 s | Les 3 catégories : *Absurde et Fun*, *Relations et Société*, *Identité et Valeurs*. | — | « Du **ridicule**… au **très personnel.** » |
| 25–30 s | Écran gris. Logo. | `PAS DE SCORE. PAS DE GAGNANT.` | *(posée, lente)* « Pas de score. Juste **qui tu es vraiment.** Dilemme. » |

---

## 11. 🕵️ Devine le mot

**Couleur** rose bordeaux `#BE185D → #580B2B` · **Ton** tendu, enquête · **Musique** polar léger, tic-tac.
**Idée** : chaque indice qu'on donne coûte quelque chose.

| t | Image | Texte écran | Voix off |
|---|---|---|---|
| 0–3 s | Carte bordeaux, mot flouté, détective 🕵️ qui regarde par-dessus. | `UN MOT. QUE TOI SEUL VOIS.` | *(tendue)* « Un mot. **Que toi seul vois.** » |
| 3–10 s | Compteur ●●● qui se remplit. Indice 1 : « Noir et blanc ». Indice 2 : « Mange du bambou ». Le chrono 1:00 tourne. | `TROIS INDICES MAX.` | « **Trois indices** maximum. Pas un de plus. » |
| 10–16 s | ✦ Un ami crie « UN PANDA ! », bras en l'air. +1. | `UN PANDA !` ✓ | « Moins tu en donnes… **plus t'es fort.** » |
| 16–22 s | Un mauvais indice : le compteur est vide, le chrono tombe à 0:00. ✦ Tête dépitée. | `TOUR GRILLÉ.` | « Un mauvais indice… et tu **brûles ton tour.** » |
| 22–26 s | Les 3 catégories : *Objets et Lieux*, *Personnages et Culture*, *Abstrait et Expressions*. | — | « Objets. Personnages. **Concepts abstraits.** » |
| 26–30 s | Logo. | `Devine le mot` | *(posée)* « Devine le mot. **Choisis bien tes mots.** » |

---

## ⚠️ À vérifier : écarts entre mes slides et le brand context

En comparant avec `playlink-brand-context.md`, 5 points de mes slides de règles (déjà saisies en back-office) sont à confirmer :

| Sujet | Slides que j'ai produites | Brand context / app mobile |
|---|---|---|
| **Vote** | « Verdict du groupe » · *Point ! / Raté* (libellés de l'app web v2) | « Est-ce que {joueur} mérite un point ? » **Oui / Non** (blueprint, app mobile) |
| **Dilemme** | Slide 3 avec un vote et des points | « **Pas de score, pas de gagnant** » |
| **Qui de nous** | Le joueur désigne, le groupe valide | **Le groupe désigne**, la majorité tranche |
| **Dégât Débat** | Un joueur défend sa position | **Chacun** défend sa position à voix haute |
| **Chrono (Mime, Devine le mot)** | « Sortez un chrono » | Mime : « le chrono s'en fout de ta dignité » (donc il y a un chrono) |

Couleur de Dilemme : j'ai utilisé un gris foncé `#6B7280 → #374151` par estimation ; la doc donne `#696A6B → #CDCFD1` (gris clair).
