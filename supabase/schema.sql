-- Agrofarms237 — schéma Supabase
-- À exécuter dans l'éditeur SQL de ton projet Supabase (Database > SQL Editor)

create extension if not exists "uuid-ossp";

-- ─── Produits (prix, stock, disponibilité — modifiables depuis /admin/produits) ───
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  price_standard integer not null,       -- FCFA/kg, 1 à 29 kg
  price_bulk integer not null,           -- FCFA/kg, à partir de bulk_min_kg
  bulk_min_kg integer not null default 30,
  stock_status text not null default 'disponible', -- disponible | stock_limite | indisponible
  next_availability text,                -- texte libre, ex: "à partir du 20 octobre"
  updated_at timestamptz not null default now()
);

insert into products (name, price_standard, price_bulk, bulk_min_kg, stock_status)
values ('Silure frais', 2500, 2400, 30, 'disponible')
on conflict do nothing;

-- ─── Commandes ───
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  product_name text not null,
  quantity_kg integer not null,
  unit_price integer not null,
  total_price integer not null,
  client_type text not null,
  client_name text not null,
  delivery_mode text not null,
  delivery_location text,
  phone text not null,
  status text not null default 'nouveau' -- nouveau | contacte | confirme | livre | annule
);

-- ─── Demandes partenaires / investisseurs ───
create table if not exists partner_requests (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  full_name text not null,
  organization text,
  phone text not null,
  email text not null,
  partnership_type text not null,
  amount_interest text,
  message text,
  status text not null default 'nouveau' -- nouveau | contacte | en_discussion | dossier_envoye | conclu | non_retenu
);

-- ─── Actualités ("La vie de la ferme") ───
create table if not exists news_posts (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  title text not null,
  body text not null,
  published boolean not null default true
);

-- ─── Avis clients ───
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  author_name text not null,
  client_type text,
  content text not null,
  published boolean not null default false
);

-- ─── Sécurité (RLS) ───
-- Ces tables ne sont lues/écrites que via les routes API Next.js, qui utilisent
-- la service_role key côté serveur (jamais exposée au navigateur). Aucune policy
-- anonyme n'est créée : l'accès public par défaut reste verrouillé.
alter table products enable row level security;
alter table orders enable row level security;
alter table partner_requests enable row level security;
alter table news_posts enable row level security;
alter table reviews enable row level security;

-- Optionnel : pour lire news/avis publiés directement depuis le navigateur
-- sans passer par une route API, décommente :
-- create policy "public read published news" on news_posts for select using (published = true);
-- create policy "public read published reviews" on reviews for select using (published = true);

-- ─── Mise à jour : contenu éditable, galerie/médias ───
-- (à exécuter après le schéma initial si le projet Supabase existe déjà)

create table if not exists site_content (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

insert into site_content (key, value) values
  ('hero_lead', 'Une production agricole camerounaise pensée pour offrir des produits frais, accessibles et suivis directement depuis la ferme — à Yaoundé, Mimboman.'),
  ('histoire_texte', E'Agrofarms237 est née d''une volonté simple : produire au Cameroun des aliments de qualité, accessibles et issus d''une production locale maîtrisée.\n\nL''aventure commence avec l''élevage de silures à Yaoundé, avec l''ambition de construire progressivement une véritable entreprise agricole camerounaise.\n\nNotre objectif est de créer une marque proche de ses clients, transparente sur ses produits et capable de répondre aussi bien aux besoins des familles qu''à ceux des restaurants et des poissonneries.'),
  ('professionnels_intro', 'Un tarif dégressif à partir de 30 kg, une livraison organisée et la possibilité de mettre en place des commandes récurrentes.'),
  ('partenaires_intro', 'Agrofarms237 développe sa production et prépare ses futures gammes. Nous sommes ouverts aux échanges avec des partenaires qui partagent cette vision d''une agriculture camerounaise structurée.')
on conflict (key) do nothing;

alter table site_content enable row level security;

create table if not exists media (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  url text not null,
  storage_path text not null,
  kind text not null default 'photo',   -- photo | video
  category text,                        -- ex: bassins, recolte, livraison
  caption text,
  published boolean not null default true,
  position integer not null default 0
);

alter table media enable row level security;

-- Bucket de stockage public pour les photos/vidéos (upload fait uniquement
-- depuis /admin via la service_role key, donc pas besoin de policy d'écriture).
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
