// ==UserScript==
// @name         Plugin final
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Descifra los mensajes cifrados con 3DES dentro de un HTML.
// @author       JairaR
// @match        https://cripto.tiiny.site/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var targetClass = 'Parrafo';
    var paragraphs = document.getElementsByClassName(targetClass);
    var result = '';
    var count = 0;

    if (paragraphs.length > 0) {
        result += 'La llave es:';

        for (var i = 0; i < paragraphs.length; i++) {
            var paragraph = paragraphs[i];
            var text = paragraph.textContent.trim();
            var sentences = text.split('.');

            for (var j = 0; j < sentences.length; j++) {
                var sentence = sentences[j].trim();
                var firstCharacter = sentence.charAt(0);
                result += firstCharacter;
            }
        }
    } else {
        result = 'No se encontraron párrafos con la clase ' + targetClass;
    }

    console.log(result);

    // Agregar la biblioteca CryptoJS
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js'; // URL de la biblioteca CryptoJS
    document.head.appendChild(script);
    script.onload = function() {
        // Una vez cargada la biblioteca CryptoJS, continuar con el resto del código
        // Función para descifrar el mensaje utilizando 3DES
        function descifrarMensaje(ciphertext, clave) {
            var CryptoJS = window.CryptoJS;
            var key = CryptoJS.enc.Utf8.parse(clave);
            var decrypted = CryptoJS.TripleDES.decrypt({
                ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
            }, key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return decrypted.toString(CryptoJS.enc.Utf8);
        }



        // Buscar todos los elementos <div> con las clases M1, M2, M3, Mi.
        var elementosDiv = document.querySelectorAll('div[class^="M"]');

        // Iterar sobre cada elemento y descifrar el mensaje
        for (var i = 0; i < elementosDiv.length; i++) {
            var elemento = elementosDiv[i];
            var id = elemento.id;
            var ciphertext = id.substring(0, id.length - 1);
            //como ya se encontró la clave anteriormente, y se mostró por consola, la ingresé manual
            var clave = "CRIPTOCRIPTOCRIPTOCRIPTO";

            // Descifrar el mensaje
            var mensajeDescifrado = descifrarMensaje(ciphertext, clave);

            // Incrementar el contador de mensajes cifrados
            count++;
            console.log(ciphertext + '=>' + mensajeDescifrado);

            // Reemplazar el contenido del elemento con el mensaje descifrado
            elemento.textContent = mensajeDescifrado;
        }

        // Mostrar el número de mensajes cifrados por consola
        console.log('Los mensajes cifrados son: ' + count);

    };
})();
