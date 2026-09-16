# Agrofarms237 — V2 (Next.js + Supabase)

Site multi-pages avec commandes et demandes partenaires enregistrées en base,
et un espace admin pour gérer prix/stock, commandes, partenaires et actualités.

## 1. Créer le projet Supabase (gratuit)

1. Va sur https://supabase.com → New project
2. Une fois le projet créé, ouvre **SQL Editor** et colle le contenu de
   `supabase/schema.sql`, puis exécute-le (bouton Run). Cela crée toutes les
   tables (produits, commandes, partenaires, actualités, avis).
3. Va dans **Project Settings → API**, note :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` key (⚠️ secrète, jamais dans le code public) → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Configurer les variables d'environnement

Copie `.env.example` en `.env.local` et remplis les valeurs :

```
cp .env.example .env.local
```

- `ADMIN_PASSWORD` : choisis un mot de passe pour l'accès à `/admin`
- `WHATSAPP_NUMBER` / `WHATSAPP_TEL` : déjà pré-remplis avec les contacts Agrofarms237

## 3. Installer et lancer en local

```
npm install
npm run dev
```

Le site est disponible sur http://localhost:3000, l'admin sur
http://localhost:3000/admin (login avec `ADMIN_PASSWORD`).

## 4. Déployer en ligne (Vercel — gratuit pour démarrer)

1. Pousse ce dossier sur un dépôt GitHub
2. Va sur https://vercel.com → New Project → importe le dépôt
3. Dans les réglages du projet Vercel, ajoute les mêmes variables que dans
   `.env.local` (Settings → Environment Variables)
4. Déploie. Vercel te donne une URL (ex. `agrofarms237.vercel.app`)
5. Connecte ensuite ton nom de domaine `agrofarms237.com` dans
   Vercel → Settings → Domains, et mets à jour les DNS chez ton registrar.

## Ce qui est déjà fonctionnel

- Pages séparées : `/`, `/produits`, `/notre-elevage`, `/professionnels`,
  `/partenaires`, `/contact`, `/la-vie-de-la-ferme`, `/galerie`, `/commander`
- Commande : le formulaire écrit une ligne dans la table `orders`, puis ouvre
  WhatsApp avec le message prérempli
- Partenaires : le formulaire écrit une ligne dans `partner_requests`
- Admin (`/admin`, protégé par mot de passe) :
  - **Commandes** : liste en direct, changement de statut (Nouveau → Contacté →
    Confirmé → Livré → Annulé)
  - **Produits** : modifier prix, seuil volume, statut de stock, prochaine
    disponibilité — répercuté immédiatement sur le site public
  - **Partenaires** : liste des demandes, changement de statut
  - **Actualités** : publier un article, visible aussitôt sur
    `/la-vie-de-la-ferme`
  - **Textes du site** : modifier le texte sous le slogan de l'accueil,
    « Notre histoire », et les intros des pages Professionnels/Partenaires
  - **Galerie** : uploader des photos/vidéos (stockées dans Supabase
    Storage), les publier/dépublier, les supprimer — visibles sur `/galerie`
  - **Avis** : retranscrire un avis reçu par téléphone/WhatsApp, le publier
    ou non — les avis publiés apparaissent sur l'accueil

## Étape supplémentaire pour la Galerie : créer le bucket de stockage

Le fichier `supabase/schema.sql` contient déjà la commande qui crée le bucket
public `media` (`insert into storage.buckets ...`). Si tu l'exécutes en une
fois, tout est en place. Si ton projet Supabase existait déjà avant cette
mise à jour, ré-exécute simplement les dernières lignes du fichier (section
« Mise à jour : contenu éditable, galerie/médias »).

## Ce qui reste à faire (volontairement laissé de côté pour rester livrable)

- Réorganiser l'ordre des photos dans la galerie par glisser-déposer (pour
  l'instant, ordre par date d'ajout)
- Version anglaise (l'architecture Next.js le permet sans tout refaire —
  via un sous-dossier `app/en/` ou next-intl)
- Design plus poussé sur les pages secondaires (produits, professionnels,
  contact) — l'accueil et la commande sont les plus travaillées

## Design

Palette et typographies reprises de la V1 (teal profond / or / sable,
Fraunces + Manrope) — cohérent avec le premier fichier livré.
