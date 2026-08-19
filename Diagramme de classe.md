classDiagram

    class Utilisateur {
        +Long id
        +String nom
        +String prenom
        +String email
        +String motDePasse
        +String telephone
        +String role
        +Date dateCreation
    }

    class Adresse {
        +Long id
        +String rue
        +String ville
        +String codePostal
        +String pays
    }

    class Categorie {
        +Long id
        +String nom
        +String description
    }

    class Fleur {
        +Long id
        +String nom
        +String description
        +Decimal prix
        +Integer stock
        +String imageUrl
        +Boolean disponible
        +Date dateCreation
    }

    class Panier {
        +Long id
        +Date dateCreation
        +Decimal total
    }

    class LignePanier {
        +Long id
        +Integer quantite
        +Decimal prixUnitaire
        +Decimal sousTotal
    }

    class Commande {
        +Long id
        +String numeroCommande
        +Date dateCommande
        +Decimal total
        +String statut
    }

    class LigneCommande {
        +Long id
        +Integer quantite
        +Decimal prixUnitaire
        +Decimal sousTotal
    }

    class Paiement {
        +Long id
        +Decimal montant
        +String methode
        +String statut
        +Date datePaiement
        +String reference
    }

    class Livraison {
        +Long id
        +String statut
        +Date dateLivraisonPrevue
        +Date dateLivraisonEffective
        +String adresseLivraison
    }

    Utilisateur "1" --> "0..*" Adresse : possède
    Utilisateur "1" --> "0..1" Panier : possède
    Utilisateur "1" --> "0..*" Commande : passe

    Categorie "1" --> "0..*" Fleur : contient

    Panier "1" --> "1..*" LignePanier : contient
    LignePanier "*" --> "1" Fleur : concerne

    Commande "1" --> "1..*" LigneCommande : contient
    LigneCommande "*" --> "1" Fleur : concerne

    Commande "1" --> "0..1" Paiement : possède
    Commande "1" --> "0..1" Livraison : possède
    Commande "1" --> "1" Adresse : utilise
