/* =====================================================
   ELEMENTOS
===================================================== */

const lengthInput =
    document.getElementById("length");

const lengthValue =
    document.getElementById("lengthValue");

const passwordEl =
    document.getElementById("password");

const chamber =
    document.querySelector(".chamber");

const particlesEl =
    document.getElementById("particles");

const ambiguity =
    document.getElementById("ambiguity");

const ambiguityText =
    document.getElementById("ambiguityText");

const strengthIndicator =
    document.getElementById("strengthIndicator");

const copyBtn =
    document.getElementById("copyBtn");

const copyText =
    document.getElementById("copyText");

const toast =
    document.getElementById("toast");

const generateBtn =
    document.getElementById("generateBtn");


/* =====================================================
   CARACTERES
===================================================== */

const pools = {

    lowercase:
        "abcdefghijklmnopqrstuvwxyz",

    uppercase:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",

    numbers:
        "0123456789",

    symbols:
        "!@#$%&*+-_=?.:;"

};


/* =====================================================
   CARACTERES AMBÍGUOS
===================================================== */

/*
    Esses caracteres podem ser facilmente confundidos:

    0 = O = o
    1 = I = l
    2 = Z = z
    5 = S = s
    8 = B

    Também removemos | por ser visualmente confuso.
*/

const ambiguousCharacters = new Set([

    "0",
    "O",
    "o",

    "1",
    "I",
    "l",
    "|",

    "2",
    "Z",
    "z",

    "5",
    "S",
    "s",

    "8",
    "B"

]);


/* =====================================================
   REMOVE AMBIGUIDADE
===================================================== */

function removeAmbiguousCharacters(text) {

    return [...text]

        .filter(
            character =>
                !ambiguousCharacters.has(character)
        )

        .join("");

}


/* =====================================================
   OBTÉM O POOL DISPONÍVEL
===================================================== */

function getAvailablePool() {

    let pool = "";


    /*
        Adiciona apenas os tipos
        selecionados pelo usuário.
    */

    if (
        document.getElementById("lowercase").checked
    ) {

        pool += pools.lowercase;

    }


    if (
        document.getElementById("uppercase").checked
    ) {

        pool += pools.uppercase;

    }


    if (
        document.getElementById("numbers").checked
    ) {

        pool += pools.numbers;

    }


    if (
        document.getElementById("symbols").checked
    ) {

        pool += pools.symbols;

    }


    /*
        AQUI está a correção principal.

        Se ambiguidade estiver DESLIGADA,
        removemos os caracteres proibidos
        do pool inteiro.
    */

    if (!ambiguity.checked) {

        pool =
            removeAmbiguousCharacters(pool);

    }


    return pool;

}


/* =====================================================
   ALEATORIEDADE CRIPTOGRÁFICA
===================================================== */

function secureRandom(max) {

    const array =
        new Uint32Array(1);

    crypto.getRandomValues(array);

    return array[0] % max;

}


/* =====================================================
   PEGA UM CARACTERE ALEATÓRIO
===================================================== */

function randomCharacter(pool) {

    return pool[
        secureRandom(pool.length)
    ];

}


/* =====================================================
   OBTÉM AS CATEGORIAS SELECIONADAS
===================================================== */

function getSelectedCategories() {

    const categories = [];


    if (
        document.getElementById("lowercase").checked
    ) {

        categories.push(
            pools.lowercase
        );

    }


    if (
        document.getElementById("uppercase").checked
    ) {

        categories.push(
            pools.uppercase
        );

    }


    if (
        document.getElementById("numbers").checked
    ) {

        categories.push(
            pools.numbers
        );

    }


    if (
        document.getElementById("symbols").checked
    ) {

        categories.push(
            pools.symbols
        );

    }


    return categories;

}


/* =====================================================
   GERA A SENHA
===================================================== */

function generatePassword() {

    const length =
        Number(lengthInput.value);


    const categories =
        getSelectedCategories();


    /*
        Nenhuma categoria selecionada.
    */

    if (categories.length === 0) {

        passwordEl.textContent =
            "selecione opções";

        updateStrength(0);

        return;

    }


    /*
        Pool geral.
    */

    const pool =
        getAvailablePool();


    if (!pool.length) {

        passwordEl.textContent =
            "opções inválidas";

        return;

    }


    const characters = [];


    /* =================================================
       GARANTE PELO MENOS UM DE CADA TIPO
    ================================================= */

    for (
        let category of categories
    ) {

        let usableCategory =
            category;


        /*
            Se a ambiguidade estiver desligada,
            também filtramos cada categoria.
        */

        if (!ambiguity.checked) {

            usableCategory =
                removeAmbiguousCharacters(
                    category
                );

        }


        /*
            Se existir pelo menos um
            caractere disponível nessa categoria,
            adicionamos um.
        */

        if (usableCategory.length > 0) {

            characters.push(
                randomCharacter(
                    usableCategory
                )
            );

        }

    }


    /* =================================================
       COMPLETA O RESTANTE
    ================================================= */

    while (
        characters.length < length
    ) {

        characters.push(
            randomCharacter(pool)
        );

    }


    /* =================================================
       EMBARALHA
    ================================================= */

    for (
        let i = characters.length - 1;
        i > 0;
        i--
    ) {

        const j =
            secureRandom(i + 1);


        [
            characters[i],
            characters[j]
        ] =
        [
            characters[j],
            characters[i]
        ];

    }


    /*
        Garante exatamente o tamanho
        escolhido pelo usuário.
    */

    const password =
        characters
            .slice(0, length)
            .join("");


    animateGeneration(password);

}


/* =====================================================
   ANIMAÇÃO DE GERAÇÃO
===================================================== */

function animateGeneration(
    finalPassword
) {

    chamber.classList.add(
        "generating"
    );


    particlesEl.innerHTML = "";


    /*
        Cria partículas do laboratório.
    */

    for (
        let i = 0;
        i < 20;
        i++
    ) {

        const particle =
            document.createElement("span");


        particle.className =
            "particle";


        particle.style.left =
            `${10 + secureRandom(90)}%`;


        particle.style.top =
            `${15 + secureRandom(70)}%`;


        particle.style.setProperty(
            "--dx",
            `${secureRandom(70) - 35}px`
        );


        particle.style.setProperty(
            "--dy",
            `${secureRandom(50) - 25}px`
        );


        particle.style.animationDelay =
            `${secureRandom(400)}ms`;


        particlesEl.appendChild(
            particle
        );

    }


    /*
        Caracteres usados durante
        a simulação de processamento.
    */

    const fakeCharacters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*+-_=?.:;";


    let ticks = 0;

    const totalTicks = 10;


    const interval =
        setInterval(() => {

            /*
                Durante a animação aparecem
                caracteres aleatórios.
            */

            passwordEl.textContent =
                Array.from(
                    {
                        length:
                            finalPassword.length
                    },
                    () =>
                        fakeCharacters[
                            secureRandom(
                                fakeCharacters.length
                            )
                        ]
                ).join("");


            ticks++;


            if (
                ticks >= totalTicks
            ) {

                clearInterval(interval);


                /*
                    Finalmente mostra
                    a senha verdadeira.
                */

                passwordEl.textContent =
                    finalPassword;


                chamber.classList.remove(
                    "generating"
                );


                updateStrength(
                    finalPassword.length
                );

            }

        }, 65);

}


/* =====================================================
   INDICADOR DE FORÇA
===================================================== */

function updateStrength(length) {

    if (!length) {

        strengthIndicator.style.left =
            "0%";

        return;

    }


    const types = [

        document.getElementById(
            "lowercase"
        ).checked,

        document.getElementById(
            "uppercase"
        ).checked,

        document.getElementById(
            "numbers"
        ).checked,

        document.getElementById(
            "symbols"
        ).checked

    ].filter(Boolean).length;


    /*
        Calcula uma força aproximada.

        Não é uma avaliação criptográfica,
        é apenas o indicador visual do site.
    */

    let score =

        (length - 6) * 8

        +

        types * 14;


    if (
        getAvailablePool().length > 65
    ) {

        score += 12;

    }


    score =
        Math.max(
            5,
            Math.min(100, score)
        );


    strengthIndicator.style.left =
        `${score}%`;

}


/* =====================================================
   ATUALIZA TAMANHO
===================================================== */

function updateLength() {

    const value =
        Number(lengthInput.value);


    /*
        MOSTRA O NÚMERO NA TELA.
    */

    lengthValue.textContent =
        value;


    /*
        Calcula a posição da barra.
    */

    const percentage =
        (
            (value - 6)
            /
            (12 - 6)
        ) * 100;


    /*
        Atualiza visualmente a barra.
    */

    lengthInput.style.background =

        `linear-gradient(
            to right,
            #ddd 0%,
            #ddd ${percentage}%,
            #542525 ${percentage}%,
            #542525 100%
        )`;

}


/* =====================================================
   AMBIGUIDADE
===================================================== */

function updateAmbiguity() {

    if (ambiguity.checked) {

        ambiguityText.textContent =
            "permitida";

    } else {

        ambiguityText.textContent =
            "removida";

    }

}


/* =====================================================
   COPIAR SENHA
===================================================== */

function copyPassword() {

    const value =
        passwordEl.textContent;


    if (

        !value ||

        value === "selecione opções" ||

        value === "opções inválidas" ||

        value === "Gerando..."

    ) {

        return;

    }


    navigator.clipboard
        .writeText(value)
        .then(() => {

            copyText.textContent =
                "copiado";


            toast.classList.add(
                "show"
            );


            setTimeout(() => {

                copyText.textContent =
                    "copiar";


                toast.classList.remove(
                    "show"
                );

            }, 1300);

        });

}


/* =====================================================
   EVENTOS
===================================================== */


/*
    Quando mexer na barra,
    o número muda imediatamente.
*/

lengthInput.addEventListener(
    "input",
    updateLength
);


/*
    Quando soltar a barra,
    gera uma nova senha.
*/

lengthInput.addEventListener(
    "change",
    generatePassword
);


/*
    Ambiguidade.
*/

ambiguity.addEventListener(
    "change",
    () => {

        updateAmbiguity();

        generatePassword();

    }
);


/*
    Ingredientes.
*/

document
    .getElementById("lowercase")
    .addEventListener(
        "change",
        generatePassword
    );


document
    .getElementById("uppercase")
    .addEventListener(
        "change",
        generatePassword
    );


document
    .getElementById("numbers")
    .addEventListener(
        "change",
        generatePassword
    );


document
    .getElementById("symbols")
    .addEventListener(
        "change",
        generatePassword
    );


/*
    Botão copiar.
*/

copyBtn.addEventListener(
    "click",
    copyPassword
);


/*
    Botão gerar.
*/

generateBtn.addEventListener(
    "click",
    generatePassword
);


/*
    Clicar na senha também gera outra.
*/

passwordEl.addEventListener(
    "click",
    generatePassword
);


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

updateLength();

updateAmbiguity();

generatePassword();

 
