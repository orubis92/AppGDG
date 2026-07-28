/**
 * Punto di scambio su Google Drive per l'app GdG CSAIN.
 *
 * Riceve la relazione XML inviata dall'app e la salva nella cartella
 * "Relazioni GdG" del tuo Drive.
 *
 * COME ATTIVARLO (una volta sola, ~5 minuti):
 * 1. Vai su https://script.google.com → "Nuovo progetto".
 * 2. Cancella il contenuto e incolla tutto questo file. Salva (icona dischetto).
 * 3. In alto a destra: "Esegui il deployment" → "Nuovo deployment".
 * 4. Tipo: "App web". Esegui come: "Me". Chi ha accesso: "Chiunque".
 * 5. "Esegui il deployment" → autorizza l'accesso al tuo Drive quando richiesto.
 * 6. Copia l'"URL dell'app web" (finisce con /exec) e incollalo nell'app:
 *    Referto → Punto di scambio → URL di destinazione.
 *
 * Da quel momento "Invia relazione XML" salva il file su Drive.
 * NB: se in futuro modifichi questo script, rifai "Esegui il deployment"
 * → "Gestisci i deployment" → matita → "Nuova versione".
 */

var CARTELLA = 'Relazioni GdG';

function doPost(e) {
  try {
    var folder = trovaOCrea_(CARTELLA);
    var nome = (e && e.parameter && e.parameter.nome) || ('relazione-gdg-' + new Date().toISOString().slice(0, 10) + '.xml');
    var contenuto = (e && e.postData && e.postData.contents) || '';
    if (!contenuto) return risposta_('ERRORE: nessun contenuto ricevuto');
    /* evita di sovrascrivere: se esiste già, aggiunge orario al nome */
    if (folder.getFilesByName(nome).hasNext()) {
      nome = nome.replace(/\.xml$/i, '') + '-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'HHmmss') + '.xml';
    }
    folder.createFile(nome, contenuto, 'application/xml');
    return risposta_('OK: salvato ' + nome);
  } catch (err) {
    return risposta_('ERRORE: ' + err);
  }
}

function trovaOCrea_(nome) {
  var it = DriveApp.getFoldersByName(nome);
  return it.hasNext() ? it.next() : DriveApp.createFolder(nome);
}

function risposta_(msg) {
  return ContentService.createTextOutput(msg).setMimeType(ContentService.MimeType.TEXT);
}
