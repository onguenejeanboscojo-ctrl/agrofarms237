export type EducationLessonDefault = {
  title: string;
  slug: string;
  introduction: string;
  content: string;
  image_url: string;
  position: number;
  published: boolean;
};

export type EducationModuleDefault = {
  title: string;
  slug: string;
  description: string;
  image_url: string;
  position: number;
  published: boolean;
  lessons: EducationLessonDefault[];
};

export const educationDefaults: EducationModuleDefault[] = [
  {
    title: "Pisciculture",
    slug: "pisciculture",
    description:
      "Découvrez les bases de la pisciculture, de la préparation du bassin jusqu’à la récolte et la commercialisation.",
    image_url: "/images/education/modules/pisciculture.jpg",
    position: 1,
    published: true,

    lessons: [
      {
        title: "Introduction à la pisciculture",
        slug: "introduction-pisciculture",
        introduction:
          "Comprendre ce qu’est la pisciculture, ses principes fondamentaux et les éléments nécessaires pour démarrer.",
        content: `
# Introduction à la pisciculture

La pisciculture est une activité d’élevage qui consiste à produire des poissons dans un environnement contrôlé.

Elle demande de la préparation, de l’observation, de la régularité et une bonne organisation.

## Ce que vous allez apprendre

Dans ce cours, vous allez découvrir :

- ce qu’est la pisciculture ;
- les principaux systèmes d’élevage ;
- les éléments nécessaires à une production ;
- le rôle du pisciculteur ;
- les premières règles à connaître avant de démarrer.

## Pourquoi pratiquer la pisciculture ?

La pisciculture permet de produire du poisson et de développer une activité agricole pouvant être adaptée à différentes échelles.

Cependant, une production piscicole rentable nécessite une bonne maîtrise des coûts, de l’alimentation, de la qualité de l’eau, de la croissance des poissons et de la commercialisation.

## Les éléments essentiels

Un élevage piscicole repose notamment sur :

- une installation adaptée ;
- des alevins de qualité ;
- une alimentation appropriée ;
- une bonne gestion de l’eau ;
- un suivi régulier ;
- une stratégie de commercialisation.

## Le rôle du pisciculteur

Le pisciculteur est à la fois éleveur et gestionnaire.

Il doit observer son élevage, enregistrer les informations importantes, identifier les problèmes et prendre les décisions nécessaires.

## À retenir

Une bonne production piscicole commence par une bonne préparation.

Avant de chercher à augmenter la production, il faut d’abord apprendre à maîtriser son système d’élevage.
        `,
        image_url:
          "/images/education/cours/introduction-pisciculture.jpg",
        position: 1,
        published: true,
      },

      {
        title: "Choisir son espèce et son système d’élevage",
        slug: "choisir-espece-systeme-elevage",
        introduction:
          "Comprendre les critères à prendre en compte avant de choisir une espèce et un système d’élevage.",
        content: `
# Choisir son espèce et son système d’élevage

Le choix de l’espèce est une décision importante avant de commencer une production piscicole.

Il doit tenir compte des conditions disponibles, du système d’élevage envisagé, des objectifs de production et du marché ciblé.

## Les principaux critères

Avant de choisir une espèce, il faut notamment étudier :

- son adaptation au milieu ;
- ses besoins alimentaires ;
- sa vitesse de croissance ;
- sa résistance ;
- la disponibilité des alevins ;
- la demande du marché.

## Choisir son système

Le système d’élevage doit être adapté aux moyens disponibles.

Il peut s’agir notamment de bassins ou d’autres installations adaptées à la production envisagée.

## À retenir

Il n’existe pas un système universellement adapté à tous les producteurs.

Le bon choix dépend des ressources disponibles, des objectifs et du marché.
        `,
        image_url: "/images/education/cours/choisir-espece.jpg",
        position: 2,
        published: true,
      },

      {
        title: "Préparer et aménager son bassin",
        slug: "preparer-amenager-bassin",
        introduction:
          "Découvrir les principaux éléments à prendre en compte pour préparer un environnement adapté à l’élevage.",
        content: `
# Préparer et aménager son bassin

Le bassin constitue l’environnement dans lequel les poissons vont évoluer pendant leur croissance.

Sa préparation doit donc être réalisée avec méthode.

## Avant de remplir le bassin

Il faut vérifier :

- l’état général de l’installation ;
- l’arrivée et l’évacuation de l’eau ;
- la propreté ;
- la sécurité ;
- la facilité d’entretien.

## Organisation du bassin

L'installation doit permettre au producteur d'effectuer facilement les opérations quotidiennes.

L'accès, l'alimentation, l'observation et la récolte doivent être pris en compte dès la conception.

## À retenir

Un bassin bien préparé facilite la gestion quotidienne et contribue à une meilleure organisation de la production.
        `,
        image_url: "/images/education/cours/amenagement-bassin.jpg",
        position: 3,
        published: true,
      },

      {
        title: "Choisir et introduire les alevins",
        slug: "choisir-introduire-alevins",
        introduction:
          "Comprendre les critères de sélection et les précautions à prendre lors de l’introduction des alevins.",
        content: `
# Choisir et introduire les alevins

Les alevins représentent le point de départ de la production.

La qualité du stock initial peut influencer la suite de l'élevage.

## Lors du choix

Le producteur doit rechercher des alevins :

- en bon état général ;
- actifs ;
- adaptés à l'espèce choisie ;
- provenant d'une source fiable.

## L'introduction

L'introduction doit être réalisée avec précaution afin de limiter le stress et les pertes.

Le producteur doit également noter la quantité introduite et la date de mise en élevage.

## Suivi

Après l'introduction, l'observation du comportement et de la consommation permet de détecter rapidement d'éventuelles anomalies.

## À retenir

Un bon départ facilite le suivi de toute la production.
        `,
        image_url: "/images/education/cours/alevins.jpg",
        position: 4,
        published: true,
      },

      {
        title: "Nourrir correctement les poissons",
        slug: "nourrir-poissons",
        introduction:
          "Comprendre les principes d’une alimentation adaptée et l’importance du suivi de la consommation.",
        content: `
# Nourrir correctement les poissons

L'alimentation joue un rôle essentiel dans la croissance des poissons et représente une part importante des charges d'un élevage.

## Une alimentation adaptée

L'aliment doit correspondre aux besoins des poissons et à leur stade de développement.

La quantité distribuée doit également être suivie.

## Observer les poissons

Le producteur doit observer la manière dont les poissons consomment l'aliment.

Une modification de la consommation peut être un signal nécessitant une observation plus approfondie.

## Suivre les dépenses

Le coût de l'alimentation doit être enregistré afin de pouvoir calculer correctement le coût de production.

## À retenir

Nourrir correctement signifie apporter un aliment adapté tout en contrôlant la consommation et les coûts.
        `,
        image_url:
          "/images/education/cours/alimentation-poissons.jpg",
        position: 5,
        published: true,
      },

      {
        title: "Gérer la qualité de l’eau",
        slug: "gerer-qualite-eau",
        introduction:
          "Comprendre les principaux paramètres de l’eau et leur importance pour l’élevage.",
        content: `
# Gérer la qualité de l’eau

L'eau est l'environnement de vie des poissons.

Sa qualité doit donc être suivie régulièrement.

## Observer

Le comportement des poissons peut fournir des informations importantes.

Le producteur doit notamment être attentif aux changements inhabituels.

## Entretenir

L'entretien de l'installation et la gestion de l'eau doivent faire partie des opérations régulières.

## Documenter

Les observations et interventions importantes doivent être enregistrées.

## À retenir

Une bonne gestion de l'eau repose sur l'observation, la régularité et la réaction rapide lorsqu'une anomalie apparaît.
        `,
        image_url: "/images/education/cours/qualite-eau.jpg",
        position: 6,
        published: true,
      },

      {
        title: "Suivre la croissance et gérer le stock",
        slug: "suivre-croissance-gerer-stock",
        introduction:
          "Apprendre à suivre l’évolution du cheptel et à organiser les données de production.",
        content: `
# Suivre la croissance et gérer le stock

Le suivi permet au producteur de savoir ce qui se passe réellement dans son élevage.

## Les informations importantes

Il est utile de suivre :

- les quantités introduites ;
- les pertes ;
- l'alimentation ;
- la croissance ;
- les interventions ;
- les dates importantes.

## Pourquoi enregistrer ?

Les données permettent de comparer les périodes et de mieux comprendre les performances de l'élevage.

Elles sont également utiles pour calculer les coûts et préparer la commercialisation.

## À retenir

Un élevage qui n'est pas suivi correctement est difficile à piloter.
        `,
        image_url:
          "/images/education/cours/suivi-croissance.jpg",
        position: 7,
        published: true,
      },

      {
        title: "Récolter et commercialiser sa production",
        slug: "recolter-commercialiser-production",
        introduction:
          "Découvrir les étapes essentielles entre la récolte, la préparation de la production et sa commercialisation.",
        content: `
# Récolter et commercialiser sa production

La production piscicole doit être pensée jusqu'à la vente.

## Préparer la récolte

La récolte doit être organisée afin de limiter les pertes et de préserver la qualité du produit.

## Identifier les clients

Le producteur peut cibler différents types de clients :

- particuliers ;
- restaurants ;
- revendeurs ;
- commerçants ;
- autres professionnels.

## Organiser la vente

La commercialisation doit prendre en compte :

- le prix ;
- les quantités disponibles ;
- les coûts ;
- la logistique ;
- les besoins des clients.

## À retenir

Produire est une partie du métier.

Savoir vendre correctement sa production est également essentiel.
        `,
        image_url:
          "/images/education/cours/recolte-commercialisation.jpg",
        position: 8,
        published: true,
      },
    ],
  },

  {
    title: "Élevage porcin",
    slug: "elevage-porcin",
    description:
      "Apprenez les fondamentaux de la conduite d’un élevage porcin et de son organisation.",
    image_url: "/images/education/modules/elevage-porcin.jpg",
    position: 2,
    published: true,

    lessons: [
      {
        title: "Introduction à l’élevage porcin",
        slug: "introduction-elevage-porcin",
        introduction:
          "Découvrir les principes fondamentaux de l’élevage porcin et les éléments nécessaires pour organiser une production.",
        content: `
# Introduction à l’élevage porcin

L'élevage porcin consiste à conduire des porcs dans un environnement adapté afin de produire des animaux destinés notamment à la commercialisation.

Une exploitation porcine nécessite une organisation rigoureuse.

## Les principaux éléments

Un élevage repose notamment sur :

- les bâtiments ;
- les animaux ;
- l'alimentation ;
- l'eau ;
- l'hygiène ;
- le suivi ;
- la reproduction ;
- la commercialisation.

## Le rôle de l'éleveur

L'éleveur doit observer ses animaux, organiser les opérations quotidiennes et suivre les coûts de production.

## À retenir

Un élevage bien organisé commence par une bonne préparation.
        `,
        image_url:
          "/images/education/cours/introduction-elevage-porcin.jpg",
        position: 1,
        published: true,
      },

      {
        title: "Choisir ses animaux reproducteurs",
        slug: "choisir-animaux-reproducteurs",
        introduction:
          "Comprendre les critères à considérer pour constituer un cheptel reproducteur.",
        content: `
# Choisir ses animaux reproducteurs

Le choix des reproducteurs influence la qualité et l'organisation du cheptel.

## Les critères

Il faut notamment observer :

- l'état général ;
- la conformation ;
- l'origine ;
- les performances disponibles ;
- l'adaptation aux conditions d'élevage.

## Construire son cheptel

Le nombre d'animaux doit rester cohérent avec les bâtiments, l'alimentation, la main-d'œuvre et les capacités financières disponibles.

## À retenir

Le choix des reproducteurs doit être réfléchi comme une décision de long terme.
        `,
        image_url:
          "/images/education/cours/reproducteurs-porcs.jpg",
        position: 2,
        published: true,
      },

      {
        title: "Construire et aménager la porcherie",
        slug: "construire-amenager-porcherie",
        introduction:
          "Découvrir les principes d’organisation d’une porcherie fonctionnelle et facile à entretenir.",
        content: `
# Construire et aménager la porcherie

Le bâtiment doit protéger les animaux et permettre à l'éleveur de travailler efficacement.

## Une organisation pratique

L'aménagement doit faciliter :

- l'alimentation ;
- l'abreuvement ;
- le nettoyage ;
- l'observation ;
- la séparation des animaux ;
- la gestion des différentes catégories.

## Hygiène

La facilité de nettoyage doit être prise en compte dès la conception.

## À retenir

Un bon bâtiment facilite le travail quotidien et contribue à une meilleure organisation de l'élevage.
        `,
        image_url:
          "/images/education/cours/porcherie.jpg",
        position: 3,
        published: true,
      },

      {
        title: "Alimentation des porcs",
        slug: "alimentation-porcs",
        introduction:
          "Comprendre les principes d’une alimentation organisée selon les besoins des animaux.",
        content: `
# Alimentation des porcs

L'alimentation représente une part importante des coûts d'un élevage porcin.

## Adapter l'alimentation

Les besoins évoluent selon l'âge et le stade de production.

L'éleveur doit donc organiser les rations et suivre la consommation.

## Contrôler les coûts

Les quantités distribuées et les dépenses doivent être enregistrées.

## Observer

La consommation et l'état général des animaux doivent être régulièrement observés.

## À retenir

Une bonne alimentation doit répondre aux besoins des animaux tout en restant économiquement maîtrisée.
        `,
        image_url:
          "/images/education/cours/alimentation-porcs.jpg",
        position: 4,
        published: true,
      },

      {
        title: "Reproduction et gestion des truies",
        slug: "reproduction-gestion-truies",
        introduction:
          "Comprendre les bases de l’organisation de la reproduction et du suivi des truies.",
        content: `
# Reproduction et gestion des truies

La reproduction est un élément central d'un élevage orienté vers la production de porcelets.

## Organiser le suivi

L'éleveur doit conserver les informations relatives aux reproductrices et aux événements importants.

## Observer

L'observation permet de suivre les différentes étapes et de mieux organiser les interventions.

## Tenir des registres

Les dates et résultats doivent être enregistrés afin de faciliter le pilotage du cheptel.

## À retenir

Une reproduction bien suivie permet de mieux planifier la production.
        `,
        image_url:
          "/images/education/cours/reproduction-truies.jpg",
        position: 5,
        published: true,
      },

      {
        title: "Suivi sanitaire et hygiène",
        slug: "suivi-sanitaire-hygiene-porcs",
        introduction:
          "Comprendre l’importance de l’hygiène, de l’observation et du suivi sanitaire dans un élevage porcin.",
        content: `
# Suivi sanitaire et hygiène

L'hygiène et l'observation sont essentielles dans un élevage.

## Nettoyage

Les bâtiments et équipements doivent être entretenus régulièrement.

## Observation

L'éleveur doit être attentif aux changements de comportement, d'appétit ou d'état général.

## Prévention

La prévention repose notamment sur une bonne organisation, une hygiène régulière et un suivi adapté.

## À retenir

La prévention commence par une bonne routine quotidienne.
        `,
        image_url:
          "/images/education/cours/hygiene-porcherie.jpg",
        position: 6,
        published: true,
      },

      {
        title: "Croissance et gestion du cheptel",
        slug: "croissance-gestion-cheptel-porcin",
        introduction:
          "Apprendre à suivre les performances des animaux et à organiser les données du cheptel.",
        content: `
# Croissance et gestion du cheptel

Le suivi permet de comprendre l'évolution du cheptel et de prendre de meilleures décisions.

## Les données à suivre

L'éleveur peut enregistrer :

- les effectifs ;
- les naissances ;
- les pertes ;
- les ventes ;
- l'alimentation ;
- les observations.

## Utiliser les données

Ces informations permettent de suivre les performances et de calculer les coûts.

## À retenir

La gestion d'un cheptel repose sur des informations fiables et régulièrement mises à jour.
        `,
        image_url:
          "/images/education/cours/suivi-cheptel-porcin.jpg",
        position: 7,
        published: true,
      },

      {
        title: "Commercialiser les porcs",
        slug: "commercialiser-porcs",
        introduction:
          "Comprendre les principales étapes de préparation et d’organisation de la commercialisation.",
        content: `
# Commercialiser les porcs

La vente doit être préparée avant d'arriver au moment de la sortie des animaux.

## Identifier son marché

L'éleveur doit connaître ses clients potentiels et leurs besoins.

## Calculer son prix

Le prix doit tenir compte des coûts de production et des conditions du marché.

## Organiser la vente

La logistique, les quantités disponibles et les dates doivent être anticipées.

## À retenir

Une production bien vendue commence par une commercialisation préparée.
        `,
        image_url:
          "/images/education/cours/commercialisation-porcs.jpg",
        position: 8,
        published: true,
      },
    ],
  },

  {
    title: "Aviculture",
    slug: "aviculture",
    description:
      "Les bases pour comprendre et organiser un élevage de volailles.",
    image_url: "/images/education/modules/aviculture.jpg",
    position: 3,
    published: true,

    lessons: [
      {
        title: "Introduction à l’aviculture",
        slug: "introduction-aviculture",
        introduction:
          "Découvrir les principes fondamentaux de l’élevage des volailles.",
        content: `
# Introduction à l’aviculture

L'aviculture regroupe les activités d'élevage des volailles.

Elle peut concerner différentes orientations de production selon les objectifs de l'exploitation.

## Les éléments essentiels

Un élevage avicole nécessite :

- un bâtiment adapté ;
- des animaux de qualité ;
- une alimentation appropriée ;
- de l'eau ;
- une bonne hygiène ;
- un suivi régulier ;
- une organisation commerciale.

## À retenir

La réussite d'un élevage commence par une organisation adaptée aux objectifs de production.
        `,
        image_url:
          "/images/education/cours/introduction-aviculture.jpg",
        position: 1,
        published: true,
      },

      {
        title: "Choisir son type d’élevage",
        slug: "choisir-type-elevage-avicole",
        introduction:
          "Comprendre les différences entre les principaux objectifs d’un élevage avicole.",
        content: `
# Choisir son type d’élevage

Avant de construire un poulailler, il faut déterminer ce que l'on souhaite produire.

## Définir son objectif

L'exploitation peut être orientée vers différentes productions.

Le choix influence :

- les bâtiments ;
- les animaux ;
- l'alimentation ;
- la durée du cycle ;
- les investissements ;
- le marché.

## À retenir

L'objectif de production doit être défini avant de dimensionner l'exploitation.
        `,
        image_url:
          "/images/education/cours/type-elevage-avicole.jpg",
        position: 2,
        published: true,
      },

      {
        title: "Préparer le poulailler",
        slug: "preparer-poulailler",
        introduction:
          "Découvrir les éléments essentiels pour aménager un environnement adapté aux volailles.",
        content: `
# Préparer le poulailler

Le poulailler doit offrir un environnement adapté et permettre un entretien efficace.

## Les éléments importants

Il faut notamment prévoir :

- un espace adapté ;
- une bonne organisation ;
- des équipements accessibles ;
- un nettoyage facile ;
- une protection des animaux.

## À retenir

Un poulailler bien conçu facilite la gestion quotidienne et l'entretien.
        `,
        image_url:
          "/images/education/cours/poulailler.jpg",
        position: 3,
        published: true,
      },

      {
        title: "Accueillir les poussins",
        slug: "accueillir-poussins",
        introduction:
          "Comprendre les précautions à prendre lors de l’arrivée des poussins.",
        content: `
# Accueillir les poussins

L'arrivée des poussins constitue une étape importante du cycle d'élevage.

## Préparer avant leur arrivée

Le bâtiment et les équipements doivent être préparés à l'avance.

Il faut notamment vérifier :

- la propreté ;
- l'accès à l'eau ;
- l'alimentation ;
- les équipements ;
- les conditions générales du bâtiment.

## Observer

Les poussins doivent être régulièrement observés afin d'identifier rapidement les anomalies.

## À retenir

Une bonne préparation avant l'arrivée facilite le démarrage du cycle.
        `,
        image_url:
          "/images/education/cours/poussins.jpg",
        position: 4,
        published: true,
      },

      {
        title: "Alimentation des volailles",
        slug: "alimentation-volailles",
        introduction:
          "Comprendre les principes d’une alimentation adaptée aux différents stades de production.",
        content: `
# Alimentation des volailles

L'alimentation influence directement les performances d'un élevage.

## Adapter les besoins

Les besoins alimentaires évoluent selon le stade de développement et l'objectif de production.

## Suivre la consommation

La consommation doit être suivie afin de détecter les changements et de contrôler les coûts.

## À retenir

Une alimentation organisée doit répondre aux besoins des animaux tout en restant économiquement maîtrisée.
        `,
        image_url:
          "/images/education/cours/alimentation-volailles.jpg",
        position: 5,
        published: true,
      },

      {
        title: "Hygiène et prévention",
        slug: "hygiene-prevention-aviculture",
        introduction:
          "Comprendre pourquoi l’hygiène et la prévention sont essentielles dans un élevage avicole.",
        content: `
# Hygiène et prévention

La prévention commence par une bonne organisation de l'environnement d'élevage.

## Nettoyer régulièrement

Les bâtiments et équipements doivent être entretenus.

## Observer les animaux

Tout changement inhabituel doit attirer l'attention de l'éleveur.

## Organiser les opérations

Les routines d'entretien et de suivi doivent être planifiées.

## À retenir

Une bonne hygiène est une responsabilité quotidienne.
        `,
        image_url:
          "/images/education/cours/hygiene-aviculture.jpg",
        position: 6,
        published: true,
      },

      {
        title: "Suivi de croissance et production",
        slug: "suivi-croissance-production-avicole",
        introduction:
          "Apprendre à suivre les performances et les données importantes d’un élevage avicole.",
        content: `
# Suivi de croissance et production

Le suivi permet de mesurer les performances de l'exploitation.

## Les données

Il est utile de suivre :

- les effectifs ;
- les pertes ;
- la consommation ;
- la croissance ;
- la production ;
- les ventes.

## Pourquoi suivre ?

Les données permettent de comparer les résultats et d'identifier les points à améliorer.

## À retenir

Ce qui est mesuré peut être mieux géré.
        `,
        image_url:
          "/images/education/cours/suivi-production-avicole.jpg",
        position: 7,
        published: true,
      },

      {
        title: "Vente et commercialisation",
        slug: "vente-commercialisation-volailles",
        introduction:
          "Comprendre comment préparer la vente et organiser la commercialisation d’une production avicole.",
        content: `
# Vente et commercialisation

La commercialisation doit être préparée avant la fin du cycle.

## Identifier les clients

Il faut connaître les clients ciblés et leurs habitudes d'achat.

## Préparer les ventes

Les quantités disponibles, les prix et les dates doivent être anticipés.

## Suivre les résultats

Les ventes doivent être enregistrées afin de mesurer les performances économiques.

## À retenir

Une bonne commercialisation transforme la production en chiffre d'affaires.
        `,
        image_url:
          "/images/education/cours/commercialisation-aviculture.jpg",
        position: 8,
        published: true,
      },
    ],
  },

  {
    title: "Gestion d’une exploitation agricole",
    slug: "gestion-exploitation-agricole",
    description:
      "Les fondamentaux de la gestion, du suivi des coûts, des stocks et de la commercialisation d’une exploitation.",
    image_url: "/images/education/modules/gestion-exploitation.jpg",
    position: 4,
    published: true,

    lessons: [
      {
        title: "Comprendre son exploitation",
        slug: "comprendre-exploitation-agricole",
        introduction:
          "Apprendre à identifier les ressources, activités, charges et objectifs de son exploitation.",
        content: `
# Comprendre son exploitation

Une exploitation agricole est à la fois un outil de production et une activité économique.

## Identifier ses ressources

Il faut connaître :

- les terres ;
- les bâtiments ;
- les équipements ;
- les animaux ;
- les stocks ;
- la main-d'œuvre ;
- les ressources financières.

## Identifier ses activités

L'exploitation peut avoir une ou plusieurs activités.

Il est important de connaître la contribution de chacune.

## À retenir

Une bonne gestion commence par une bonne connaissance de son exploitation.
        `,
        image_url:
          "/images/education/cours/comprendre-exploitation.jpg",
        position: 1,
        published: true,
      },

      {
        title: "Construire son plan de production",
        slug: "plan-production-agricole",
        introduction:
          "Apprendre à organiser les activités de production selon les ressources et les objectifs.",
        content: `
# Construire son plan de production

Un plan de production permet d'organiser les activités dans le temps.

## Définir les objectifs

Il faut déterminer ce que l'exploitation souhaite produire et en quelles quantités.

## Prévoir les ressources

Les besoins en alimentation, matériel, main-d'œuvre et financement doivent être anticipés.

## Organiser le calendrier

Les principales opérations doivent être réparties dans le temps.

## À retenir

Planifier permet de réduire les improvisations et de mieux utiliser les ressources.
        `,
        image_url:
          "/images/education/cours/plan-production.jpg",
        position: 2,
        published: true,
      },

      {
        title: "Calculer ses coûts",
        slug: "calculer-couts-exploitation",
        introduction:
          "Comprendre comment identifier et suivre les différents coûts d’une exploitation agricole.",
        content: `
# Calculer ses coûts

Connaître ses coûts est indispensable pour prendre de bonnes décisions.

## Les charges

Il faut identifier les différentes dépenses liées à la production.

Elles peuvent concerner notamment :

- les animaux ;
- l'alimentation ;
- les équipements ;
- la main-d'œuvre ;
- le transport ;
- l'entretien.

## Pourquoi calculer ?

Sans connaître ses coûts, il est difficile de déterminer correctement son prix de vente et sa rentabilité.

## À retenir

Chaque activité doit être suivie financièrement.
        `,
        image_url:
          "/images/education/cours/calcul-couts.jpg",
        position: 3,
        published: true,
      },

      {
        title: "Gérer ses stocks",
        slug: "gerer-stocks-exploitation",
        introduction:
          "Apprendre à organiser le suivi des aliments, produits, équipements et autres stocks.",
        content: `
# Gérer ses stocks

Une bonne gestion des stocks évite les ruptures, les pertes et les achats mal planifiés.

## Identifier les stocks

Il faut connaître les produits disponibles et leur quantité.

## Enregistrer les mouvements

Chaque entrée et sortie importante doit être suivie.

## Prévoir les besoins

Les stocks doivent être contrôlés régulièrement afin d'anticiper les prochains besoins.

## À retenir

Un stock bien suivi permet de mieux contrôler les coûts.
        `,
        image_url:
          "/images/education/cours/gestion-stocks.jpg",
        position: 4,
        published: true,
      },

      {
        title: "Suivre ses recettes et dépenses",
        slug: "suivre-recettes-depenses",
        introduction:
          "Comprendre comment enregistrer les entrées et sorties d’argent de l’exploitation.",
        content: `
# Suivre ses recettes et dépenses

Une exploitation doit conserver une trace de ses opérations financières.

## Les dépenses

Toutes les dépenses importantes doivent être enregistrées.

## Les recettes

Les ventes et autres revenus doivent également être suivis.

## Pourquoi ?

Le rapprochement entre recettes et dépenses permet de mieux comprendre la situation financière.

## À retenir

Une gestion financière simple mais régulière vaut mieux qu'une gestion basée sur la mémoire.
        `,
        image_url:
          "/images/education/cours/recettes-depenses.jpg",
        position: 5,
        published: true,
      },

      {
        title: "Calculer sa rentabilité",
        slug: "calculer-rentabilite-exploitation",
        introduction:
          "Apprendre à analyser les résultats économiques d’une activité agricole.",
        content: `
# Calculer sa rentabilité

La rentabilité permet d'évaluer les résultats économiques d'une activité.

## Comparer recettes et coûts

Il faut connaître les revenus générés et les charges supportées.

## Analyser les résultats

L'objectif est d'identifier ce qui fonctionne et ce qui doit être amélioré.

## Prendre des décisions

Les résultats peuvent aider à décider d'augmenter, réduire ou réorganiser une activité.

## À retenir

Produire beaucoup ne signifie pas nécessairement gagner beaucoup.

La rentabilité doit être mesurée.
        `,
        image_url:
          "/images/education/cours/rentabilite.jpg",
        position: 6,
        published: true,
      },

      {
        title: "Organiser sa commercialisation",
        slug: "organiser-commercialisation-agricole",
        introduction:
          "Découvrir comment organiser ses produits, ses clients et ses canaux de vente.",
        content: `
# Organiser sa commercialisation

La production doit être pensée en fonction du marché.

## Identifier ses clients

Il faut connaître les personnes ou entreprises susceptibles d'acheter.

## Définir son offre

Le produit, le prix, la présentation et les conditions de vente doivent être cohérents.

## Choisir ses canaux

L'exploitation peut utiliser différents canaux selon son marché.

## Suivre les ventes

Les ventes doivent être enregistrées afin de mesurer les résultats.

## À retenir

La commercialisation doit être préparée aussi sérieusement que la production.
        `,
        image_url:
          "/images/education/cours/commercialisation-agricole.jpg",
        position: 7,
        published: true,
      },

      {
        title: "Développer son exploitation",
        slug: "developper-exploitation-agricole",
        introduction:
          "Apprendre à réfléchir au développement progressif d’une exploitation agricole.",
        content: `
# Développer son exploitation

Développer une exploitation ne signifie pas simplement augmenter sa production.

## Avant de grandir

Il faut d'abord vérifier que les activités existantes sont correctement maîtrisées.

## Investir progressivement

Les nouveaux investissements doivent être cohérents avec les capacités financières et commerciales.

## Mesurer avant de décider

Les résultats précédents doivent servir de base aux nouvelles décisions.

## Diversifier avec méthode

Plusieurs activités peuvent être complémentaires, mais chacune doit être suivie.

## À retenir

Le développement durable d'une exploitation repose sur une croissance maîtrisée, des données fiables et des décisions réfléchies.
        `,
        image_url:
          "/images/education/cours/developpement-exploitation.jpg",
        position: 8,
        published: true,
      },
    ],
  },
];

export const EDUCATION_MODULES_COUNT = educationDefaults.length;

export const EDUCATION_LESSONS_COUNT = educationDefaults.reduce(
  (total, module) => total + module.lessons.length,
  0
);
