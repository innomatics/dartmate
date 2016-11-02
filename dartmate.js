
var scoresRow;
var numPlayers = 2;
var numDarts = 3;
var currentDart = 0;
var currentPlayer = 0;
var startScore = 301;
var players = [
    {
        Name: "Player 1", 
        Score: startScore, 
        ScoreDiv: {}, 
        HistoryDiv: {}, 
        Darts: [], 
        n: 0
        
    }, 
    {
        Name: "Player 2", 
        Score: startScore, 
        ScoreDiv: {}, 
        HistoryDiv: {}, 
        Darts: [], 
        n: 0
    
    }
];
var darts = [];
var infoSection;

function isDouble(dart)
{
    return dart.match(/D/);
}

function isTriple(dart)
{
    return dart.match(/T/);
}

function getScore(dart)
{
    var multiplier = 1;
    if (isTriple(dart))
    {
        multiplier = 3;
    }
    else if (isDouble(dart))
    {
        multiplier = 2;
    }
    return multiplier * parseInt(dart.replace(/\D/g,''), 10);
}


// Calc scores from the start, every dart
function calculateScores()
{
    var dartNum = 0;
    currentPlayer = 0;
    var throwScore;
    var busted = false;
    var throwStartScore;
    var throwStartN;
    for (var p = 0; p < numPlayers; p++)
    {
        players[p].Score = startScore;
        players[p].Darts = [];
        players[p].n = 0;
    }
    
    for (var t = 0; t < currentDart; t++)
    {
        dartNum++;
        
        // if it's a players first dart, or the last player busted
        // then reset the throw score 
        if (dartNum == 1 || busted)
        {
            throwScore = 0;
            throwStartScore = players[currentPlayer].Score;
            throwStartN = players[currentPlayer].n;
        }
        
        players[currentPlayer].Score -= getScore(darts[t]);
        players[currentPlayer].Darts[players[currentPlayer].n] = darts[t];
        players[currentPlayer].n++;
        
        busted = (players[currentPlayer].Score < 2);
        
        if (players[currentPlayer].Score == 0)
        {
            if (!isDouble(darts[t]))
            {
                busted = true;
            }
            else
            {
                
                alert(players[currentPlayer].Name + ' WINS!');
            }
        }
        
        if (busted)
        {
            // Hard luck, reset back to score at start and move pointer back
            players[currentPlayer].Score = throwStartScore;
            players[currentPlayer].n = throwStartN;
        }

        if (dartNum == numDarts || busted)
        {
            currentPlayer = (currentPlayer + 1) % numPlayers;
            dartNum = 0; 
        }
    }
}


function addScoreboardButton(parentRow, buttonType, scoreNumber)
{
        var btn = document.createElement('div');
        btn.Title = buttonType + scoreNumber;
        btn.Id = 'scoreboardButton' + btn.Title;
        
        if (buttonType == 'S')
        {
            btn.innerHTML = scoreNumber;
        }
        else
        {
            btn.innerHTML = btn.Title;
        }
        
        btn.addEventListener('click', function(e){scoreboardClick(e);}, false);
        btn.classList.add('scoreboardButton');
        btn.classList.add((buttonType + 'score').toLowerCase());
        parentRow.appendChild(btn);
}

function updateScores()
{
    for (var i = 0; i < numPlayers; i++)
    {
        players[i].ScoreDiv.innerHTML = players[i].Name + ': ' + players[i].Score;
        
        if (i == currentPlayer)
        {
            players[i].ScoreDiv.innerHTML = '*' + players[i].ScoreDiv.innerHTML;
        }
        
        players[i].HistoryDiv.innerHTML = '';
        for (var d = 0; d < players[i].n; d++)
        {
            players[i].HistoryDiv.innerHTML += (players[i].Darts[d] + ' ');
            if (d % 3 == 2)
            {
                players[i].HistoryDiv.innerHTML += ' - ';
            }
        }
        
    }
    infoSection.innerHTML = 'Dart: ' + currentDart + ' ';
    for (var d = 0; d < currentDart; d++ )
    {
        infoSection.innerHTML += (darts[d] + ' ');    
    }
    
}

function drawScores()
{
    for (var i = 0; i < numPlayers; i++)
    {
        var scoreSection = document.createElement('div');
        scoreSection.classList.add('scoreSection');
        document.body.appendChild(scoreSection);
        scoreSection.innerHTML = players[i].Name + ': ' + players[i].Score;
        players[i].ScoreDiv = scoreSection;

        var historySection = document.createElement('div');
        historySection.classList.add('historySection');
        document.body.appendChild(historySection);
        players[i].HistoryDiv = historySection;
    }
    infoSection = document.createElement('div');
    infoSection.classList.add('infoSection');
    document.body.appendChild(infoSection);
    updateScores();
    
    var backButton = document.createElement('div');
    backButton.classList.add('backButton');
    backButton.addEventListener('click', function(e){goBack(e);}, false);
    backButton.innerHTML = '<<';
    document.body.appendChild(backButton);
    
    var forwardButton = document.createElement('div');
    forwardButton.classList.add('forwardButton');
    forwardButton.addEventListener('click', function(e){goForward(e);}, false);
    forwardButton.innerHTML = '>>';
    document.body.appendChild(forwardButton);
    
    updateScores();
    
}

function goBack()
{
    if (currentDart > 0)
    {
        currentDart --;
        calculateScores();
        updateScores();
    }
}

function goForward()
{
    if (currentDart < darts.length)
    {
        currentDart ++;
        calculateScores();
        updateScores();
    }
}


function drawBoard()
{
    // Create the scoreboard
    var n = 25;

    var scoreboard = document.createElement('div');
    scoreboard.classList.add('scoreboard');
    document.body.appendChild(scoreboard);
    
    while(n > 0)
    {
        var ns = n.toString();
        
        // Create a row
        var sbRow = document.createElement('div');
        sbRow.classList.add('scoreboardRow');
        sbRow.Id = 'sbRow' + ns;
        scoreboard.appendChild(sbRow);
        
        addScoreboardButton(sbRow, 'D', ns);
        addScoreboardButton(sbRow, 'S', ns);
        
        if (n < 25)
        {
            addScoreboardButton(sbRow, 'T', ns);
        }
        
        if (n < 25)
        {
            n--;
        }
        else
        {
            n = 20;
        }
    }
    
    scoresRow = document.createElement('div');
    scoresRow.Id = 'scoresRow';
    document.body.appendChild(scoresRow);
    drawScores();
}

function updateScore(player, score)
{
    scoresRow.innerHTML = 'Score: ' + score;
}

// Target click callback
function scoreboardClick(object)
{
    var dart = object.target.Title;
    darts[currentDart] = dart;
    currentDart ++;
    calculateScores();
    updateScores();
    
}

(function(){
    window.onload = drawBoard;
})();
