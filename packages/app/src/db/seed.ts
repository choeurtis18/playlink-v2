import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedData = [
  {
    name: "Action ou Vérité",
    slug: "action-ou-verite",
    description: "Le classique revisité — action ou vérité, à toi de choisir !",
    icon: "🎯",
    colorMain: "#D4537E",
    colorSecondary: "#ED93B1",
    order: 0,
    categories: [
      {
        name: "Vérités légères",
        slug: "verites-legeres",
        description: "Questions simples pour briser la glace",
        order: 0,
        cards: [
          "Quelle est ta chanson honte secrète que tu écoutes en boucle ?",
          "Quel est le mensonge le plus blanc que tu aies dit cette semaine ?",
          "C'est quoi ton plat préféré que tu mangerais tous les jours sans te lasser ?",
          "Quel est ton souvenir le plus embarrassant au lycée ?",
          "Tu as déjà parlé à quelqu'un par texto en croyant écrire à quelqu'un d'autre ?",
          "Quelle est la chose la plus bizarre que tu aies mangée ?",
          "Tu as un doudou secret ou un objet auquel tu tiens trop ?",
          "Ton pire rendez-vous galant en une phrase ?",
          "Quelle application t'a fait perdre le plus de temps cette année ?",
          "Ton talent caché que personne ne connaît ?",
          "Quelle célébrité tu croiserais dans la rue sans la reconnaître ?",
          "Ton emoji le plus utilisé et pourquoi ?",
        ],
      },
      {
        name: "Vérités profondes",
        slug: "verites-profondes",
        description: "Questions qui font réfléchir",
        order: 1,
        cards: [
          "Quel est ton plus grand regret dans ta vie jusqu'ici ?",
          "Si tu pouvais changer une décision de ta vie, laquelle serait-ce ?",
          "Qu'est-ce que tu n'arrives pas à pardonner à quelqu'un de proche ?",
          "C'est quoi ta plus grande peur que tu n'avoues jamais ?",
          "Qu'est-ce qui te manque le plus dans ta vie en ce moment ?",
          "Quel est le moment où tu as été le plus fier de toi ?",
          "Tu as déjà envié quelqu'un dans ce groupe ? Pour quoi ?",
          "Quelle vérité sur toi-même tu refuses encore d'accepter ?",
          "Si tu mourais demain, qu'est-ce que tu regretterais de ne pas avoir dit ?",
          "Quel est l'échec qui t'a le plus appris sur toi-même ?",
        ],
      },
      {
        name: "Actions douces",
        slug: "actions-douces",
        description: "Défis marrants et sans risque",
        order: 2,
        cards: [
          "Imite la voix de la dernière personne à qui tu as parlé.",
          "Fais le tour de la pièce en dansant sans musique.",
          "Dis \"je t'aime\" à la personne à ta gauche avec le plus grand sérieux possible.",
          "Poste une photo de toi maintenant sur tes réseaux sans filtre.",
          "Chante la première chanson qui te passe par la tête pendant 30 secondes.",
          "Fais semblant d'être un présentateur météo pendant 1 minute.",
          "Envoie un message vocal à quelqu'un que tu n'as pas contacté depuis 6 mois.",
          "Fais 10 pompes maintenant.",
          "Parle en chuchotant pour le prochain tour.",
          "Dessine un portrait de la personne en face de toi en 30 secondes.",
        ],
      },
      {
        name: "Actions osées",
        slug: "actions-osees",
        description: "Pour ceux qui veulent pimenter la soirée",
        order: 3,
        cards: [
          "Appelle quelqu'un au hasard dans tes contacts et chante-lui Joyeux Anniversaire.",
          "Écris un message d'amour à la personne de ton choix dans le groupe et lis-le à voix haute.",
          "Prends une vidéo de toi en train de faire ton meilleur déhanché et envoie-la dans un groupe.",
          "Laisse la personne à ta droite choisir ta prochaine photo de profil pendant une heure.",
          "Fais une déclaration à quelqu'un du groupe comme si c'était une scène de film.",
          "Appelle quelqu'un et dis-lui que tu as quelque chose d'important à lui dire, puis raccroche.",
          "Poste un selfie avec la légende Bonne nuit même s'il est 15h.",
          "Demande aux autres de te donner un défi physique original.",
          "Parle avec un accent étranger pendant tout le prochain round.",
          "Imite la personne de ton choix dans le groupe jusqu'à ce qu'on la devine.",
        ],
      },
    ],
  },
  {
    name: "Icebreaker",
    slug: "icebreaker",
    description: "Brisez la glace — 10 questions pour apprendre à vraiment vous connaître.",
    icon: "🧊",
    colorMain: "#5B8DBE",
    colorSecondary: "#7BA3D1",
    order: 1,
    categories: [
      {
        name: "Pour se découvrir",
        slug: "se-decouvrir",
        description: "Questions légères pour apprendre à se connaître",
        order: 0,
        cards: [
          "Si tu étais un animal, lequel serais-tu et pourquoi ?",
          "Quel film ou série représente le mieux ta vie en ce moment ?",
          "Plutôt montagne ou mer, et pourquoi ce choix est-il évident pour toi ?",
          "Quelle est la dernière chose qui t'a vraiment fait rire aux larmes ?",
          "Si tu pouvais dîner avec n'importe qui dans l'histoire, qui choisirais-tu ?",
          "Quel est ton superpower si tu en avais un ?",
          "C'est quoi ton endroit préféré dans le monde entier ?",
          "Si tu devais manger le même repas pendant un mois, ce serait quoi ?",
          "Quel est l'objet que tu as depuis le plus longtemps et auquel tu tiens ?",
          "La chose que tu ferais en premier si tu gagnais 1 million d'euros demain ?",
          "Ton livre, film ou musique que tu voudrais que tout le monde découvre ?",
          "Quelle est ta routine du matin idéale ?",
        ],
      },
      {
        name: "Pour aller plus loin",
        slug: "aller-plus-loin",
        description: "Questions pour des vraies conversations",
        order: 1,
        cards: [
          "Qu'est-ce qui te rend vraiment heureux dans ta vie en ce moment ?",
          "C'est quoi pour toi le signe d'une vraie amitié ?",
          "Tu as changé d'avis sur quelque chose d'important récemment ?",
          "Quel est le conseil qu'on t'a donné et qui a vraiment changé ta vie ?",
          "C'est quoi ton ambition secrète que tu n'oses pas toujours dire ?",
          "Qu'est-ce que tu aimerais que les gens comprennent mieux à ton sujet ?",
          "Quel est le moment de ta vie où tu t'es senti le plus vivant ?",
          "Qu'est-ce qui te donne de l'énergie vs ce qui t'en prend ?",
          "Si tu pouvais changer une chose dans le monde demain, ce serait quoi ?",
          "C'est quoi pour toi le bonheur dans 10 ans ?",
        ],
      },
      {
        name: "Fun et décalé",
        slug: "fun-decale",
        description: "Questions absurdes et hilarantes",
        order: 2,
        cards: [
          "Si tu étais un condiment, tu serais lequel ?",
          "Quel serait ton nom de rappeur ou de super-héros ?",
          "Si ta vie était un film, quel acteur jouerait ton rôle ?",
          "Tu préfères avoir des mains à la place des pieds ou des pieds à la place des mains ?",
          "Quel son ou bruit te rend fou involontairement ?",
          "Si tu devais porter le même vêtement pendant un an, ce serait lequel ?",
          "C'est quoi ton niveau de je suis adulte responsable de 1 à 10 ?",
          "Quel emoji te représente le mieux en ce moment ?",
          "Si tu pouvais téléporter n'importe où pour 1 heure là maintenant, où irais-tu ?",
          "Quel serait ton job dans un monde médiéval fantastique ?",
          "Si tu avais une publicité qui te suivait partout, quel serait le slogan ?",
          "Ton pire superpower inutile — invisible seulement quand personne ne regarde ?",
        ],
      },
    ],
  },
  {
    name: "Dégât-Débat",
    slug: "degat-debat",
    description: "Les questions qui divisent — choisissez votre camp et défendez-le !",
    icon: "⚡",
    colorMain: "#D97706",
    colorSecondary: "#F59E0B",
    order: 2,
    categories: [
      {
        name: "Société",
        slug: "societe",
        description: "Les grands débats de notre époque",
        order: 0,
        cards: [
          "Les réseaux sociaux font-ils plus de bien que de mal à notre société ?",
          "Devrait-on obligatoirement voter à partir de 16 ans ?",
          "La semaine de 4 jours devrait être la norme partout.",
          "Faut-il interdire les voitures dans les centres-villes ?",
          "L'école devrait enseigner la gestion des émotions autant que les maths.",
          "Le télétravail total est-il meilleur pour la productivité ?",
          "Les influenceurs ont-ils une responsabilité morale envers leur audience ?",
          "Internet nous rend-il plus intelligents ou plus paresseux ?",
          "Le véganisme devrait-il être encouragé par l'État ?",
          "La prison réhabilite-t-elle vraiment les criminels ?",
        ],
      },
      {
        name: "Perso et Relations",
        slug: "perso-relations",
        description: "Les débats du quotidien",
        order: 1,
        cards: [
          "L'amitié peut-elle vraiment survivre à une grande trahison ?",
          "On peut vraiment rester ami avec un ex ?",
          "Le bonheur s'apprend ou c'est inné ?",
          "Les parents ont-ils une influence décisive sur ce qu'on devient ?",
          "Faut-il absolument pardonner pour aller de l'avant ?",
          "L'argent peut-il acheter le bonheur, au moins un peu ?",
          "L'amour au premier regard existe vraiment ?",
          "Est-il égoïste de prioriser son propre bonheur avant celui des autres ?",
          "La jalousie dans un couple est-elle normale ou toxique ?",
          "Peut-on vraiment changer fondamentalement en tant que personne ?",
        ],
      },
      {
        name: "Absurde mais sérieux",
        slug: "absurde-serieux",
        description: "Questions étranges qui révèlent beaucoup",
        order: 2,
        cards: [
          "Si tu pouvais lire les pensées des gens, le ferais-tu même si c'est douloureux ?",
          "Mieux vaut une longue vie ordinaire ou une vie courte mais intense ?",
          "Préfères-tu connaître la date de ta mort ou être surpris ?",
          "Si tu pouvais tout recommencer à 18 ans avec ta mémoire actuelle, tu le ferais ?",
          "Est-il possible d'être vraiment objectif sur soi-même ?",
          "Mieux vaut une seule amitié profonde ou 10 amitiés légères ?",
          "Si les robots faisaient tout le travail physique, serions-nous plus heureux ?",
          "L'intelligence artificielle peut-elle vraiment être créative ?",
          "Serait-il mieux de ne jamais tomber amoureux pour ne jamais souffrir ?",
          "Si on pouvait effacer un souvenir douloureux, faudrait-il le faire ?",
        ],
      },
    ],
  },
  {
    name: "Balance Ton Pote",
    slug: "balance-ton-pote",
    description: "La personne visée répond — honnêteté totale garantie !",
    icon: "🎤",
    colorMain: "#7C3AED",
    colorSecondary: "#A78BFA",
    order: 3,
    categories: [
      {
        name: "Questions légères",
        slug: "questions-legeres",
        description: "Fun et sans drama",
        order: 0,
        cards: [
          "C'est qui dans ce groupe que tu appellerais en premier en cas d'urgence ?",
          "Qui dans ce groupe serait le dernier à survivre dans une forêt ?",
          "Qui de vos amis communs ressemble le plus à [JOUEUR] ?",
          "C'est quoi le défaut de [JOUEUR] que tout le monde connaît mais que personne ne dit ?",
          "Quel membre du groupe t'a le plus surpris en bien cette année ?",
          "Si [JOUEUR] était un personnage de dessin animé, ce serait lequel ?",
          "Qu'est-ce que [JOUEUR] fait souvent qui te fait rire sans le savoir ?",
          "Quel est le souvenir le plus drôle que tu as avec quelqu'un dans ce groupe ?",
          "Qui ici serait le meilleur candidat pour une émission de télé-réalité ?",
          "C'est quoi le truc que [JOUEUR] fait et qu'il croit que personne ne remarque ?",
          "Qui dans le groupe serait le meilleur président de la République ?",
          "Quel serait le métier parfait pour [JOUEUR] selon toi ?",
        ],
      },
      {
        name: "Questions cash",
        slug: "questions-cash",
        description: "Pour les vrais honnêtes",
        order: 1,
        cards: [
          "C'est quoi la chose que [JOUEUR] a faite qui t'a le plus déçu ?",
          "Tu penses quoi vraiment de la relation actuelle de [JOUEUR] ?",
          "C'est quoi l'erreur que [JOUEUR] répète souvent sans s'en rendre compte ?",
          "Si tu devais donner un conseil sincère à [JOUEUR], ce serait lequel ?",
          "C'est quoi le truc que [JOUEUR] dit qu'il va faire mais ne fait jamais ?",
          "Qu'est-ce que [JOUEUR] pourrait améliorer dans sa façon de traiter les autres ?",
          "C'est quoi la décision de [JOUEUR] que tu n'aurais pas prise à sa place ?",
          "Si [JOUEUR] devait changer une chose en lui, ce serait quoi selon toi ?",
          "Qu'est-ce que [JOUEUR] mérite vraiment dans la vie qu'il n'a pas encore ?",
          "C'est quoi la vérité que tu veux dire à [JOUEUR] depuis longtemps ?",
        ],
      },
      {
        name: "Questions profondes",
        slug: "questions-profondes",
        description: "Pour se redécouvrir mutuellement",
        order: 2,
        cards: [
          "C'est quoi la qualité de [JOUEUR] que tu admires le plus profondément ?",
          "Qu'est-ce qui a changé chez [JOUEUR] depuis que tu le connais ?",
          "C'est quoi la chose que [JOUEUR] ne sait peut-être pas que tu apprécies chez lui ?",
          "Qu'est-ce que [JOUEUR] t'a appris sans le savoir ?",
          "Si [JOUEUR] lisait un livre sur sa propre vie, comment s'appellerait-il ?",
          "Dans 10 ans, tu imagines [JOUEUR] faire quoi de sa vie ?",
          "C'est quoi le moment où tu as vu [JOUEUR] sous un jour complètement différent ?",
          "Quelle force de [JOUEUR] penses-tu qu'il sous-estime ?",
          "C'est quoi la chose que tu ferais pour [JOUEUR] sans hésiter ?",
          "Si tu devais décrire [JOUEUR] à quelqu'un qui ne le connaît pas, que dirais-tu en 3 mots ?",
        ],
      },
    ],
  },
];

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Seeding is disabled in production. Use "prisma migrate deploy" instead.'
    );
  }

  console.log("Seeding database...");

  await prisma.card.deleteMany();
  await prisma.category.deleteMany();
  await prisma.game.deleteMany();

  for (const gameData of seedData) {
    const { categories, ...gameFields } = gameData;
    const game = await prisma.game.create({ data: gameFields });
    console.log(`  Game: ${game.name}`);

    for (const catData of categories) {
      const { cards, ...catFields } = catData;
      const category = await prisma.category.create({
        data: { ...catFields, gameId: game.id },
      });

      await prisma.card.createMany({
        data: cards.map((text, i) => ({
          categoryId: category.id,
          text,
          active: true,
          order: i,
          tags: [],
        })),
      });

      console.log(`    Category: ${category.name} (${cards.length} cards)`);
    }
  }

  const [games, categories, cards] = await Promise.all([
    prisma.game.count(),
    prisma.category.count(),
    prisma.card.count(),
  ]);

  console.log(`\nSeed complete: ${games} games, ${categories} categories, ${cards} cards`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
