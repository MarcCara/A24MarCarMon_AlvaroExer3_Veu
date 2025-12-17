# Control per Veu amb Electron i Vue 3

Aquest projecte és una prova de concepte (PoC) per a la implementació d'interfícies d'usuari per veu (VUI) en aplicacions d'escriptori. Utilitza la Web Speech API nativa de Chromium integrada en un entorn d'Electron amb Vue 3 i Vuetify.

## Tecnologies utilitzades

* Framework: Vue 3 (Composition API)
* Entorn d'escriptori: Electron
* Disseny: Vuetify 3
* API de veu: Web Speech API (configurada en ca-ES)

## Requisits del sistema

Per al correcte funcionament de l'aplicació cal disposar de:
* Node.js i npm instal·lats.
* Un micròfon configurat al sistema operatiu.
* Permisos d'accés al hardware gestionats pel procés principal d'Electron (background.js).

## Instal·lació

1. Clona el repositori o descarrega els fitxers del projecte.
2. Instal·la les dependències necessàries:
   npm install

## Execució

Per carregar l'aplicació en mode desenvolupament, executa la següent comanda:
   npm run dev

## Funcionalitats i ús

L'aplicació permet la interacció mitjançant llenguatge natural. Un cop activat el micròfon amb el botó d'escolta, el sistema processa la veu en temps real i executa accions basades en paraules clau:

* Salutació: En dir "Saluda", l'app respon amb un missatge de benvinguda.
* Ajuda: Proporciona informació sobre el propòsit de la prova de concepte.
* Control de tema: Permet alternar entre el mode visual clar i fosc mitjançant les ordres "Mode clar" i "Mode fosc".
* Neteja: L'ordre "Esborra" o "Borrar" reinicia l'estat de la interfície i el color del component.

### Gestió d'errors i feedback
* Interim Results: L'usuari pot veure el text que el sistema està detectant abans de processar la comanda final.
* Notificacions: Si una comanda no es reconeix, es mostra un snackbar vermell amb la transcripció capturada.
* Alertes: En cas d'error de hardware o de connexió, el sistema informa del problema.

## Estructura del projecte

* src/background.js: Configuració dels permisos de sessió per al micròfon.
* src/composables/useSpeechRecognition.js: Lògica reactiva per gestionar l'activació i els resultats de la Speech API.
* src/components/VoiceCommander.vue: Component de la interfície amb la lògica de reacció a les comandes.