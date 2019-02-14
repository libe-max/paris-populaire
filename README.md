# Paris Populaire

This app has been built on top of the [Libé apps template](https://github.com/libe-max/libe-apps-template), and uses custom NPM packages [Libé components](https://github.com/libe-max/libe-components) and [Libé utils](https://github.com/libe-max/libe-utils)

## To do

### Redaction

- [ ] Ajouter les dates dans les fiches ?
- [ ] Rédiger le texte d'intro (sera ajouté dans un onglet du spreadsheet)
- [ ] Remplacer les maybe
- [ ] Mettre les bons liens vers les photos (idéalement hébergées dans le quai)
- [ ] Ajouter les crédits des photos dans une colonne dédiée
- [ ] Pré-remplir les tweets de partage
- [ ] S'assurer que les <span data-***> sont bien renseignés, c'est à dire :
  - [ ] La valeur de l'attribut data-*** est entre guillemets doubles informatiques ( " )
  - [ ] Il y a un signe = entre data-*** et sa valeur
  - [ ] Il y a du contenu à l'intérieur de la balise span (\<span\>Du texte ici\</span\>)
  - [ ] Les <span data-***> ne sont pas imbriquées les unes dans les autres, à l'exception des data-source, qui peuvent contenir toutes les autres sauf une autre data-source
  - [ ] S'assurer qu'il y a le même nombre de balises ouvrantes que fermantes

### Code

#### Before publication

- [x] Share component
- [ ] Récupérer les images
- [ ] Intro panel
- [ ] Prev / Next
- [ ] Styliser l'app
- [x] Optimiser la position du btn back sur les cartes
- [x] Mettre le bon style pour le fond de carte
- [x] Leaflet fallback
- [x] Corriger l'affichage des "liens" dans les cartes
- [x] Scroll to source

#### After publication

- [ ] Faire un data preload
- [ ] Vous êtes ici
- [ ] Commenter le code
- [ ] Compléter README.md
- [ ] Standalone components —> libe-components
