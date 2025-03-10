# Change log

Tous les changements notables de ce projet seront documentés dans ce fichier.

## [0.0.2] - 2025-03-10

### 🚀 Nouveautés

- **MQTT** : Ajout du listage des capteurs (_sensors_).
- **MQTT** : Ajout du filtrage des capteurs (_sensors_) _(À terminer)_.
- **MQTT** : Génération du fichier YAML de configuration HASS (_sensors + integrations_) _(À terminer)_.

## [0.0.1] - 2025-03-10

### 🚀 Nouvelles fonctionnalités

- Connexion à l'**API Zendure** pour la récupération des identifiants MQTT.
- Connexion au **serveur MQTT de Zendure** pour la récupération des capteurs nécessaires à la génération du fichier de configuration HASS.
- **Détection automatique des numéros de série** des équipements.
- **Ajout des états des capteurs MQTT en temps réel**.
- **Ajout du listage des batteries** liées à l'onduleur.
- **Ajout du listage des onduleurs**.

### 🎨 Interface & UX

- Utilisation de **Bulma.css** à la place d'Angular Material.
- Utilisation de **Fortawesome/Fontawesome** pour les icônes via Bulma.
- **Ajout de pop-ins informatives** pour améliorer l'expérience utilisateur.

### ⚙️ Améliorations techniques

- Utilisation du package **NPM "YAML"** pour la génération du fichier de configuration HASS.
