# Control per Veu amb Electron i Vue 3

Aquesta aplicació és una prova de concepte dedicada a la implementació d'interfícies d'usuari per veu (VUI). El projecte demostra com integrar la Web Speech API en un entorn d'escriptori utilitzant Electron, Vue 3 i la biblioteca de components Vuetify.

---

## Especificacions Tècniques

* **Framework Core:** Vue 3 (Composition API)
* **Runtime d'Escriptori:** Electron
* **Sistema de Disseny:** Vuetify 3
* **Processament de Veu:** Web Speech API (Localització: ca-ES)

## Requisits Previs

Per assegurar el funcionament correcte del sistema, cal complir els següents punts:
* Disposar de Node.js i npm en la darrera versió estable.
* Tenir un micròfon correctament configurat i actiu al sistema operatiu.
* L'aplicació requereix permisos de hardware gestionats mitjançant el procés principal a background.js.

---

## Instal·lació i Posada en Marxa

1. **Preparació del directori:**
   Clona el repositori o descarrega els fitxers font al teu equip.

2. **Instal·lació de dependències:**
   Executa la comanda: *npm install*

3. **Llançament en mode desenvolupament:**
   Inicia l'entorn de treball amb la instrucció: *npm run dev*

---

## Funcionalitats i Ordres Disponibles

L'aplicació permet una interacció fluida mitjançant llenguatge natural. Un cop activada l'escolta, el sistema reconeix paraules clau per executar accions específiques:

* **Hola:** L'ordre "Hola" genera una resposta de benvinguda a la interfície.
* **Ajuda:** Proporciona detalls tècnics i informació sobre el propòsit de la prova de concepte.
* **Mode clar y Mode fosc:** Canvi dinàmic entre modes visuals amb les ordres "Mode clar" o "Mode fosc".
* **Borrar:** L'ús de la paraula "Borrar" restableix l'estat inicial i els colors de la interfície.

### Gestió de Feedback
* **Resultats Intermedis:** La interfície mostra en temps real el text que el sistema està processant abans de confirmar la comanda.
* **Sistema de Notificacions:** Si una ordre no és vàlida, s'activa un snackbar que mostra la transcripció capturada per facilitar el diagnòstic.
* **Seguretat i Errors:** El sistema detecta i informa sobre errors de hardware o de connexió de manera immediata.

---

## Arquitectura del Projecte

L'estructura de fitxers principal es divideix segons la seva responsabilitat:

* src/background.js: Administra la sessió d'Electron i els permisos de seguretat del micròfon.
* src/composables/useSpeechRecognition.js: Conté la lògica reactiva que encapsula la Speech API.
* src/components/VoiceCommander.vue: Centralitza la interfície d'usuari i el diccionari de comandes.
