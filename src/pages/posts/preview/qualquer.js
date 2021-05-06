var pData = {};

var lockEnterKey = false;

var cardPos = [5,147,287,425];
var targets = new Array();
var cardArr = new Array();
var waitForCards = 0;
var cardstopped = 3;
var cardSpeed = 5;
var flipwait2 = 0;
var shuffletime = 0;
var allowSub = 0;
var card1;
var card2;
var card3;
var cardBackgrounds = new Array();
var timesRun = 0;
function initDen()
{
	var params = {};
	params['sc'] = userVars["sc"];
	params['userID'] = userVars["userID"];
	params['password'] = userVars["password"];
	webCall("get_values", params, function(data) {
				flshToArr(data, "", function(bnkArr) {
				pData = bnkArr;
				pData["df_cash"] = parseInt(pData["df_cash"]);
				pData["df_bankcash"] = parseInt(pData["df_bankcash"]);
				var waitForSetup = setInterval(function() {
					if(hrV !== 0)
					{
						clearInterval(waitForSetup);
						setupDen();
					}
				}, 10);
			});
		});
	$("#betAmt").keydown(function(evt) {
		if(evt.keyCode === 13 && !lockEnterKey)
		{
			lockEnterKey = true;
			placeBet();
		}
	}).keyup(function(evt) {
		lockEnterKey = false;
	});
	
	card1 = document.getElementById("card1");
	card2 = document.getElementById("card2");
	card3 = document.getElementById("card3");
	cardArr.push(card1);
	cardArr.push(card2);
	cardArr.push(card3);
	
	var setBtn = document.createElement("div");
	setBtn.innerHTML = "&#9965;";
	setBtn.classList.add("opElem");
	setBtn.style.top = "5px";
	setBtn.style.right = "5px";
	setBtn.style.fontSize = "14pt";
	setBtn.addEventListener("click", loadSettings);
	document.getElementById("gamblingden").appendChild(setBtn);
	var frm = document.createElement("iframe");
	frm.id = "settingsBox";
	document.getElementById("gamblingden").parentNode.appendChild(frm);
	document.getElementById("gamblingden").parentNode.style.position = "relative";
}

function setupDen()
{
	$("#playerMessage").text("Bet must be between $100 and $100,000.");
	//bankData["df_cash"] = 23000000000;
	//bankData["df_bankcash"] = 23000000000;
	cardBackgrounds[0] = "hotrods/hotrods_v"+hrV+"/HTML5/images/gamblingden/card_queen.png";
	cardBackgrounds[1] = "hotrods/hotrods_v"+hrV+"/HTML5/images/gamblingden/card_jack1.png";
	cardBackgrounds[2] = "hotrods/hotrods_v"+hrV+"/HTML5/images/gamblingden/card_jack2.png";
	var cash = "Cash: $"+nf.format(pData["df_cash"]);
	$(".heldCash").text(cash).attr("data-cash", cash);
	$("#betAmt").attr("max", (pData["df_cash"]<=100000?pData["df_cash"]:100000));
	pageLock = false;
	lockInput();
	//lockInput(1);
}

function lockInput()
{
	var elem = $("#betAmt");
	var val = parseInt(elem.val());
	if(val >= 100 && val <= parseInt(pData["df_cash"]) && val <= 100000 && !pageLock)
	{
		$("#placeBet").attr("disabled", false);
	} else {
		$("#placeBet").attr("disabled", true);
	}
}

function moveCards() 
{
	playSound("gamble");
	$(".playingCard").children().attr("alt", "").attr("title", "");
	$("#playerMessage").text("Keep your eyes on the queen!");
	cardPos = [5,147,287,425];
	targets = new Array();
	waitForCards = 0;
	cardstopped = 3;
	cardSpeed = 5;
	flipwait2 = 0;
	shuffletime = 0;
	allowSub = 0;
	$(".playingCard").children().attr("src", "hotrods/hotrods_v"+hrV+"/HTML5/images/gamblingden/card_back.png");
	targets.push(card1.offsetLeft);
	targets.push(card2.offsetLeft);
	targets.push(card3.offsetLeft);
	
	shuffletime = 180 + Math.round(Math.random()*120);
	timesRun = 0;
	setTimeout(runLoop, 16);
}

function runLoop()
{
	for(var g = 0; g < cardArr.length; g++)
	{
		if(targets[g] != cardArr[g].offsetLeft)
		{
			if(cardArr[g].offsetLeft - targets[g] > 0)
			{
				cardArr[g].style.left = cardArr[g].offsetLeft-cardSpeed+"px";
				if(cardArr[g].offsetLeft <= targets[g])
				{
					cardArr[g].style.left = targets[g]+"px";
					cardstopped += 1;
				}
			} else {
				cardArr[g].style.left = cardArr[g].offsetLeft+cardSpeed+"px";
				if(cardArr[g].offsetLeft >= targets[g])
				{
					cardArr[g].style.left = targets[g]+"px";
					cardstopped += 1;
				}
			}
		}
	}
	if(flipwait2 >= 100 && shuffletime > 0)
	{
		shuffletime -= 1;
		cardSpeed += 0.3;
		var i = 0;
		while(i <= 1000)
		{
			var cardnum = Math.round(Math.random()*2);
			var currentCard = cardArr[cardnum];
			if(targets.length > 0 && cardstopped > 1)
			{
				if(targets[cardnum] == currentCard.offsetLeft)
				{
					var chosenposition = Math.round(Math.random()*(cardPos.length-1));
					if(targets[cardnum] != cardPos[chosenposition])
					{
						targets[cardnum] = cardPos[chosenposition];
						cardPos.splice(chosenposition, 1);
						var found = 0;
						for(var a = 0; a < 2; a++)
						{
							if(targets[a] == currentCard.offsetLeft)
							{
								found = 1;
							}
						}
						if(found == 0)
						{
							cardPos.push(currentCard.offsetLeft);
						}
						cardstopped -= 1;
						break;
					}
				}
				i++;
				continue;
			}
			break;
		}
	} else {
		flipwait2++;
	}
	if(shuffletime <= 0)
	{
		$("#playerMessage").text("Pick a card, any card!");
		waitForCards = 1;
	}
	if(waitForCards == 1 && cardstopped == 3)
	{
		if(allowSub == 0)
		{
			allowSub = 1;
			$(".playingCard").attr("disabled", false);
		}
	} else {
		if(timesRun === 0)
		{
			setTimeout(runLoop, 16);
			timesRun = 1;
		} else {
			if(timesRun === 1)
			{
				timesRun = 2;
			} else {
				timesRun = 0;
			}
			setTimeout(runLoop, 17);
		}
	}
}

function switchCards(cardButton)
{
	$(".playingCard").attr("disabled", true);
	var params = {};
	params['password'] = userVars["password"];
	params['userID'] = userVars["userID"];
	params['sc'] = userVars["sc"];
	params['templateID'] = userVars["templateID"];
	params['betAMT'] = parseInt($("#betAmt").val());
	webCall("gamble", params, function(data) {
		var curCash = pData["df_cash"];
		$.each(flshToArr(data), function(key, val) {
			pData[key] = val;
		});
		allowSub = false;
		var didWin = false;
		if(curCash < pData["df_cash"])
		{
			didWin = true;
		}
		var cash = "Cash: $"+nf.format(pData["df_cash"]);
		$(".heldCash").text(cash).attr("data-cash", cash);
		if(didWin)
		{
			playSound("gamble");
			cardButton.childNodes[0].src = cardBackgrounds[0];
			cardButton.childNodes[0].alt = "Queen";
			cardButton.childNodes[0].title = "Queen";
			$("#playerMessage").text("You got lucky that time, enjoy your winnings.");
			cardBackgrounds.splice(0, 1);
			
			setTimeout(function() {
				var secondCardPosition = Math.round(Math.random());
				$(".playingCard").not(cardButton)[0].childNodes[0].src = cardBackgrounds[secondCardPosition];
				cardBackgrounds.splice(secondCardPosition, 1);
				$(".playingCard").not(cardButton)[1].childNodes[0].src = cardBackgrounds[0];
				
				$(".playingCard").not(cardButton)[0].childNodes[0].alt = "Jack";
				$(".playingCard").not(cardButton)[0].childNodes[0].title = "Jack";
				$(".playingCard").not(cardButton)[1].childNodes[0].alt = "Jack";
				$(".playingCard").not(cardButton)[1].childNodes[0].title = "Jack";
				setupDen();
			}, 3000);
		} else {
			var randomJack =  Math.round(Math.random())+1;
			cardButton.childNodes[0].src = cardBackgrounds[randomJack];
			cardButton.childNodes[0].alt = "Jack";
			cardButton.childNodes[0].title = "Jack";
			$("#playerMessage").text("Poor luck mate, care to try again?");
			cardBackgrounds.splice(randomJack, 1);
			setTimeout(function() {
				var secondCardPosition = Math.round(Math.random());
				$(".playingCard").not(cardButton)[0].childNodes[0].src = cardBackgrounds[secondCardPosition];
				cardBackgrounds.splice(secondCardPosition, 1);
				$(".playingCard").not(cardButton)[1].childNodes[0].src = cardBackgrounds[0];
				if(secondCardPosition == 0)
				{
					$(".playingCard").not(cardButton)[0].childNodes[0].alt = "Queen";
					$(".playingCard").not(cardButton)[1].childNodes[0].alt = "Jack";
					$(".playingCard").not(cardButton)[0].childNodes[0].title = "Queen";
					$(".playingCard").not(cardButton)[1].childNodes[0].title = "Jack";
				} else {
					$(".playingCard").not(cardButton)[1].childNodes[0].alt = "Queen";
					$(".playingCard").not(cardButton)[0].childNodes[0].alt = "Jack";
					$(".playingCard").not(cardButton)[1].childNodes[0].title = "Queen";
					$(".playingCard").not(cardButton)[0].childNodes[0].title = "Jack";
				}
				setupDen();
			}, 3000);
		}
	});
}

function placeBet()
{
	if(!pageLock)
	{
		var params = {};
		params['sc'] = userVars["sc"];
		params['userID'] = userVars["userID"];
		params['password'] = userVars["password"];
		webCall("get_values", params, function(data) {
					flshToArr(data, "", function(bnkArr) {
					pData = bnkArr;
					pData["df_cash"] = parseInt(pData["df_cash"]);
					pData["df_bankcash"] = parseInt(pData["df_bankcash"]);
				});
			});
		var amt = parseInt($("#betAmt").val());
		if(amt >= 100 && amt <= pData["df_cash"] && amt <= 100000)
		{
			pageLock = true;
			lockInput();
			pData["df_cash"] -= amt;
			moveCards();
			var cash = "Cash: $"+nf.format(pData["df_cash"]);
			$(".heldCash").text(cash).attr("data-cash", cash);
		} else {
			pageLock = true;
			$("#playerMessage").text("You don't have that amount of cash.");
			setTimeout(setupDen, 3000);
		}
	}
}