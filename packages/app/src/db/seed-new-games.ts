// Data for new games: Mime Inversé + Devine le Mot
// Imported by seed.ts

export const newGames = [
  {
    name: 'Mime Inversé',
    slug: 'mime-inverse',
    description: 'Faites mimer, faites deviner — un duo, un mot, et 1 minute pour chaque carte !',
    icon: '🎭',
    colorMain: '#EC4899',
    colorSecondary: '#F472B6',
    order: 4,
    categories: [
      {
        name: 'Objets du quotidien',
        slug: 'objets-quotidien',
        icon: '📦',
        description: 'Des objets qu\'on voit tous les jours',
        order: 0,
        cards: [
          'Brosse à dents',
          'Téléphone portable',
          'Parapluie',
          'Lunettes de soleil',
          'Casque audio',
          'Clavier d\'ordinateur',
          'Sac à dos',
          'Bouilloire',
          'Aspirateur',
          'Machine à café',
          'Ciseaux',
          'Tournevis',
          'Chaussures à talons',
          'Stylo',
          'Tire-bouchon',
          'Hamac',
          'Trottinette',
          'Ventilateur',
          'Skateboard',
          'Boule de cristal',
          'Bague de fiançailles',
          'Vieil ordinateur portable',
          'Roue de hamster',
          'Couteau suisse',
          'Loupe',
        ],
      },
      {
        name: 'Actions',
        slug: 'actions',
        icon: '⚡',
        description: 'Des gestes et des verbes à mimer',
        order: 1,
        cards: [
          'Casser un œuf',
          'Boire un café trop chaud',
          'Danser le tango',
          'Programmer un ordinateur',
          'Conduire une voiture sportive',
          'Faire du yoga',
          'Pêcher à la ligne',
          'Faire une crêpe',
          'Lancer un boomerang',
          'Jouer de la batterie',
          'Faire la sieste',
          'Repasser une chemise',
          'Tailler une haie',
          'Voler comme un super-héros',
          'Se brosser les dents',
          'Plier du linge',
          'Escalader une montagne',
          'Lacer ses chaussures',
          'Mâcher du chewing-gum',
          'Compter de l\'argent',
          'Lancer un avion en papier',
          'Faire des bulles de savon',
          'Manger des spaghettis',
          'Coudre un bouton',
          'Repeindre un mur',
        ],
      },
      {
        name: 'Métiers',
        slug: 'metiers',
        icon: '👔',
        description: 'Métiers et professions à mimer',
        order: 2,
        cards: [
          'Astronaute',
          'Professeur',
          'Pompier',
          'Cuisinier',
          'Boulanger',
          'Coiffeur',
          'Médecin',
          'Pilote d\'avion',
          'Magicien',
          'DJ',
          'Photographe',
          'Mécanicien',
          'Vétérinaire',
          'Plombier',
          'Architecte',
          'Marin pêcheur',
          'Acteur de théâtre',
          'Présentateur télé',
          'Apiculteur',
          'Tatoueur',
          'Dompteur de lions',
          'Chercheur d\'or',
          'Chauffeur de taxi',
          'Sculpteur',
          'Détective privé',
          'Caissier de supermarché',
          'Souffleur de verre',
          'Charpentier',
          'Maître nageur',
          'Jardinier paysagiste',
        ],
      },
    ],
    rules: `## Mime Inversé 🎭

### Préparation
- Mettez-vous **par paires** (le devineur et le mineur)
- Choisissez une catégorie ensemble
- Prévoyez un chrono d'**1 minute**

### Règles
1. Le **devineur** lit la carte en silence (ne pas montrer aux autres !)
2. Il fait alors **mimer** le mot à son partenaire (le mineur)
3. Le mineur doit deviner et dire le mot **à voix haute**
4. Si trouvé : passez à la suivante !
5. Si bloqués : passez la carte

### Variante compétitive
- **Score** = nombre de cartes trouvées en 1 minute
- L'équipe avec le plus haut score remporte la manche !

### Astuce
*Pas de paroles, pas de bruitages !* Uniquement les gestes 🤐`,
  },
  {
    name: 'Devine le Mot',
    slug: 'devine-le-mot',
    description: 'Un joueur a le mot secret. Les autres l\'aident à le deviner en 5 tours !',
    icon: '🎯',
    colorMain: '#8B5CF6',
    colorSecondary: '#A78BFA',
    order: 5,
    categories: [
      {
        name: 'Facile',
        slug: 'facile',
        icon: '⭐',
        description: 'Objets et concepts simples',
        order: 0,
        cards: [
          'Chaise',
          'Chat',
          'Eau',
          'Soleil',
          'Voiture',
          'Pain',
          'Livre',
          'Forêt',
          'Plage',
          'Montagne',
          'Pluie',
          'Cinéma',
          'Pizza',
          'Vélo',
          'Lune',
          'Téléphone',
          'Ballon',
          'Fleur',
          'Maison',
          'Étoile',
          'Chien',
          'Tomate',
          'Avion',
          'Bateau',
          'Hiver',
          'Été',
          'Café',
          'Train',
          'Piano',
          'Chocolat',
          'Bibliothèque',
          'Jardin',
          'Plage',
          'Neige',
          'Vague',
          'Pont',
          'Rivière',
          'Chemin',
          'Champignon',
          'Lampe',
        ],
        difficulty: 'easy',
      },
      {
        name: 'Moyen',
        slug: 'moyen',
        icon: '⭐⭐',
        description: 'Concepts abstraits accessibles',
        order: 1,
        cards: [
          'Électricité',
          'Amitié',
          'Liberté',
          'Souvenir',
          'Patience',
          'Aventure',
          'Imagination',
          'Curiosité',
          'Rêve',
          'Voyage',
          'Mystère',
          'Découverte',
          'Histoire',
          'Tradition',
          'Innovation',
          'Émotion',
          'Compréhension',
          'Confiance',
          'Sagesse',
          'Espoir',
          'Solitude',
          'Tendresse',
          'Énergie',
          'Mémoire',
          'Vision',
          'Inspiration',
          'Détermination',
          'Surprise',
          'Curiosité',
          'Bonheur',
          'Routine',
          'Évasion',
          'Famille',
          'Confort',
          'Apprentissage',
          'Création',
          'Réflexion',
          'Loisir',
          'Performance',
          'Atmosphère',
        ],
        difficulty: 'medium',
      },
      {
        name: 'Difficile',
        slug: 'difficile',
        icon: '⭐⭐⭐',
        description: 'Concepts abstraits et philosophiques',
        order: 2,
        cards: [
          'Métaphore',
          'Paradoxe',
          'Transcendance',
          'Sérendipité',
          'Mélancolie',
          'Ambivalence',
          'Nostalgie',
          'Synchronicité',
          'Épiphanie',
          'Catharsis',
          'Existentialisme',
          'Dissonance',
          'Karma',
          'Zen',
          'Symbiose',
          'Renaissance',
          'Pléthore',
          'Quintessence',
          'Vulnérabilité',
          'Résilience',
          'Empathie',
          'Sublimation',
          'Métamorphose',
          'Solipsisme',
          'Authenticité',
          'Effervescence',
          'Sophistication',
          'Sérénité',
          'Conjecture',
          'Chiaroscuro',
          'Polyvalence',
          'Méta-cognition',
          'Convivialité',
          'Dichotomie',
          'Symétrie',
          'Polarité',
          'Anomalie',
          'Idiosyncrasie',
          'Phénomène',
          'Subjectivité',
        ],
        difficulty: 'hard',
      },
    ],
    rules: `## Devine le Mot 🎯

### Préparation
- Un joueur est le **gardien du mot** (il voit la carte)
- Les autres joueurs sont les **devineurs**
- Prévoyez **5 tours** maximum

### Règles
1. Le gardien lit le mot en silence
2. À chaque tour, les devineurs proposent **2 mots indices**
3. Le gardien indique lequel des 2 est **le plus proche** du mot secret
4. Les devineurs réfléchissent et proposent un nouveau couple
5. Quand un devineur pense avoir trouvé, il **annonce le mot**

### Victoire
- ✅ Trouvé en **1-2 tours** : 5 points
- ✅ Trouvé en **3-4 tours** : 3 points
- ✅ Trouvé au **5ème tour** : 1 point
- ❌ Pas trouvé : 0 point, on change de gardien

### Astuce
*Le gardien ne donne pas d'indices supplémentaires* — juste "celui-ci est plus proche" 🤫`,
  },
];

export const defaultRules: Record<string, string> = {
  'action-ou-verite': `## Action ou Vérité 🎯

### Comment jouer
Chaque joueur, à son tour, tire une carte. Selon la catégorie choisie, il devra :
- **Vérité** : répondre honnêtement à la question
- **Action** : relever le défi à la lettre

### Catégories disponibles
- **Vérités légères** : pour briser la glace
- **Vérités profondes** : pour aller plus loin
- **Actions douces** : défis fun et safe
- **Actions osées** : pour pimenter la soirée

### Règle d'or
*Pas de jugement, pas de moqueries — le but, c'est de s'amuser tous ensemble.* 🎉`,

  'icebreaker': `## Icebreaker 🧊

### Comment jouer
Brisez la glace avec des questions soigneusement choisies pour mieux vous connaître :
1. Choisissez une catégorie
2. Tirez une carte chacun à votre tour
3. Répondez **honnêtement** et **avec curiosité**

### Conseil
Plus tu **partages**, plus les autres se sentiront en confiance pour le faire aussi. C'est un cercle vertueux ✨

### Variante en équipe
- Posez une question, **tout le monde répond** à tour de rôle
- Idéal pour les soirées entre nouveaux amis ou en groupe élargi !`,

  'degat-debat': `## Dégât-Débat ⚡

### Comment jouer
Les questions qui divisent — choisissez votre camp et défendez-le !

### Règles
1. Tirez une carte avec un sujet de débat
2. **Chaque joueur choisit son camp** (pour/contre)
3. Argumentez à tour de rôle
4. À la fin, un **vote** détermine qui a été le plus convaincant

### Variante 1v1
- Deux joueurs s'affrontent en duel
- Les autres votent pour le meilleur orateur

### Règle d'or
*Le but n'est pas d'avoir raison, mais d'argumenter avec brio* — restez bienveillants ! 💬`,

  'balance-ton-pote': `## Balance Ton Pote 🎤

### Comment jouer
Les cartes contiennent des questions concernant un membre du groupe (marqué **[JOUEUR]**).

### Règles
1. Tirez une carte
2. Désignez le joueur visé (au hasard, ou volontaire)
3. **La personne visée doit répondre** honnêtement
4. Les autres peuvent rebondir, partager, ou compléter

### Esprit du jeu
Ce n'est **pas du roast** — c'est l'occasion de se dire des vérités, de partager des compliments inattendus, ou de mieux se comprendre.

### Conseil
*Si une question est trop sensible, le joueur visé peut "passer" sans expliquer.* Le respect avant tout ❤️`,
};

export const gameRuleSlides: Record<string, Array<{ order: number; title: string; content: string; imageUrl?: string }>> = {
  'action-ou-verite': [
    {
      order: 0,
      title: 'Bienvenue ! 🎉',
      content: `Chaque joueur tire une carte et doit :

- **Répondre honnêtement** à une *VÉRITÉ*
- Ou **relever un défi** *ACTION*

---

**Règle d'or**

*Pas de jugement, pas de moqueries.*

**Juste du fun et des vraies connexions !** ✨`,
    },
    {
      order: 1,
      title: '4 Catégories',
      content: `- 💬 **Vérités légères** — Pour briser la glace
- 🔥 **Vérités profondes** — Pour aller plus loin
- 🎈 **Actions douces** — Défis fun et safe
- 🔞 **Actions osées** — Pour pimenter la soirée

Choisissez celle qui vous convient ! 🎯`,
    },
    {
      order: 2,
      title: 'Comment jouer ?',
      content: `## Avant de commencer
1. Mettez-vous **en cercle**
2. Choisissez une **catégorie** ensemble
3. Prévoir du **respect et de la bienveillance**

## À chaque tour
1. Un joueur tire une **carte**
2. Il lit à **haute voix** ce qu'il y a dessus
3. Il **agit** ou **répond** selon la carte
4. **Pas de pression** — on peut toujours passer !

C'est party ! 🎉`,
    },
    {
      order: 3,
      title: 'Conseils d\'or',
      content: `✅ **À faire:**
- Écouter **sans juger**
- Encourager **la vulnérabilité**
- Rire **avec** les gens, pas **d'eux**
- Respecter les **limites**

❌ **À éviter:**
- Forcer quelqu'un à faire quelque chose
- Moqueries **méchantes**
- Raconter les secrets **après le jeu**
- Prendre les choses trop **au sérieux**

**L'objectif:** s'amuser et créer des **vrais moments** ensemble ! 💝`,
    },
  ],
};

export const dilemmeGame = {
  name: 'Dilemme',
  slug: 'dilemme',
  description: 'Des choix impossibles — choisissez votre camp et assumez !',
  icon: '⚖️',
  colorMain: '#0EA5E9',
  colorSecondary: '#38BDF8',
  order: 6,
  rules: null,
  categories: [
    {
      name: 'Absurde et Fun',
      slug: 'absurde-et-fun',
      icon: '😄',
      description: 'Choix amusants : super-pouvoirs ridicules, paradoxes drôles',
      order: 0,
      cards: [
        'Plutôt avoir les mains à la place des pieds ou les pieds à la place des mains ?',
        'Plutôt vivre dans un monde où tout le monde lit dans les pensées ou personne ne peut mentir ?',
        'Plutôt pouvoir voler mais très lentement ou courir très vite mais jamais s\'arrêter ?',
        'Plutôt n\'avoir qu\'un seul ami très proche ou 100 amis superficiels ?',
        'Plutôt vivre dans le passé (années 80) ou dans le futur (2150) ?',
        'Plutôt parler toutes les langues du monde ou jouer de tous les instruments de musique ?',
        'Plutôt avoir une mémoire parfaite ou oublier toutes ses mauvaises expériences ?',
        'Plutôt manger la même chose toute sa vie ou ne jamais manger la même chose deux fois ?',
        'Plutôt être célèbre mais détesté ou inconnu mais adoré de tous ?',
        'Plutôt avoir la peau qui brille dans le noir ou des cheveux qui changent de couleur selon l\'humeur ?',
        'Plutôt ne jamais ressentir la douleur ou ne jamais ressentir la fatigue ?',
        'Plutôt pouvoir arrêter le temps ou revenir 10 ans en arrière une seule fois ?',
        'Plutôt n\'avoir que 10 ans à vivre mais intensément ou 100 ans dans la médiocrité ?',
        'Plutôt perdre tous ses souvenirs ou ne jamais pouvoir en créer de nouveaux ?',
        'Plutôt être le plus intelligent de la pièce ou le plus heureux ?',
        'Plutôt savoir la date exacte de sa mort ou savoir comment on va mourir ?',
        'Plutôt voyager partout mais jamais revenir chez soi ou rester à la maison mais tout connaître du monde ?',
        'Plutôt avoir un superpouvoir inutile que tout le monde admire ou un superpouvoir utile que personne ne connaît ?',
        'Plutôt parler comme Yoda pour toujours ou marcher à reculons partout ?',
        'Plutôt n\'avoir qu\'une seule chanson à écouter pour le reste de sa vie ou ne plus jamais entendre de musique ?',
      ],
    },
    {
      name: 'Paradoxes et Existentiel',
      slug: 'paradoxes-et-existentiel',
      icon: '🤔',
      description: 'Philosophie sur la mort, le sacrifice et sens de la vie',
      order: 1,
      cards: [
        'Plutôt savoir que ta vie a un sens prédéfini ou avoir une liberté totale sans aucun but ?',
        'Plutôt mourir jeune en ayant tout accompli ou vieillir sans avoir réalisé tes rêves ?',
        'Plutôt vivre dans un monde parfait mais faux ou un monde imparfait mais réel ?',
        'Plutôt sacrifier ton bonheur pour celui de tes proches ou préserver le tien même si ça leur coûte ?',
        'Plutôt être la cause d\'un grand bien involontaire ou d\'un petit mal volontaire ?',
        'Plutôt tout savoir sur la nature humaine ou tout ignorer et rester naïf ?',
        'Plutôt être oublié après ta mort ou être souvenu pour de mauvaises raisons ?',
        'Plutôt vivre éternellement seul ou mourir entouré de personnes qui ne te comprennent pas ?',
        'Plutôt avoir la certitude que Dieu existe ou la certitude qu\'il n\'existe pas ?',
        'Plutôt changer le cours de l\'histoire et risquer d\'effacer des gens que tu aimes ou ne rien changer ?',
        'Plutôt souffrir pour une cause juste ou vivre confortablement dans l\'injustice ?',
        'Plutôt être toujours sincère et blesser les gens ou mentir pour les protéger ?',
        'Plutôt avoir une vie parfaite dont personne ne connaît l\'existence ou une vie difficile reconnue par tous ?',
        'Plutôt ressentir toutes les émotions à leur maximum ou ne rien ressentir du tout ?',
        'Plutôt être le bourreau qui sauve mille innocents ou la victime qui refuse de compromettre ses valeurs ?',
        'Plutôt vivre dans un monde sans art ni créativité ou sans science ni technologie ?',
        'Plutôt que tout le monde pense exactement comme toi ou que personne ne te comprenne jamais ?',
        'Plutôt avoir la preuve que le libre arbitre n\'existe pas ou vivre dans le doute toute ta vie ?',
        'Plutôt être heureux sans raison ou malheureux mais avec une raison profonde ?',
        'Plutôt laisser quelque chose d\'imparfait mais authentique ou quelque chose de parfait mais vide de sens ?',
      ],
    },
    {
      name: 'Identité et Valeurs',
      slug: 'identite-et-valeurs',
      icon: '⚖️',
      description: 'Choix révélateurs : argent vs amour, carrière vs famille',
      order: 2,
      cards: [
        'Plutôt être très riche mais solitaire ou avoir juste assez d\'argent entouré de gens qui t\'aiment ?',
        'Plutôt réussir ta carrière au détriment de ta famille ou sacrifier ta carrière pour tes proches ?',
        'Plutôt trahir un ami pour sauver ta réputation ou ruiner ta réputation pour protéger un ami ?',
        'Plutôt être aimé pour quelqu\'un que tu n\'es pas ou ignoré pour ce que tu es vraiment ?',
        'Plutôt vivre selon les attentes des autres et être heureux superficiellement ou vivre selon tes convictions et souffrir ?',
        'Plutôt avoir un travail qui a du sens mais peu payé ou un travail inutile mais très bien rémunéré ?',
        'Plutôt pardonner quelqu\'un qui ne le mérite pas ou garder rancune et perdre la paix intérieure ?',
        'Plutôt être honnête avec quelqu\'un et le blesser ou lui mentir pour lui éviter de souffrir ?',
        'Plutôt choisir la sécurité et renoncer à tes rêves ou tout risquer pour les atteindre ?',
        'Plutôt avoir raison tout seul ou avoir tort avec les autres ?',
        'Plutôt vivre dans ta culture natale ou t\'intégrer totalement dans une autre culture ?',
        'Plutôt défendre une cause juste mais impopulaire ou rejoindre une cause populaire mais moralement douteuse ?',
        'Plutôt être admiré sans être compris ou être compris sans être admiré ?',
        'Plutôt vivre intensément et mourir jeune ou vivre modérément et mourir vieux ?',
        'Plutôt choisir un amour passionnel mais destructeur ou un amour stable mais sans frissons ?',
        'Plutôt réussir grâce à la chance ou échouer malgré le mérite ?',
        'Plutôt être fier d\'un acte dont personne ne sait rien ou être reconnu pour quelque chose qui ne te ressemble pas ?',
        'Plutôt avoir des convictions fortes et inflexibles ou être ouvert à tout et ne rien défendre ?',
        'Plutôt vivre dans un pays qui correspond à tes valeurs mais sans tes proches ou rester avec eux dans un pays qui t\'étouffe ?',
        'Plutôt être une personne moyenne dans un monde exceptionnel ou une personne exceptionnelle dans un monde médiocre ?',
      ],
    },
  ],
};
