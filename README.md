# Construction AVQ inc. — site web

Site vitrine de **Construction AVQ inc.**, entrepreneur général québécois spécialisé en
**carrelage, gestion et gérance de chantier**.

> **Construire avec rigueur. Réaliser avec précision.**
> Construction • Rénovation • Carrelage • Gestion de chantier

Site statique, **sans dépendance ni étape de compilation** : du HTML, une feuille de style et un
fichier JavaScript. Il se dépose tel quel sur n’importe quel hébergement (Netlify, Vercel, GitHub
Pages, OVH, cPanel…).

---

## 1. Démarrer

Aucune installation n’est nécessaire. Ouvrir `index.html` dans un navigateur suffit pour consulter
le site. Pour un rendu identique à la production (chemins relatifs, formulaires) :

```bash
npx http-server -p 8080 .     # ou : python3 -m http.server 8080
```

Puis ouvrir <http://localhost:8080>.

---

## 2. Structure

```
.
├── index.html                     Accueil
├── services.html                  Vue d’ensemble des services
├── carrelage.html                 Carrelage (spécialité)
├── gestion-de-chantier.html       Gestion et gérance de chantier
├── construction-renovation.html   Construction et rénovation
├── realisations.html              Galerie de projets + avant/après
├── processus.html                 Le parcours client en 6 étapes
├── a-propos.html                  À propos, mission et vision
├── contact.html                   Coordonnées, formulaire, carte du territoire
├── soumission.html                Demande de soumission (formulaire complet)
├── merci.html                     Confirmation après envoi
├── 404.html                       Page d’erreur
├── robots.txt / sitemap.xml       Référencement
├── site.webmanifest               Métadonnées d’application
└── assets/
    ├── css/style.css              Feuille de style unique (design system)
    ├── js/main.js                 Interactions (menu, galerie, formulaires…)
    └── img/*.svg                  Illustrations
```

---

## 3. À personnaliser avant la mise en ligne

Les coordonnées du site sont des **valeurs provisoires**. Elles apparaissent dans chaque page
(en-tête, pied de page, formulaires, données structurées) ; une recherche-remplacement globale
suffit.

| À remplacer | Valeur provisoire actuelle |
|---|---|
| Domaine (balises `canonical`, `og:url`, `sitemap.xml`, `robots.txt`) | `https://www.constructionavq.ca` — **à confirmer** |
| Adresse postale complète | `Montréal (Québec)` |

Les coordonnées suivantes sont les **valeurs réelles** de l’entreprise :

| Donnée | Valeur |
|---|---|
| Téléphone | `514 404-7273` (lien `tel:+15144047273`) |
| Courriel | `ardavuralavq@constructionavq.ca` |
| Licence RBQ | `5880-6043-01` |

```bash
# exemple de remplacement global (macOS/Linux)
grep -rl "www.constructionavq.ca" . --include=*.html | xargs sed -i '' 's|www.constructionavq.ca|VOTRE-DOMAINE.ca|g'
```

La **licence RBQ `5880-6043-01`** est en place : affichée dans le pied de page de chaque page,
mise en évidence sur la page *Contact* et déclarée dans les données structurées de l’entreprise
(`identifier` du schéma `GeneralContractor`).

---

### Liens courriel

Toutes les adresses affichées sur le site sont des liens `mailto:`. Un clic ouvre le logiciel de
messagerie du visiteur avec **l’adresse déjà inscrite dans le champ « À »** et un **objet
prérempli** adapté à l’endroit du site où le lien a été cliqué :

| Emplacement | Objet prérempli |
|---|---|
| Pied de page | `Question — Construction AVQ inc.` |
| Menu mobile, page Contact | `Demande d’information — Construction AVQ inc.` |
| Encadré de la page Soumission | `Demande de soumission — Construction AVQ inc.` |

Le comportement dépend du poste du visiteur : le lien ouvre l’application définie comme
**gestionnaire de courriel par défaut** (Mail, Outlook, Thunderbird…). Un visiteur qui utilise
Gmail dans un navigateur sans l’avoir déclaré comme gestionnaire par défaut ne verra rien
s’ouvrir — c’est une limite du protocole `mailto:`, commune à tous les sites web. C’est
précisément pourquoi le formulaire de soumission reste le canal principal : il ne dépend
d’aucune configuration côté visiteur.

## 4. Brancher les formulaires

Les formulaires (`contact.html` et `soumission.html`) sont fonctionnels côté navigateur
(validation, pièces jointes, anti-pourriel) mais **ne sont reliés à aucun service d’envoi**.
Tant qu’aucun service n’est configuré, l’envoi ouvre le logiciel de messagerie du visiteur avec une
demande préremplie — rien n’est perdu, mais un vrai service est recommandé.

### Option A — Netlify Forms (si hébergé sur Netlify)

Ajouter sur chaque balise `<form>` : `netlify` et `netlify-honeypot="_confirmation"`, puis
remplacer `action="#VOTRE-ENDPOINT"` par `action="/merci.html"`.

### Option B — Formspree, Web3Forms, Basin…

Remplacer l’attribut `action` du formulaire par l’adresse fournie par le service :

```html
<form class="form" data-form id="form-soumission" method="post"
      action="https://formspree.io/f/VOTRE_ID" enctype="multipart/form-data" novalidate>
```

Le script détecte automatiquement qu’un service est configuré (dès que `action` ne contient plus
`VOTRE-ENDPOINT`) et laisse l’envoi se faire normalement. Rediriger ensuite vers `merci.html`.

Le champ caché `_confirmation` est un **pot de miel** anti-pourriel : il doit rester vide et être
déclaré comme tel auprès du service choisi.

---

## 5. Remplacer les illustrations par de vraies photos

Les visuels de `assets/img/` sont des **illustrations vectorielles générées** (chantier, carrelage,
plans, textures). Elles tiennent lieu de photographies en attendant les images réelles de
l’entreprise, qui donneront au site toute sa crédibilité.

Pour les remplacer, déposer les fichiers sous le **même nom** (l’extension peut changer) et ajuster
les `src` correspondants :

| Fichier | Usage | Format conseillé |
|---|---|---|
| `hero-chantier.svg` | Bannière d’accueil | paysage, 1920 × 1080 |
| `chantier-nuit.svg` | Fonds d’appels à l’action | paysage |
| `carrelage-grand-format.svg` | Carrelage grand format | paysage |
| `salle-de-bain.svg`, `douche-detail.svg` | Salles de bain, douches | portrait, 1200 × 1500 |
| `carrelage-mosaique.svg`, `carrelage-chevron.svg` | Détails de pose | paysage |
| `gestion-chantier.svg`, `planification.svg` | Plans, échéanciers | paysage |
| `equipe-chantier.svg` | Intervenants sur chantier | paysage |
| `facade-moderne.svg`, `architecture-jour.svg` | Architecture | paysage |
| `avant-1..4.svg` / `apres-1..4.svg` | Comparateurs avant/après | **même cadrage pour la paire** |

Conseils : privilégier des photos de chantier réelles et des détails de finition plutôt que des
images génériques de maisons ; conserver un poids raisonnable (WebP ou JPEG optimisé, < 300 Ko) ;
toujours renseigner l’attribut `alt`.

---

## 6. Ajouter un projet à la galerie

Dans `realisations.html`, dupliquer un bloc `<button class="projet">` et adapter ses attributs
`data-*` — le script alimente la fiche détaillée à partir d’eux :

```html
<button class="projet" type="button"
        data-cats="carrelage salles-de-bain"        <!-- catégories de filtrage -->
        data-titre="Nom du projet"
        data-categorie="Carrelage · Salle de bain"
        data-type="Rénovation résidentielle"
        data-services="Liste des services réalisés"
        data-lieu="Ville (Québec)"
        data-duree="Environ 3 semaines"
        data-description="Description complète du projet."
        data-avant="assets/img/avant-1.svg"
        data-apres="assets/img/apres-1.svg">
  …
</button>
```

Catégories disponibles : `carrelage`, `salles-de-bain`, `renovation`, `construction`, `chantier`,
`gestion-de-projet`.

---

## 7. Référencement (SEO)

Chaque page comporte un titre et une description uniques (dans les longueurs recommandées),
une URL canonique, des balises Open Graph et Twitter, et des **données structurées JSON-LD** :

- `GeneralContractor` (entreprise, services, territoire, horaires) sur l’accueil ;
- `Service` sur chaque page de service ;
- `BreadcrumbList` sur les pages intérieures ;
- `FAQPage` sur *Services* et *Processus* ;
- `HowTo` sur *Notre processus*.

Mots-clés visés : entrepreneur général Montréal / Québec, construction et rénovation Montréal,
carrelage et pose de céramique Montréal, carreleur Montréal, gestion et gérance de chantier,
gestion de projet construction, entrepreneur construction résidentielle et commerciale.

**Après la mise en ligne** : mettre à jour le domaine (§3), soumettre `sitemap.xml` dans Google
Search Console et créer une fiche Google Business Profile avec les mêmes coordonnées que le site
(nom, adresse, téléphone strictement identiques).

---

## 8. Design

Le système visuel est centralisé dans les variables CSS en tête de `assets/css/style.css` :

| Variable | Valeur | Usage |
|---|---|---|
| `--noir` | `#0E0F11` | fonds sombres, sections d’accent |
| `--anthracite` / `--graphite` | `#16181C` / `#22252A` | surfaces secondaires |
| `--gris` / `--gris-pale` | `#6E7378` / `#F4F5F6` | textes secondaires, fonds clairs |
| `--accent` | `#C08A4A` | bronze — couleur d’accent unique |
| `--accent-fort` | `#A6712F` | accent sur fond clair (contraste du texte) |

Typographie : **Archivo** pour les titres, **Inter** pour le texte courant (chargées depuis Google
Fonts, avec repli sur les polices système). Animations volontairement discrètes et intégralement
neutralisées si le visiteur a activé « réduire les animations ».

---

## 9. Compatibilité et accessibilité

- Testé de 360 px à 1920 px : aucun débordement horizontal.
- Navigation clavier complète, lien d’évitement, `aria-*` sur le menu, la galerie modale et le
  comparateur avant/après, points de contact tactiles conformes sur mobile.
- Barre d’action fixe sur mobile gardant « Soumission » toujours accessible.
- Le site reste lisible sans JavaScript (contenu, navigation et formulaires en dégradation
  gracieuse) ; seuls les filtres, la fiche projet et le comparateur nécessitent JS.
