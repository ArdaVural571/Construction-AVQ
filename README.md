# Construction AVQ inc. — site web

Site vitrine de **Construction AVQ inc.**, entrepreneur général québécois spécialisé en
**carrelage, gestion et gérance de chantier**.

> **Bâtir avec vision. Réaliser avec précision.**
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

## 3. Coordonnées

Les coordonnées apparaissent dans chaque page (en-tête, pied de page, formulaires, données
structurées). Elles sont centralisées : une recherche-remplacement globale suffit à les faire
évoluer.

Un seul élément reste générique : l’**adresse postale**, indiquée `Montréal (Québec)`. La préciser
(rue, ville, code postal) renforcerait le référencement local, notamment en vue d’une fiche Google
Business Profile. À faire seulement si vous acceptez de rendre cette adresse publique.

Toutes les autres valeurs sont celles de l’entreprise :

| Donnée | Valeur |
|---|---|
| Domaine officiel | `https://constructionavq.ca` (sans `www`) |
| Téléphone | `514 404-7273` (lien `tel:+15144047273`) |
| Courriel | `ardavuralavq@constructionavq.ca` |
| Licence RBQ | `5880-6043-01` |

Le domaine officiel est celui qui figure dans les balises `canonical`, les métadonnées Open Graph,
`sitemap.xml` et `robots.txt`. **Configurer chez l’hébergeur une redirection permanente (301) de
`www.constructionavq.ca` vers `constructionavq.ca`** : sans elle, les moteurs de recherche voient
deux sites identiques et répartissent le référencement entre les deux.

### Mettre le site en ligne sur ce domaine

Le domaine n’a pas à être « transféré » : il reste chez votre registraire actuel. Il suffit de
pointer ses enregistrements DNS vers l’hébergement choisi.

1. Déposer le contenu de ce dépôt chez un hébergeur (Netlify, Vercel, GitHub Pages, ou tout
   hébergement web classique par FTP — le site est statique, aucun serveur applicatif requis).
2. Dans le panneau du registraire, remplacer les enregistrements DNS du domaine par ceux que
   fournit l’hébergeur (généralement un enregistrement `A` pour `constructionavq.ca` et un
   `CNAME` pour `www`).
3. Activer le certificat HTTPS (gratuit et automatique chez la plupart des hébergeurs).
4. Vérifier que `www` redirige bien vers la version sans `www`.

La propagation DNS prend de quelques minutes à 24 heures.

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

## 4. Les formulaires

Les deux formulaires (`contact.html` et `soumission.html`) sont **branchés sur Netlify Forms**.
Aucun service tiers, aucun compte supplémentaire : dès que le site est déployé sur Netlify, les
demandes arrivent dans le tableau de bord (onglet *Forms*) et une notification peut être envoyée
par courriel à chaque réception.

| Formulaire | Nom côté Netlify | Redirection après envoi |
|---|---|---|
| Page Contact | `contact` | `/merci.html` |
| Page Soumission | `soumission` | `/merci.html` |

**Activer les notifications** : Netlify → *Site configuration* → *Forms* → *Form notifications* →
*Add notification* → *Email notification*, avec `ardavuralavq@constructionavq.ca`.

### Limite importante : les pièces jointes

Le forfait gratuit de Netlify Forms accepte **100 demandes par mois**, ce qui est largement
suffisant. En revanche il ne stocke que **10 Mo de pièces jointes par mois**, avec un maximum de
8 Mo par envoi.

Une demande refusée par le service est une demande perdue sans que personne ne le sache. Le
formulaire est donc borné côté navigateur : **2 fichiers de 2 Mo maximum**. Au-delà, l’envoi est
bloqué avec un message clair invitant à retirer les fichiers et à les transmettre par courriel —
la demande part quand même.

La page de confirmation (`merci.html`) propose d’ailleurs systématiquement d’envoyer photos et
plans par courriel, avec un lien `mailto:` prérempli.

Si les clients envoient régulièrement des photos, deux possibilités :

- activer le forfait payant *Forms Level 1* chez Netlify, puis desserrer `MAX_FICHIERS` et
  `MAX_TAILLE` en tête de la section formulaires dans `assets/js/main.js` ;
- ou conserver le fonctionnement actuel, les photos arrivant par courriel.

### Changer de service d’envoi

Pour utiliser Formspree, Web3Forms ou un autre service à la place de Netlify Forms, remplacer
l’attribut `action` du formulaire par l’adresse fournie par le service et retirer les attributs
`data-netlify`. Le script détecte automatiquement un `action` configuré et laisse l’envoi se faire
normalement.

> ⚠️ Ne jamais laisser un `action` qui pointe vers une page sans traitement : le formulaire
> semblerait fonctionner tout en jetant les demandes silencieusement.

## 5. Mise en ligne

Situation actuelle du domaine `constructionavq.ca` :

| Élément | Fournisseur | Ce qu’on en fait |
|---|---|---|
| Enregistrement du domaine | Squarespace | **On le garde** — rien à transférer |
| Courriel professionnel | Titan | **On n’y touche pas** — enregistrements MX inchangés |
| Site web | Squarespace | **On le déplace** vers Netlify |

Squarespace ne peut pas héberger ce site : le mode « Developer », qui permettait d’envoyer du code
sur mesure, n’existe plus sur la version 7.1. Seules l’injection de code et des retouches CSS
restent possibles.

### Étape 1 — Déployer sur Netlify

1. Créer un compte gratuit sur [netlify.com](https://www.netlify.com) et choisir *Add new site* →
   *Import an existing project* → *GitHub*.
2. Sélectionner ce dépôt et la branche voulue. Netlify lit `netlify.toml` : aucune commande de
   compilation, dossier publié à la racine.
3. Le site est immédiatement accessible sur une adresse temporaire en `.netlify.app`. **Tout
   vérifier à cette étape, avant de toucher au domaine.**

### Étape 2 — Pointer le domaine, sans casser le courriel

Dans Squarespace : *Domains* → `constructionavq.ca` → *DNS* → *DNS Settings* → *Custom records*.

**À modifier — les enregistrements du site web :**

| Action | Type | Hôte | Valeur |
|---|---|---|---|
| Supprimer | `A` | `@` | `198.185.159.144` |
| Supprimer | `A` | `@` | `198.185.159.145` |
| Supprimer | `A` | `@` | `198.49.23.144` |
| Supprimer | `A` | `@` | `198.49.23.145` |
| Ajouter | `A` | `@` | `75.2.60.5` |
| Modifier | `CNAME` | `www` | `VOTRE-SITE.netlify.app` |

**À ne surtout pas toucher — les enregistrements du courriel Titan :**

| Type | Hôte | Valeur |
|---|---|---|
| `MX` | `@` | `mx1.titan.email` (priorité 10) |
| `MX` | `@` | `mx2.titan.email` (priorité 20) |
| `TXT` | `@` | les enregistrements SPF / DKIM de Titan |

Les enregistrements `A` et `CNAME` désignent le serveur du **site web**. Les `MX` et `TXT`
désignent celui du **courriel**. Les deux sont indépendants : changer les premiers ne perturbe pas
le second, à condition de ne pas les supprimer par mégarde.

### Étape 3 — Finaliser

1. Dans Netlify : *Domain management* → ajouter `constructionavq.ca` comme **domaine principal**
   et `www.constructionavq.ca` comme alias.
2. Activer le certificat HTTPS (bouton *Verify DNS configuration* puis *Provision certificate*).
3. La propagation DNS prend de quelques minutes à 48 heures.
4. Vérifier que `www.constructionavq.ca` redirige bien vers `constructionavq.ca`, **et envoyer un
   courriel de test à votre adresse Titan.**

### Étape 4 — Une fois tout vérifié

L’abonnement *site web* de Squarespace peut être résilié : chez Squarespace, les abonnements sont
indépendants. Résilier le site ne touche ni le domaine ni Titan, qui se facturent séparément. Les
conserver actifs est indispensable — sans le domaine, ni le site ni le courriel ne fonctionnent.

## 6. Le logo

Le logo est une **reproduction vectorielle** du logo fourni par le client, déclinée en quatre
fichiers :

| Fichier | Usage |
|---|---|
| `logo-avq.svg` | Logo complet, pour fond clair (documents, données structurées) |
| `logo-avq-clair.svg` | Logo complet, pour fond sombre — utilisé dans le pied de page |
| `logo-marque.svg` | Symbole seul (immeubles + rubans), fond clair |
| `logo-marque-clair.svg` | Symbole seul, fond sombre — utilisé dans l’en-tête |

**Pourquoi deux versions.** Sous 60 px de hauteur, les mots « construction » et « inc. » du logo
complet deviennent illisibles. L’en-tête utilise donc le symbole seul, accompagné du nom composé
dans la typographie du site : la marque reste reconnaissable et le nom parfaitement net. Le pied
de page, qui dispose de plus d’espace, affiche le logo complet.

**Pour utiliser le fichier original** plutôt que la reproduction : déposer le fichier dans
`assets/img/` et remplacer les `src` correspondants. Prévoir une version claire pour les fonds
sombres — le bleu marine du logo est invisible sur l’anthracite du site.

Les couleurs du site sont alignées sur celles du logo : le doré `#E0A33E` sert d’accent, et sa
variante foncée `#8F6612` est réservée au texte sur fond clair, où le doré n’offrirait pas un
contraste suffisant (2,2:1 contre 5,1:1).

## 7. Remplacer les illustrations par de vraies photos

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

## 8. Ajouter un projet à la galerie

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

## 9. Référencement (SEO)

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

## 10. Design

Le système visuel est centralisé dans les variables CSS en tête de `assets/css/style.css` :

| Variable | Valeur | Usage |
|---|---|---|
| `--noir` | `#0E0F11` | fonds sombres, sections d’accent |
| `--anthracite` / `--graphite` | `#16181C` / `#22252A` | surfaces secondaires |
| `--gris` / `--gris-pale` | `#6E7378` / `#F4F5F6` | textes secondaires, fonds clairs |
| `--accent` | `#E0A33E` | doré du logo — couleur d’accent unique |
| `--accent-fort` | `#8F6612` | accent sur fond clair (contraste du texte) |
| `--marine` | `#1B3663` | bleu marine du logo |

Typographie : **Archivo** pour les titres, **Inter** pour le texte courant (chargées depuis Google
Fonts, avec repli sur les polices système). Animations volontairement discrètes et intégralement
neutralisées si le visiteur a activé « réduire les animations ».

---

## 11. Compatibilité et accessibilité

- Testé de 360 px à 1920 px : aucun débordement horizontal.
- Navigation clavier complète, lien d’évitement, `aria-*` sur le menu, la galerie modale et le
  comparateur avant/après, points de contact tactiles conformes sur mobile.
- Barre d’action fixe sur mobile gardant « Soumission » toujours accessible.
- Le site reste lisible sans JavaScript (contenu, navigation et formulaires en dégradation
  gracieuse) ; seuls les filtres, la fiche projet et le comparateur nécessitent JS.
