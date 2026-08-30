/* =========================================================================
   Construction AVQ inc. — Interactions
   Vanille, sans dépendance. Animations légères et discrètes.
   ========================================================================= */
(function () {
  "use strict";

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ------------------------------------------------ En-tête : fond au défilement */
  var entete = $(".entete");
  var estPageClaire = document.body.hasAttribute("data-entete-claire");

  function majEntete() {
    if (!entete) return;
    var y = window.scrollY || window.pageYOffset;
    entete.classList.toggle("is-compact", y > 40);
    if (estPageClaire) entete.classList.add("is-clair");
  }

  /* ------------------------------------------- Barre d'action mobile (apparition) */
  var barre = $(".barre-mobile");
  function majBarre() {
    if (!barre) return;
    barre.classList.toggle("est-visible", (window.scrollY || 0) > 320);
  }

  var enAttente = false;
  window.addEventListener("scroll", function () {
    if (enAttente) return;
    enAttente = true;
    window.requestAnimationFrame(function () {
      majEntete();
      majBarre();
      enAttente = false;
    });
  }, { passive: true });
  majEntete();
  majBarre();

  /* ---------------------------------------------------------- Menu mobile */
  var burger = $(".burger");
  var menu = $(".menu-mobile");
  function fermerMenu() {
    if (!menu) return;
    menu.classList.remove("is-ouvert");
    burger.setAttribute("aria-expanded", "false");
    document.documentElement.style.overflow = "";
  }
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var ouvert = menu.classList.toggle("is-ouvert");
      burger.setAttribute("aria-expanded", ouvert ? "true" : "false");
      document.documentElement.style.overflow = ouvert ? "hidden" : "";
      if (ouvert) entete.classList.add("is-compact");
    });
    $$(".menu-mobile a").forEach(function (a) { a.addEventListener("click", fermerMenu); });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    fermerMenu();
    fermerModale();
  });

  /* ------------------------------------------- Révélation douce au défilement */
  var aReveler = $$(".reveal");
  if (aReveler.length) {
    if (!("IntersectionObserver" in window)) {
      aReveler.forEach(function (el) { el.classList.add("est-visible"); });
    } else {
      var obs = new IntersectionObserver(function (entrees) {
        entrees.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("est-visible");
          obs.unobserve(e.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      aReveler.forEach(function (el) { obs.observe(el); });
    }
  }

  /* ------------------------------------------------------ Compteurs animés */
  var compteurs = $$("[data-compteur]");
  if (compteurs.length && "IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var obsC = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var cible = parseFloat(el.getAttribute("data-compteur"));
        var suffixe = el.getAttribute("data-suffixe") || "";
        var debut = null;
        var duree = 1400;
        function pas(t) {
          if (debut === null) debut = t;
          var p = Math.min((t - debut) / duree, 1);
          var e2 = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(cible * e2) + suffixe;
          if (p < 1) requestAnimationFrame(pas);
        }
        requestAnimationFrame(pas);
        obsC.unobserve(el);
      });
    }, { threshold: 0.4 });
    compteurs.forEach(function (el) { obsC.observe(el); });
  }

  /* --------------------------------------------- Galerie : filtres + modale */
  var filtres = $$(".filtre");
  var projets = $$(".projet");
  if (filtres.length) {
    filtres.forEach(function (b) {
      b.addEventListener("click", function () {
        var cat = b.getAttribute("data-filtre");
        filtres.forEach(function (x) {
          x.classList.toggle("is-actif", x === b);
          x.setAttribute("aria-pressed", x === b ? "true" : "false");
        });
        projets.forEach(function (p) {
          var cats = (p.getAttribute("data-cats") || "").split(" ");
          var visible = cat === "tous" || cats.indexOf(cat) !== -1;
          p.classList.toggle("est-masque", !visible);
        });
        var vides = $(".galerie__vide");
        if (vides) {
          var n = projets.filter(function (p) { return !p.classList.contains("est-masque"); }).length;
          vides.hidden = n > 0;
        }
      });
    });
  }

  var modale = $(".modale");
  var dernierDeclencheur = null;

  function ouvrirModale(donnees, declencheur) {
    if (!modale) return;
    dernierDeclencheur = declencheur || null;
    $(".modale__titre", modale).textContent = donnees.titre || "";
    $(".modale__cat", modale).textContent = donnees.categorie || "";
    $(".modale__desc", modale).textContent = donnees.description || "";
    $(".modale__type", modale).textContent = donnees.type || "—";
    $(".modale__services", modale).textContent = donnees.services || "—";
    $(".modale__lieu", modale).textContent = donnees.lieu || "—";
    $(".modale__duree", modale).textContent = donnees.duree || "—";

    var ba = $(".modale .ba", modale);
    if (ba) {
      $(".ba__avant", ba).src = donnees.avant;
      $(".ba__avant", ba).alt = "Avant les travaux — " + (donnees.titre || "");
      $(".ba__apres", ba).src = donnees.apres;
      $(".ba__apres", ba).alt = "Après les travaux — " + (donnees.titre || "");
      poserCurseur(ba, 50);
    }
    modale.classList.add("is-ouvert");
    document.documentElement.style.overflow = "hidden";
    var fermer = $(".modale__fermer", modale);
    if (fermer) fermer.focus();
  }

  function fermerModale() {
    if (!modale || !modale.classList.contains("is-ouvert")) return;
    modale.classList.remove("is-ouvert");
    document.documentElement.style.overflow = "";
    if (dernierDeclencheur) dernierDeclencheur.focus();
  }

  if (modale) {
    $$(".projet").forEach(function (p) {
      p.addEventListener("click", function () {
        ouvrirModale({
          titre: p.getAttribute("data-titre"),
          categorie: p.getAttribute("data-categorie"),
          description: p.getAttribute("data-description"),
          type: p.getAttribute("data-type"),
          services: p.getAttribute("data-services"),
          lieu: p.getAttribute("data-lieu"),
          duree: p.getAttribute("data-duree"),
          avant: p.getAttribute("data-avant"),
          apres: p.getAttribute("data-apres")
        }, p);
      });
    });
    modale.addEventListener("click", function (e) {
      if (e.target === modale) fermerModale();
    });
    var btnF = $(".modale__fermer", modale);
    if (btnF) btnF.addEventListener("click", fermerModale);

    // Piège de focus simple
    modale.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var f = $$('a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])', modale)
        .filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var premier = f[0], dernier = f[f.length - 1];
      if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
      else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
    });
  }

  /* ------------------------------------------------- Comparateur avant / après */
  function poserCurseur(ba, pct) {
    pct = Math.max(0, Math.min(100, pct));
    $(".ba__apres", ba).style.clipPath = "inset(0 0 0 " + pct + "%)";
    $(".ba__poignee", ba).style.left = pct + "%";
    ba.setAttribute("aria-valuenow", Math.round(pct));
  }

  $$(".ba").forEach(function (ba) {
    var actif = false;
    function depuisEvt(e) {
      var r = ba.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      poserCurseur(ba, (x / r.width) * 100);
    }
    ba.addEventListener("dragstart", function (e) { e.preventDefault(); });
    ba.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      actif = true;
      try { ba.setPointerCapture(e.pointerId); } catch (err) { /* pointeur non capturable */ }
      depuisEvt(e);
    });
    ba.addEventListener("pointermove", function (e) { if (actif) depuisEvt(e); });
    ba.addEventListener("pointerup", function () { actif = false; });
    ba.addEventListener("pointercancel", function () { actif = false; });
    ba.addEventListener("keydown", function (e) {
      var cur = parseFloat(ba.getAttribute("aria-valuenow") || "50");
      if (e.key === "ArrowLeft")  { poserCurseur(ba, cur - 4); e.preventDefault(); }
      if (e.key === "ArrowRight") { poserCurseur(ba, cur + 4); e.preventDefault(); }
    });
    poserCurseur(ba, 50);
  });

  /* --------------------------------------------------------- Marquee : duplication */
  $$(".marquee__piste").forEach(function (piste) {
    piste.innerHTML = piste.innerHTML + piste.innerHTML;
  });

  /* ------------------------------------------------------------- Formulaires */
  // Netlify Forms (forfait gratuit) : 8 Mo par envoi et 10 Mo de pièces jointes
  // par mois. On borne donc côté navigateur : une demande ne doit JAMAIS être
  // rejetée par le service d'envoi, sinon le client est perdu sans le savoir.
  var MAX_FICHIERS = 2;
  var MAX_TAILLE = 2 * 1024 * 1024; // 2 Mo par fichier

  $$(".depot").forEach(function (depot) {
    var input = $('input[type="file"]', depot);
    var liste = $(".depot__liste", depot);
    if (!input) return;

    function rendre(fichiers) {
      liste.innerHTML = "";
      var refuses = [];
      Array.prototype.slice.call(fichiers).forEach(function (f, i) {
        var li = document.createElement("li");
        var mo = (f.size / (1024 * 1024)).toFixed(1);
        var trop_gros = f.size > MAX_TAILLE;
        var en_trop = i >= MAX_FICHIERS;
        li.textContent = f.name + " — " + mo + " Mo" +
          (trop_gros ? " — trop volumineux (2 Mo maximum)" : "") +
          (en_trop ? " — au-delà de 2 fichiers" : "");
        if (trop_gros || en_trop) {
          li.style.color = "#B3261E";
          refuses.push(f.name);
        }
        liste.appendChild(li);
      });
      depot.setAttribute("data-refuses", refuses.length ? "1" : "");
      var avis = depot.parentNode.querySelector(".depot__avis");
      if (refuses.length) {
        if (!avis) {
          avis = document.createElement("p");
          avis.className = "depot__avis champ__erreur";
          avis.style.display = "block";
          depot.parentNode.appendChild(avis);
        }
        avis.textContent = "Retirez les fichiers signalés en rouge, ou envoyez-les-nous " +
          "par courriel après avoir soumis le formulaire.";
      } else if (avis) {
        avis.remove();
      }
    }
    depot.addEventListener("click", function (e) { if (e.target !== input) input.click(); });
    depot.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); }
    });
    input.addEventListener("change", function () { rendre(input.files); });
    ["dragenter", "dragover"].forEach(function (t) {
      depot.addEventListener(t, function (e) { e.preventDefault(); depot.classList.add("est-survol"); });
    });
    ["dragleave", "drop"].forEach(function (t) {
      depot.addEventListener(t, function (e) { e.preventDefault(); depot.classList.remove("est-survol"); });
    });
    depot.addEventListener("drop", function (e) {
      if (e.dataTransfer && e.dataTransfer.files.length) {
        input.files = e.dataTransfer.files;
        rendre(input.files);
      }
    });
  });

  $$("form[data-form]").forEach(function (form) {
    var etat = $(".form__etat", form);
    var bouton = $('button[type="submit"]', form);

    // La validation native reste active dans le HTML pour les visiteurs sans JavaScript ;
    // on la désactive ici afin d'afficher nos propres messages, plus explicites.
    form.noValidate = true;

    function messager(texte, erreur) {
      if (!etat) return;
      etat.textContent = texte;
      etat.classList.add("est-visible");
      etat.classList.toggle("est-erreur", !!erreur);
      etat.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Validation à la volée
    $$("input, select, textarea", form).forEach(function (ch) {
      ch.addEventListener("blur", function () {
        var champ = ch.closest(".champ");
        if (!champ) return;
        champ.classList.toggle("a-erreur", !ch.checkValidity() && ch.value !== "");
      });
      ch.addEventListener("input", function () {
        var champ = ch.closest(".champ");
        if (champ && ch.checkValidity()) champ.classList.remove("a-erreur");
      });
    });

    form.addEventListener("submit", function (e) {
      // Anti-pourriel : si le champ caché est rempli, on ignore silencieusement.
      var miel = $('input[name="_confirmation"]', form);
      if (miel && miel.value) { e.preventDefault(); return; }

      var depot_refuse = form.querySelector('.depot[data-refuses="1"]');
      if (depot_refuse) {
        e.preventDefault();
        messager("Certaines pièces jointes dépassent les limites acceptées (2 fichiers de 2 Mo). " +
                 "Retirez-les et envoyez-les-nous plutôt par courriel — votre demande partira aussitôt.", true);
        depot_refuse.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      if (!form.checkValidity()) {
        e.preventDefault();
        $$("input, select, textarea", form).forEach(function (ch) {
          var champ = ch.closest(".champ");
          if (champ) champ.classList.toggle("a-erreur", !ch.checkValidity());
        });
        var premier = $(".champ.a-erreur input, .champ.a-erreur select, .champ.a-erreur textarea", form);
        if (premier) { premier.focus(); premier.scrollIntoView({ behavior: "smooth", block: "center" }); }
        messager("Certains champs obligatoires sont incomplets. Merci de vérifier le formulaire.", true);
        return;
      }

      var action = form.getAttribute("action") || "";
      var configure = action && action.indexOf("VOTRE-ENDPOINT") === -1 && action.charAt(0) !== "#";

      if (configure) {
        // Envoi normal vers le service de formulaire configuré.
        if (bouton) { bouton.disabled = true; bouton.textContent = "Envoi en cours…"; }
        return;
      }

      // Aucun service configuré : bascule vers le courriel, sans perdre la saisie.
      e.preventDefault();
      var d = new FormData(form);
      var lignes = [];
      d.forEach(function (v, k) {
        if (k.charAt(0) === "_" || k === "form-name" || !String(v).trim()) return;
        var lbl = form.querySelector('[name="' + k + '"]');
        var texte = lbl && lbl.closest(".champ") && $("label", lbl.closest(".champ"))
          ? $("label", lbl.closest(".champ")).textContent.replace("*", "").trim()
          : k;
        lignes.push(texte + " : " + v);
      });
      var sujet = form.getAttribute("data-sujet") || "Demande — Construction AVQ inc.";
      var destinataire = form.getAttribute("data-courriel") || "info@constructionavq.ca";
      var url = "mailto:" + destinataire +
        "?subject=" + encodeURIComponent(sujet) +
        "&body=" + encodeURIComponent(lignes.join("\n"));
      window.location.href = url;
      messager("Votre logiciel de messagerie s’ouvre avec votre demande préremplie. " +
               "Vous pouvez aussi nous écrire directement à " + destinataire + ".", false);
    });
  });

  /* ------------------------------------- Pré-sélection du service dans le formulaire */
  var params = new URLSearchParams(window.location.search);
  var service = params.get("service");
  if (service) {
    var sel = $('select[name="type_projet"]');
    if (sel) {
      $$("option", sel).forEach(function (o) {
        if (o.value === service) sel.value = service;
      });
    }
  }

  /* ------------------------------------------ Année courante dans le pied de page */
  $$("[data-annee]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
