import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "script"
    },
    rules: {
      // Errori sintattici
      "no-unexpected-multiline": "error", // problemi con line-break
      "semi": ["error", "always"],         // obbliga i semi-column(;)
      "no-unreachable": "error",           // niente codice morto (codice che non ha alcun effetto sul programma e risulta dunque ridondante o inutile)
      "no-extra-semi": "error",            // niente semi-column(;) doppi
      "no-undef": "error",                 // niente variabili non dichiarate

      // Possibili errori
      "eqeqeq": ["warn", "always"],        // sempre ===
      "no-console": "warn",                // avvisa se console.log
      "curly": "error",                    // obbliga le {}
      "no-empty": ["warn", { "allowEmptyCatch": true }], // niente blocchi vuoti

      // Security
      "no-eval": "error", //funzione eval puo introdurre vulnerabilità a attacchi injection
      "no-implied-eval": "error", //errore quando vengono utilizzate funzioni con effetti simili ad eval
      "no-alert": "warn", //alert possono risultare fastidiose e possono prevenire controllo appropriato interfaccia in situazioni in cui e' necessariamente richiesto

      // Leggibilità
      "indent": ["warn", 2],              // 2 spazi
      "quotes": ["warn", "single"],       // virgolette singole
      "brace-style": ["warn", "1tbs"],    // stile graffe coerente
      "comma-dangle": ["warn", "never"]   // niente virgole finali
    }
  },
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended
];
