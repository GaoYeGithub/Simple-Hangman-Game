$(document).ready(async function() {
    let word = '';
    let array = [];
    let wrongCounter = -1;
    const maxWrongGuesses = 14;
    const stickmanParts = [
        '.head',
        '.torso',
        '.leftarm',
        '.rightarm',
        '.leftleg',
        '.rightleg',
        '.rightfoot',
        '.leftfoot'
    ];

    function updateChancesDisplay() {
        const remainingChances = maxWrongGuesses - (wrongCounter + 1);
        $('#chances').text(`Chances remaining: ${remainingChances}`);
    }

    async function fetchWord() {
        try {
            const response = await fetch('https://random-word-api.vercel.app/api?words=1');
            const data = await response.json();
            return data[0].toUpperCase();
        } catch (error) {
            console.error('Error fetching word:', error);
            return 'HANGMAN';
        }
    }

    function makeLines(word) {
        array = [];
        for(let i = 0; i < word.length; i++) {
            array.push("_ ");
        }
        return array;
    }

    function display(list) {
        $('#right p').contents().filter(function() {
            return this.nodeType === 3;
        }).remove();
        for(let i = 0; i < list.length; i++) {
            $("#right p").append(list[i]);
        }
    }

    function drawStickmanPart(index) {
        if (index >= 0 && index < stickmanParts.length) {
            $(stickmanParts[index]).show();
        }
    }

    function resetGame() {
        $('.wrapper').show();
        $('.wrapper *').hide();
        $(".btns button").css('background-color', '');
        $(".btns button").prop("disabled", false);
        wrongCounter = -1;
        updateChancesDisplay();
        initializeGame();
    }

    async function initializeGame() {
        word = await fetchWord();
        array = makeLines(word);
        display(array);
    }

    resetGame();

    $(".btns button").click(function() {
        if (wrongCounter >= maxWrongGuesses - 1) return;

        let isCorrect = false;
        const char = word.split("");
        $(this).css('background-color', '#e94560');
        $(this).prop("disabled", true);

        const letter = this.innerText.toUpperCase();

        char.forEach((ch, i) => {
            if (letter === ch) {
                isCorrect = true;
                array[i] = ch;
            }
        });

        if (isCorrect) {
            display(array);
            if (!array.includes("_ ")) {
                setTimeout(() => {
                    alert("Congratulations! You won! 🎉");
                    resetGame();
                }, 500);
            }
        } else {
            wrongCounter++;
            drawStickmanPart(wrongCounter);
            updateChancesDisplay();

            if (wrongCounter >= maxWrongGuesses - 1) {
                setTimeout(() => {
                    alert(`Game Over! The word was: ${word}`);
                    resetGame();
                }, 500);
            }
        }
    });
    $("#restart").click(resetGame);
});
