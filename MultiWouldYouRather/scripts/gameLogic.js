import Multipeer from 'Multipeer';
import Diagnostics from 'Diagnostics';
import Scene from 'Scene';
import Time from 'Time';
import FaceGestures from 'FaceGestures';
import FaceTracking from 'FaceTracking';
import Animation from 'Animation';
import Materials from 'Materials';
import TouchGestures from 'TouchGestures';

const face = FaceTracking.face(0);
const gameTopicChannel = Multipeer.getMessageChannel("GameTopic");

// varaibles to change
const timeGiven = 7;
const particleTimeInSeconds = 3;
const numberOfConfetti = 10;
const numberOfEmojis = 5;

var userID = "";
var userIDs = new Array();
var headTilt = -1;
var currentText = "";
var canClick = true;
var countDown = timeGiven;

var userHeadsTilt = {};
var countDownIntervalTimer;
var selectedInteger = 0;
var hasCheckedUsersHeadTilt = false;
var isInit = false;
var inRound = false;
const intervalTimer = Time.setInterval(Update, 1000);

// questions text
var redQuestionTextA;
var blueQuestionTextA;
var redQuestionTextB;
var blueQuestionTextB;

// particles
var fountainLeft;
var fountainRight;
var fountainLeftEmoji;
var fountainRightEmoji;

// questions boxes
var redBoxA;
var blueBoxA;
var redBoxB;
var blueBoxB;

// instructions
var instructionsTextA;
var instructionsTextB;

// blue and red flash
var flashBlueMAT;
var flashRedMAT;

// thinking boxs
var smallerThinkingBubble;
var thinkingBubble;

// scale boxs
var scaleUptD;
var scaleDowntD;

function Update() {
  if (userIDs.length <= Object.keys(userHeadsTilt).length && !hasCheckedUsersHeadTilt && Object.keys(userHeadsTilt).length != 0) {
    hasCheckedUsersHeadTilt = true;

    if (CheckSameUserHeadTilt()) {
      // blue
      // Diagnostics.log("particles")
      TurnConfettiOn();
      if (headTilt == 0) {
        ScaleUpBox(redBoxB);
        // ScaleDownBox(blueBoxB);
      }
      else if (headTilt == 1) {
        ScaleUpBox(blueBoxB);
        // ScaleDownBox(redBoxB);
      }
    } else {
      if (headTilt == 0) {
        // Diagnostics.log("flash red");
        // red answer
        RedBoxFlash();
      }
      else if (headTilt == 1) {
        // Diagnostics.log("flash blue");
        // blue answer
        BlueBoxFlash();
      }
    }
  }
  
  // check for game over
  if (userIDs.length == Object.keys(userHeadsTilt).length) {
    if (inRound) {
      MoveBoxesToCenter();
      ScaleClouds(false);
      // able to tap again
      Time.setTimeout(function(){
        canClick = true;
      }, 1000);
      inRound = false;
    }
  }
  
}

function TurnConfettiOn() {  
  fountainLeft.birthrate = numberOfConfetti;
  fountainRight.birthrate = numberOfConfetti;
  fountainLeftEmoji.birthrate = numberOfEmojis;
  fountainRightEmoji.birthrate = numberOfEmojis;

  Time.setTimeout(TurnConfettiOff, particleTimeInSeconds * 1000);
}

function TurnConfettiOff() {  
  fountainLeft.birthrate = 0;
  fountainRight.birthrate = 0;
  fountainLeftEmoji.birthrate = 0;
  fountainRightEmoji.birthrate = 0;
}

function CheckSameUserHeadTilt() {
  var isSameHeadTilt = 0;
  var index = 0;
  var result = true;
  for (const [key, value] of Object.entries(userHeadsTilt)) {
    if (index == 0) {
      isSameHeadTilt = value;
    } else {
      if (value != isSameHeadTilt) {
        result = false;
      }
    }
    if (value == -1) {
      result = false;
    }
    index++;
  }
  return result;
}

function Init() {
  flashBlueMAT.opacity = 0;
  flashRedMAT.opacity = 0;

  userID = Makeid(6);
  userIDs.push(userID);
  sendUserId();
  isInit = true;
}

function Makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() *
 charactersLength)));
   }
   return result.join('');
}

function StartNewRound() {
  //round started
  if (!canClick) {
    return;
  }

  instructionsTextA.hidden = true;
  instructionsTextB.hidden = true;
  
  redBoxA.hidden = false;
  redBoxB.hidden = false;

  inRound = true;
  
  TurnConfettiOff();
  StartCountDown();
  userHeadsTilt = {};
}

function StartCountDown() {
  ResetBoxSizes();
  ScaleClouds(true);
  canClick = false;
  headTilt = -1;
  countDown = timeGiven;
  hasCheckedUsersHeadTilt = false;
  
  redBoxB.transform.scaleX = 0;
  redBoxB.transform.scaleY = 0;
  blueBoxB.transform.scaleX = 0;
  blueBoxB.transform.scaleY = 0;
  
  SelectQuestions(selectedInteger);
}

function SendUserHeadTilt() {
  gameTopicChannel.sendMessage({
    "userID": userID,
    "headTilt": headTilt
  }).catch(err => {
    Diagnostics.log(err);
  });
}

function SelectRandomNumber() {
  return Math.floor(Math.random() * (349 - 0) + 0);
}

function SelectQuestions(number)
{
    var redQuestionString = "";
    var blueQuestionString = "";

    if (number == 0) {
        redQuestionString = "Eat junk food for a year";
        blueQuestionString = "Eat salad for a year";
    }
    else if (number == 1) {
        redQuestionString = "Never have any homework";
        blueQuestionString = "Never have any exams";
    }
    else if (number == 2) {
        redQuestionString = "Go to school";
        blueQuestionString = "Go to work";
    }
    else if (number == 3) {
        redQuestionString = "Never die";
        blueQuestionString = "Have unlimited money";
    }
    else if (number == 4) {
      redQuestionString = "Live in the Harry Potter world and be a wizard";
      blueQuestionString = "Live in the Star Wars world and be a Jedi";
    }
    else if (number == 5) {
      redQuestionString = "Double your lifespan";
      blueQuestionString = "Be able to think twice as fast";
    }
    else if (number == 6) {
      redQuestionString = "Watch TV all day";
      blueQuestionString = "Sleep all day";
    }
    else if (number == 7) {
      redQuestionString = "Live in Antarctica for a year";
      blueQuestionString = "Spend a year in the desert";
    }
    else if (number == 8) {
      redQuestionString = "Be a wizard";
      blueQuestionString = "Be a ninja";
    }
    else if (number == 9) {
      redQuestionString = "Never eat a hot meal again";
      blueQuestionString = "Never have a cold drink again";
    }
    else if (number == 10) {
      redQuestionString = "Always be naked";
      blueQuestionString = "Always be itchy";
    }
    else if (number == 11) {
      redQuestionString = "Have to learn to walk all over again";
      blueQuestionString = "Have to learn how to write all over again";
    }
    else if (number == 12) {
      redQuestionString = "Have no one show up at your funeral";
      blueQuestionString = "Have no one show up at your wedding";
    }
    else if (number == 13) {
      redQuestionString = "Have bad breath";
      blueQuestionString = "Have smelly feet";
    }
    else if (number == 14) {
      redQuestionString = "Be the first to climb Mt. Everest";
      blueQuestionString = "Be the first on the Moon";
    }
    else if (number == 15) {
      redQuestionString = "Have free movies for life";
      blueQuestionString = "Have free lunches for life";
    }
    else if (number == 16) {
      redQuestionString = "Be the smartest moron";
      blueQuestionString = "Be the dumbest genius";
    }
    else if (number == 17) {
      redQuestionString = "Check your email first every morning";
      blueQuestionString = "Check social media sites first every morning";
    }
    else if (number == 18) {
      redQuestionString = "Always be late";
      blueQuestionString = "Always be unprepared";
    }
    else if (number == 19) {
      redQuestionString = "Marry a new random person every year";
      blueQuestionString = "Marry one random person and stick with it";
    }
    else if (number == 20) {
      redQuestionString = "Have constantly damp palms";
      blueQuestionString = "Have forever stick fingers";
    }
    else if (number == 21) {
      redQuestionString = "Be extremely paranoid";
      blueQuestionString = "Be extremely naive";
    }
    else if (number == 22) {
      redQuestionString = "Always be dressed appropriately for the weather";
      blueQuestionString = "Always have a noticeably pleasant body odour";
    }
    else if (number == 23) {
      redQuestionString = "Know the date of your death";
      blueQuestionString = "Know the cause of your death";
    }
    else if (number == 24) {
      redQuestionString = "Lose your preferred hand";
      blueQuestionString = "Lose your preferred foot";
    }
    else if (number == 25) {
      redQuestionString = "Never watch baseball again";
      blueQuestionString = "Never watch football again";
    }
    else if (number == 26) {
      redQuestionString = "Arrive everywhere 5 minutes late";
      blueQuestionString = "Arrive everywhere 20 minutes early";
    }
    else if (number == 27) {
      redQuestionString = "Have the same hairstyle for the rest of your life";
      blueQuestionString = "Have the same phone for the rest of your life";
    }
    else if (number == 28) {
      redQuestionString = "Always drive under the speeding limit";
      blueQuestionString = "Always drive over the speeding limit";
    }
    else if (number == 29) {
      redQuestionString = "Spend the day at the amusement park";
      blueQuestionString = "Spend the day at the water park";
    }
    else if (number == 30) {
      redQuestionString = "Witness a meteor hitting Earth";
      blueQuestionString = "Witness a volcano erupting";
    }
    else if (number == 31) {
      redQuestionString = "Your farts were silent but smelled twice as bad";
      blueQuestionString = "Your farts were odourless but twice as loud";
    }
    else if (number == 32) {
      redQuestionString = "Get paid for playing sports";
      blueQuestionString = "Get paid for playing video games";
    }
    else if (number == 33) {
      redQuestionString = "Kiss a random stranger";
      blueQuestionString = "Kiss a person you hate";
    }
    else if (number == 34) {
      redQuestionString = "Have no eyebrows for the rest of your life";
      blueQuestionString = "Be completely bald for the rest of your life";
    }
    else if (number == 35) {
      redQuestionString = "Fly like Superman";
      blueQuestionString = "Travel like Spiderman";
    }
    else if (number == 36) {
      redQuestionString = "Kiss a girl";
      blueQuestionString = "Kiss a boy";
    }
    else if (number == 37) {
      redQuestionString = "Sweat blood";
      blueQuestionString = "Sweat milk";
    }
    else if (number == 38) {
      redQuestionString = "Be in prison for 1 year";
      blueQuestionString = "Be in a coma for 2 years";
    }
    else if (number == 39) {
      redQuestionString = "Use sandpaper for toilet paper";
      blueQuestionString = "Use vinegar for eye drops";
    }
    else if (number == 40) {
      redQuestionString = "Be able to do magic";
      blueQuestionString = "Live without internet";
    }
    else if (number == 41) {
      redQuestionString = "Have on wish granted today";
      blueQuestionString = "Have three wishes granted in 10 years";
    }
    else if (number == 42) {
      redQuestionString = "Lose your best friend";
      blueQuestionString = "Lose a member of your family";
    }
    else if (number == 43) {
      redQuestionString = "Be a professional athlete";
      blueQuestionString = "Be a famous actor";
    }
    else if (number == 44) {
      redQuestionString = "Have a shower in the morning";
      blueQuestionString = "Have a shower in the evening";
    }
    else if (number == 45) {
      redQuestionString = "Be able to talk to animals";
      blueQuestionString = "Be able to speak all foreign languages";
    }
    else if (number == 46) {
      redQuestionString = "Be an Olympic gold medallist";
      blueQuestionString = "Have a pause button on your life";
    }
    else if (number == 47) {
      redQuestionString = "Get 4 hours of sleep per night";
      blueQuestionString = "Get 15 hours of sleep per night";
    }
    else if (number == 48) {
      redQuestionString = "Have your favorite character killed";
      blueQuestionString = "Have your least favorite character as the main character";
    }
    else if (number == 49) {
      redQuestionString = "Have a large painting of yourself";
      blueQuestionString = "Have a life size sculpture of yourself";
    }
    else if (number == 50) {
      redQuestionString = "Never see again";
      blueQuestionString = "Never walk again";
    }
    else if (number == 51) {
      redQuestionString = "Be alone";
      blueQuestionString = "Be in an unhappy relationship";
    }
    else if (number == 52) {
      redQuestionString = "Never be able touch anyone again";
      blueQuestionString = "Never be able talk to anyone again";
    }
    else if (number == 53) {
      redQuestionString = "Never eat sweets again";
      blueQuestionString = "Never eat chocolate again";
    }
    else if (number == 54) {
      redQuestionString = "Be famous in this lifetime";
      blueQuestionString = "Go down in the history books";
    }
    else if (number == 55) {
      redQuestionString = "Sleep on soft ground with a hard pillow";
      blueQuestionString = "Sleep on hard ground with a soft pillow";
    }
    else if (number == 56) {
      redQuestionString = "Never die";
      blueQuestionString = "Have unlimited money";
    }
    else if (number == 57) {
      redQuestionString = "Have no teeth";
      blueQuestionString = "Have no hair";
    }
    else if (number == 58) {
      redQuestionString = "Eat a handful of hair";
      blueQuestionString = "Lick three public telephones";
    }
    else if (number == 59) {
      redQuestionString = "Have two sets of twins";
      blueQuestionString = "Have Quadruplets";
    }
    else if (number == 60) {
      redQuestionString = "Sing every word you speak";
      blueQuestionString = "Always speak in rhymes";
    }
    else if (number == 61) {
      redQuestionString = "Drink a cup of blood";
      blueQuestionString = "Drink a cup of saliva";
    }
    else if (number == 62) {
      redQuestionString = "Ski in the mountains";
      blueQuestionString = "Have a vacation on the beach";
    }
    else if (number == 63) {
      redQuestionString = "Be able to run at 100 kilometers per hour";
      blueQuestionString = "Be able to fly at 10 kilometers per hour";
    }
    else if (number == 64) {
      redQuestionString = "Win $70,000";
      blueQuestionString = "Let your best friend win $250,000";
    }
    else if (number == 65) {
      redQuestionString = "Not have an afterlife";
      blueQuestionString = "Live your afterlife in hell";
    }
    else if (number == 66) {
      redQuestionString = "Relive the 10 saddest minutes of your life";
      blueQuestionString = "Relive 1 hour of your most embarrassing moments";
    }
    else if (number == 67) {
      redQuestionString = "Be able to visit 100 years in the past";
      blueQuestionString = "Be able to visit 100 years in the future";
    }
    else if (number == 68) {
      redQuestionString = "Have a broken heart";
      blueQuestionString = "Have a broken bone";
    }
    else if (number == 69) {
      redQuestionString = "Have 10 friends in real life";
      blueQuestionString = "Have 10000 friends on Instagram";
    }
    else if (number == 70) {
      redQuestionString = "Wear nothing but jeans";
      blueQuestionString = "Wear nothing but shorts";
    }
    else if (number == 71) {
      redQuestionString = "Be an amazing cook";
      blueQuestionString = "Be an amazing dancer";
    }
    else if (number == 72) {
      redQuestionString = "Never be able to read a book again";
      blueQuestionString = "Never be able to watch television again";
    }
    else if (number == 73) {
      redQuestionString = "String your opponent along for the entire fight";
      blueQuestionString = "Crush them from the beginning";
    }
    else if (number == 74) {
      redQuestionString = "Be hairy all over";
      blueQuestionString = "Be completely bald";
    }
    else if (number == 75) {
      redQuestionString = "Have the ability to know when someone's lying";
      blueQuestionString = "Never have anyone lie to you again";
    }
    else if (number == 76) {
      redQuestionString = "Answer Yes to every question";
      blueQuestionString = "Answer No to every question";
    }
    else if (number == 77) {
      redQuestionString = "Be adopted";
      blueQuestionString = "Adopt a child right now";
    }
    else if (number == 78) {
      redQuestionString = "Have 20 million YouTube subscribers";
      blueQuestionString = "Produce a blockbuster action movie";
    }
    else if (number == 79) {
      redQuestionString = "Meet your idol";
      blueQuestionString = "Be popular in school";
    }
    else if (number == 80) {
      redQuestionString = "Never have to eat again";
      blueQuestionString = "Never have to sleep again";
    }
    else if (number == 81) {
      redQuestionString = "Wear the same thing every day";
      blueQuestionString = "Never wear the same clothes twice";
    }
    else if (number == 82) {
      redQuestionString = "Lose your wallet";
      blueQuestionString = "Lose your phone";
    }
    else if (number == 83) {
      redQuestionString = "Be a meter taller";
      blueQuestionString = "Be a meter shorter";
    }
    else if (number == 84) {
      redQuestionString = "Have a job you love and make no money";
      blueQuestionString = "Have a job that you hate and make loads of money";
    }
    else if (number == 85) {
      redQuestionString = "Have a desk job";
      blueQuestionString = "Have outdoor job";
    }
    else if (number == 86) {
      redQuestionString = "Burn to death";
      blueQuestionString = "Drown";
    }
    else if (number == 87) {
      redQuestionString = "Fart in front of your crush";
      blueQuestionString = "Get caught picking your nose by your crush";
    }
    else if (number == 88) {
      redQuestionString = "Have the ability to teleport";
      blueQuestionString = "Have the ability to be invisible";
    }
    else if (number == 89) {
      redQuestionString = "Have your team win without contributing";
      blueQuestionString = "Have your team lose after you played your best";
    }
    else if (number == 90) {
      redQuestionString = "Truth";
      blueQuestionString = "Dare";
    }
    else if (number == 91) {
      redQuestionString = "Sneeze every three minutes";
      blueQuestionString = "Always have the sensation to sneeze and never do";
    }
    else if (number == 92) {
      redQuestionString = "See the most beautiful thing in the world";
      blueQuestionString = "Taste the most delicious thing in the world";
    }
    else if (number == 93) {
      redQuestionString = "Have dinner with the president";
      blueQuestionString = "Have dinner with your favourite celebrity";
    }
    else if (number == 94) {
      redQuestionString = "Chase your career";
      blueQuestionString = "Get married and start a family";
    }
    else if (number == 95) {
      redQuestionString = "Have a friend with really smelly breath";
      blueQuestionString = "Have a friend that farts all the time";
    }
    else if (number == 96) {
      redQuestionString = "Have a baby boy";
      blueQuestionString = "Have a baby girl";
    }
    else if (number == 97) {
      redQuestionString = "Teach history";
      blueQuestionString = "Teach math";
    }
    else if (number == 98) {
      redQuestionString = "Drink old milk";
      blueQuestionString = "Eat mouldy cheese";
    }
    else if (number == 99){
      redQuestionString = "Get rid of all the bad drivers on the road";
      blueQuestionString = "Never have to wait in line at stores and restaurants";
    }  
    else if (number == 100) {
      redQuestionString = "Have the ability to see 10 minutes into the future";
      blueQuestionString = "Have the ability to see 150 years into the future";
    }
    else if (number == 101) {
      redQuestionString = "Have telekinesis (the ability to move things with your mind)";
      blueQuestionString = "Have telepathy (the ability to read minds)";
    }
    else if (number == 102) {
      redQuestionString = "Team up with Wonder Woman";
      blueQuestionString = "Team up with Captain marvel";
    }
    else if (number == 103) {
      redQuestionString = "Be forced to sing along";
      blueQuestionString = "Be forced to dance to every single song you hear";
    }
    else if (number == 104) {
      redQuestionString = "Find true love today";
      blueQuestionString = "Win the lottery next year";
    }
    else if (number == 105) {
      redQuestionString = "Be in jail for five years";
      blueQuestionString = "Be in a coma for a decade";
    }
    else if (number == 106) {
      redQuestionString = "Have another 10 years with your partner";
      blueQuestionString = "Have a one-night stand with your celebrity crush";
    }
    else if (number == 107) {
      redQuestionString = "Be chronically under-dressed";
      blueQuestionString = "Be chronically overdressed";
    }
    else if (number == 108) {
      redQuestionString = "Have everyone you know be able to read your thoughts";
      blueQuestionString = "For everyone you know to have access to your internet history";
    }
    else if (number == 109) {
      redQuestionString = "Lose your sight";
      blueQuestionString = "Lose your memories";
    }
    else if (number == 110) {
      redQuestionString = "Have universal respect";
      blueQuestionString = "Have unlimited power";
    }
    else if (number == 111) {
      redQuestionString = "Give up air conditioning and heating for the rest of your life";
      blueQuestionString = "Give up the internet for the rest of your life";
    }
    else if (number == 112) {
      redQuestionString = "Swim in a pool full of Nutella";
      blueQuestionString = "Swim in a pool full of maple syrup";
    }
    else if (number == 113) {
      redQuestionString = "Labor under a hot sun";
      blueQuestionString = "Labor in Extreme cold";
    }
    else if (number == 114) {
      redQuestionString = "Stay in during a snow day";
      blueQuestionString = "Build a fort during a snow day";
    }
    else if (number == 115) {
      redQuestionString = "Buy 10 things you don’t need every time you go shopping";
      blueQuestionString = "Always forget the one thing that you need when you go to the store";
    }
    else if (number == 116) {
      redQuestionString = "Never be able to go out during the day";
      blueQuestionString = "Never be able to go out at night";
    }
    else if (number == 117) {
      redQuestionString = "Have a personal maid";
      blueQuestionString = "Have a personal chef";
    }
    else if (number == 118) {
      redQuestionString = "Have Beyoncé's talent";
      blueQuestionString = "Have Jay-z‘s business acumen";
    }
    else if (number == 119) {
      redQuestionString = "Be 11 feet tall";
      blueQuestionString = "Be nine inches tall";
    }
    else if (number == 120) {
      redQuestionString = "Be an extra in an Oscar-winning movie";
      blueQuestionString = "Be the lead in a box office bomb";
    }
    else if (number == 121) {
      redQuestionString = "Vomit on your hero";
      blueQuestionString = "Have your hero vomit on you";
    }
    else if (number == 122) {
      redQuestionString = "Communicate only in emoji";
      blueQuestionString = "Never be able to text at all ever again";
    }
    else if (number == 123) {
      redQuestionString = "Be royalty 1,000 years ago";
      blueQuestionString = "Be an average person today";
    }
    else if (number == 124) {
      redQuestionString = "Lounge by the pool";
      blueQuestionString = "Lounge on the beach";
    }
    else if (number == 125) {
      redQuestionString = "Wear the same socks for a month";
      blueQuestionString = "Wear the same underwear for a week";
    }
    else if (number == 126) {
      redQuestionString = "Work an overtime shift with your annoying boss";
      blueQuestionString = "Spend full day with your mother-in-law";
    }
    else if (number == 127) {
      redQuestionString = "Cuddle a koala";
      blueQuestionString = "Pal around with a panda";
    }
    else if (number == 128) {
      redQuestionString = "Have a sing-off with Ariana Grande";
      blueQuestionString = "Have a dance-off with Rihanna";
    }
    else if (number == 129) {
      redQuestionString = "Always have b.o. and not know it";
      blueQuestionString = "Always smell b.o. on everyone else";
    }
    else if (number == 130) {
      redQuestionString = "Watch nothing but hallmark christmas movies";
      blueQuestionString = "Watch nothing but horror movies";
    }
    else if (number == 131) {
      redQuestionString = "Always be 10 minutes late";
      blueQuestionString = "Always be 20 minutes early";
    }
    else if (number == 132) {
      redQuestionString = "Spend a week in the forest";
      blueQuestionString = "Spend a night in a real haunted house";
    }
    else if (number == 133) {
      redQuestionString = "Find a rat in your kitchen";
      blueQuestionString = "Find a roach in your bed";
    }
    else if (number == 134) {
      redQuestionString = "Have a pause button for your life";
      blueQuestionString = "Have a rewind button for your life";
    }
    else if (number == 135) {
      redQuestionString = "Always have a full phone battery";
      blueQuestionString = "Always have a full gas tank";
    }
    else if (number == 136) {
      redQuestionString = "Lose all your teeth";
      blueQuestionString = "Lose a day of your life every time you kissed someone";
    }
    else if (number == 137) {
      redQuestionString = "Drink from a toilet";
      blueQuestionString = "Pee in a litter box";
    }
    else if (number == 138) {
      redQuestionString = "Be forced to live the same day over and over again for a full year,";
      blueQuestionString = "Take 3 years off the end of your life";
    }
    else if (number == 139) {
      redQuestionString = "Never eat watermelon ever again";
      blueQuestionString = "Be forced to eat watermelon with every meal";
    }
    else if (number == 140) {
      redQuestionString = "Get a paper cut every time you turn a page";
      blueQuestionString = "Bite your tongue every time you eat";
    }
    else if (number == 141) {
      redQuestionString = "Oversleep every day for a week";
      blueQuestionString = "Not get any sleep at all for four days";
    }
    else if (number == 142) {
      redQuestionString = "Die in 20 years with no regrets";
      blueQuestionString = "Live to 100 with a lot of regrets";
    }
    else if (number == 143) {
      redQuestionString = "Sip gin with Ryan Reynolds";
      blueQuestionString = "Shoot tequila with Dwayne “The Rock” Johnson";
    }
    else if (number == 144) {
      redQuestionString = "Get trapped in the middle of a food fight";
      blueQuestionString = "Get trapped in the middle of a water balloon fight";
    }
    else if (number == 145) {
      redQuestionString = "Walk to work in heels";
      blueQuestionString = "Drive to work in reverse";
    }
    else if (number == 146) {
      redQuestionString = "Spend a year at war";
      blueQuestionString = "Spend a year in prison";
    }
    else if (number == 147) {
      redQuestionString = "Die before your partner";
      blueQuestionString = "Die after your partner";
    }
    else if (number == 148) {
      redQuestionString = "Have a child every year for 20 years";
      blueQuestionString = "Never have any children at all";
    }
    else if (number == 149) {
      redQuestionString = "Take amazing selfies but look terrible in all other photos";
      blueQuestionString = "Be photogenic everywhere but in your selfies";
    }
    else if (number == 150) {
      redQuestionString = "Be gassy on a first date";
      blueQuestionString = "Be gassy on your wedding night";
    }
    else if (number == 151) {
      redQuestionString = "Have Danny Devito play you in a movie";
      blueQuestionString = "Have Danny Trejo play you in a movie";
    }
    else if (number == 152) {
      redQuestionString = "Be able to take back anything you say";
      blueQuestionString = "Hear any conversation that is about you";
    }
    else if (number == 153) {
      redQuestionString = "Have skin that changes color based on your emotions";
      blueQuestionString = "Tattoos appear all over your body depicting what you did yesterday";
    }
    else if (number == 154) {
      redQuestionString = "Hunt and butcher your own meat";
      blueQuestionString = "Never eat meat again";
    }
    else if (number == 155) {
      redQuestionString = "Lose all of your friends but keep your bff";
      blueQuestionString = "Lose your bff but keep the rest of your buds";
    }
    else if (number == 156) {
      redQuestionString = "Have people spread a terrible lie about you";
      blueQuestionString = "Have people spread terrible but true tales about you";
    }
    else if (number == 157) {
      redQuestionString = "Walk in on your parents";
      blueQuestionString = "Have them walk in on you";
    }
    else if (number == 158) {
      redQuestionString = "Be the absolute best at something that no one takes seriously";
      blueQuestionString = "Be average at something well respected";
    }
    else if (number == 159) {
      redQuestionString = "Have unlimited battery life on all of your devices";
      blueQuestionString = "Have free wifi wherever you go";
    }
    else if (number == 160) {
      redQuestionString = "Have Billie Eilish‘s future";
      blueQuestionString = "Have Madonna’s legacy";
    }
    else if (number == 161) {
      redQuestionString = "Have a third nipple";
      blueQuestionString = "Have an extra toe";
    }
    else if (number == 162) {
      redQuestionString = "Solve world hunger";
      blueQuestionString = "Solve global warming";
    }
    else if (number == 163) {
      redQuestionString = "Have to wear every shirt inside out";
      blueQuestionString = "Have to wear every pair of pants backward";
    }
    else if (number == 164) {
      redQuestionString = "Live in a treehouse";
      blueQuestionString = "Live in a cave";
    }
    else if (number == 165) {
      redQuestionString = "Win $25,000";
      blueQuestionString = "Your best friend win $100,000";
    }
    else if (number == 166) {
      redQuestionString = "Be in history books for something terrible";
      blueQuestionString = "Be forgotten completely after you die";
    }
    else if (number == 167) {
      redQuestionString = "Travel the world for free for a year";
      blueQuestionString = "Have $50,000 to spend however you please";
    }
    else if (number == 168) {
      redQuestionString = "Your to only be able to talk to your dog";
      blueQuestionString = "For your dog to be able to talk to only you—and everyone thinks you’re nuts";
    }
    else if (number == 169) {
      redQuestionString = "Have a mullet for a year";
      blueQuestionString = "Be bald (no wigs!) for six months";
    }
    else if (number == 170) {
      redQuestionString = "Go back to the past and meet your loved ones who passed away";
      blueQuestionString = "Go to the future to meet your children";
    }
    else if (number == 171) {
      redQuestionString = "Have Angelina Jolie’s lips";
      blueQuestionString = "Have Jennifer Aniston‘s hair";
    }
    else if (number == 172) {
      redQuestionString = "Stay the age you are physically forever";
      blueQuestionString = "Stay the way you are now financially forever";
    }
    else if (number == 173) {
      redQuestionString = "Be in a zombie apocalypse";
      blueQuestionString = "Be in a robot apocalypse";
    }
    else if (number == 174) {
      redQuestionString = "Be alone all your life";
      blueQuestionString = "Be surrounded by really annoying people";
    }
    else if (number == 175) {
      redQuestionString = "Give up your cellphone for a month";
      blueQuestionString = "Give up bathing for a month";
    }
    else if (number == 176) {
      redQuestionString = "Spend a day cleaning your worst enemy’s house";
      blueQuestionString = "Have your crush spend the day cleaning your house";
    }
    else if (number == 177) {
      redQuestionString = "Spend a year entirely alone";
      blueQuestionString = "Spend a year without a home";
    }
    else if (number == 178) {
      redQuestionString = "Buy only used underwear";
      blueQuestionString = "Buy only used toothbrushes";
    }
    else if (number == 179) {
      redQuestionString = "Have a photographic memory";
      blueQuestionString = "Have a IQ of 200";
    }
    else if (number == 180) {
      redQuestionString = "Go on a cruise with your boss";
      blueQuestionString = "Never go on vacation ever again";
    }
    else if (number == 181) {
      redQuestionString = "Forget your partner’s birthday";
      blueQuestionString = "Forget your anniversary every year";
    }
    else if (number == 182) {
      redQuestionString = "Have to wear stilettos to sleep";
      blueQuestionString = "Have to wear slippers everywhere you go";
    }
    else if (number == 183) {
      redQuestionString = "Change the outcome of the last election";
      blueQuestionString = "Get to decide the outcome of the next election";
    }
    else if (number == 184) {
      redQuestionString = "Lose the ability to read";
      blueQuestionString = "Lose the ability to speak";
    }
    else if (number == 185) {
      redQuestionString = "Smooch Chris Pratt";
      blueQuestionString = "Smooth Chris Hemsworth";
    }
    else if (number == 186) {
      redQuestionString = "Be beautiful and stupid";
      blueQuestionString = "Be unattractive but a genius";
    }
    else if (number == 187) {
      redQuestionString = "Have seven fingers on each hand";
      blueQuestionString = "Have seven toes on each foot";
    }
    else if (number == 188) {
      redQuestionString = "Work the job you have now for a year at double your current rate of pay";
      blueQuestionString = "Have one year off with what you are making now";
    }
    else if (number == 189) {
      redQuestionString = "Be always stuck in traffic but find a perfect parking spot";
      blueQuestionString = "Never hit traffic but always take forever to park";
    }
    else if (number == 190) {
      redQuestionString = "Have super-sensitive taste buds";
      blueQuestionString = "Have super-sensitive hearing";
    }
    else if (number == 191) {
      redQuestionString = "Ask your ex for a favor";
      blueQuestionString = "Ask a total stranger for a favor";
    }
    else if (number == 192) {
      redQuestionString = "Go on tour with Elton John";
      blueQuestionString = "Go on tour with Cher";
    }
    else if (number == 193) {
      redQuestionString = "Eat only pizza for a year";
      blueQuestionString = "Not eat any pizza for five years";
    }
    else if (number == 194) {
      redQuestionString = "Never get another present in your life but always pick the perfect present for everyone else";
      blueQuestionString = "Keep getting presents but giving terrible ones to everyone else";
    }
    else if (number == 195) {
      redQuestionString = "Sleep in a doghouse";
      blueQuestionString = "Let stray dogs sleep in your bed";
    }
    else if (number == 196) {
      redQuestionString = "Be able to speak any language";
      blueQuestionString = "Be able to communicate with animals";
    }
    else if (number == 197) {
      redQuestionString = "Have all of your messages and photos leak publicly";
      blueQuestionString = "Never use a cellphone ever again";
    }
    else if (number == 198) {
      redQuestionString = "Run at 100 mph";
      blueQuestionString = "Fly at 20 mph";
    }
    else if (number == 199) {
      redQuestionString = "Have Adele’s voice";
      blueQuestionString = "Have Normani’s dance moves";
    }
    else if (number == 200) {
      redQuestionString = "Have to wear sweatpants everywhere for the rest of your life";
      blueQuestionString = "Never wear sweatpants again";
    }
    else if (number == 201) {
      redQuestionString = "Have 10,000 spoons when all you need is a knife";
      blueQuestionString = "Always have a knife but never be able to use spoons";
    }
    else if (number == 202) {
      redQuestionString = "Detect every lie you hear";
      blueQuestionString = "Get away with every lie you tell";
    }
    else if (number == 203) {
      redQuestionString = "Be the funniest person in a room";
      blueQuestionString = "Be the smartest person in a room";
    }
    else if (number == 204) {
      redQuestionString = "Talk like Yoda";
      blueQuestionString = "Breathe like Darth Vader";
    }
    else if (number == 205) {
      redQuestionString = "People know all the details of your finances";
      blueQuestionString = "People know all the details of your love life";
    }
    else if (number == 206) {
      redQuestionString = "Listen to your least-favorite song on a loop for a year";
      blueQuestionString = "Never listen to any music at all for a year";
    }
    else if (number == 207) {
      redQuestionString = "Go vegan for a month";
      blueQuestionString = "Only eat meat and dairy for a month";
    }
    else if (number == 208) {
      redQuestionString = "Clean up someone else’s vomit";
      blueQuestionString = "Clean up someone else’s blood";
    }
    else if (number == 209) {
      redQuestionString = "Work for Michael Scott";
      blueQuestionString = "Work for Mr. burns";
    }
    else if (number == 210) {
      redQuestionString = "Spend the weekend with pirates";
      blueQuestionString = "Spend the weekend with ninjas";
    }
    else if (number == 211) {
      redQuestionString = "End every phone call with “I love you”";
      blueQuestionString = "Accidentally call your partner the wrong name during a fight";
    }
    else if (number == 212) {
      redQuestionString = "Get your paycheck given to you in pennies";
      blueQuestionString = "Never be able to use cash again";
    }
    else if (number == 213) {
      redQuestionString = "See Lady Gaga in a movie";
      blueQuestionString = "See Bradley Cooper in concert";
    }
    else if (number == 214) {
      redQuestionString = "Win the lottery but have to spend it all in one day";
      blueQuestionString = "Triple your current salary forever";
    }
    else if (number == 215) {
      redQuestionString = "Live until you are 200 and look your age";
      blueQuestionString = "Look like you’re 22 your whole life, but die at age 65";
    }
    else if (number == 216) {
      redQuestionString = "Give up cursing forever";
      blueQuestionString = "Give up ice cream for 12 years";
    }
    else if (number == 217) {
      redQuestionString = "Hear a comforting lie";
      blueQuestionString = "Hear an uncomfortable truth";
    }
    else if (number == 218) {
      redQuestionString = "Be locked for a week in a room that’s overly bright";
      blueQuestionString = "Be locked for a week in a room that’s totally dark";
    }
    else if (number == 219) {
      redQuestionString = "Someone see all the photos in your phone";
      blueQuestionString = "Someone read all your text messages";
    }
    else if (number == 220) {
      redQuestionString = "Have a South Park-themed wedding";
      blueQuestionString = "Have a Family Guy-themed funeral";
    }
    else if (number == 221) {
      redQuestionString = "Have to hunt and gather all of your food";
      blueQuestionString = "Eat Mcdonald’s for every meal";
    }
    else if (number == 222) {
      redQuestionString = "Have Fortune";
      blueQuestionString = "Have Fame";
    }
    else if (number == 223) {
      redQuestionString = "Celebrate the Fourth of July with Taylor Swift";
      blueQuestionString = "Celebrate Christmas with Mariah Carey";
    }
    else if (number == 224) {
      redQuestionString = "Only be able to listen to one song for the rest of your life";
      blueQuestionString = "Only be able to watch one movie for the rest of your life";
    }
    else if (number == 225) {
      redQuestionString = "Never use social media again";
      blueQuestionString = "Never watch another movie ever again";
    }
    else if (number == 226) {
      redQuestionString = "Have police hunting you down for a crime you didn’t commit";
      blueQuestionString = "Have a serial killer actually hunting you";
    }
    else if (number == 227) {
      redQuestionString = "Live a peaceful life in a small cabin in the woods";
      blueQuestionString = "Live a drama-filled life in a mansion in a big city";
    }
    else if (number == 228) {
      redQuestionString = "Find your soulmate";
      blueQuestionString = "Find your calling";
    }
    else if (number == 229) {
      redQuestionString = "Drink sour milk";
      blueQuestionString = "Brush your teeth with soap";
    }
    else if (number == 230) {
      redQuestionString = "Steal Duchess Meghan's style";
      blueQuestionString = "Steal Duchess Kate’s style";
    }
    else if (number == 231) {
      redQuestionString = "Never get a cold ever again";
      blueQuestionString = "Never be stuck in traffic ever again";
    }
    else if (number == 232) {
      redQuestionString = "Be tall and average looking";
      blueQuestionString = "Be three feet tall but beautiful";
    }
    else if (number == 233) {
      redQuestionString = "Visit the international space station for a week";
      blueQuestionString = "Spend a week in a hotel at the bottom of the ocean";
    }
    else if (number == 234) {
      redQuestionString = "Confess to cheating on your partner";
      blueQuestionString = "Catch your partner cheating on you";
    }
    else if (number == 235) {
      redQuestionString = "Have all traffic lights you approach be green";
      blueQuestionString = "Never have to stand in line again";
    }
    else if (number == 236) {
      redQuestionString = "Share an onscreen kiss with Leonardo Dicaprio";
      blueQuestionString = "Share an onscreen kiss with George Clooney";
    }
    else if (number == 237) {
      redQuestionString = "Never eat Christmas cookies ever again";
      blueQuestionString = "Never eat Halloween candy ever again";
    }
    else if (number == 238) {
      redQuestionString = "Lose your long-term memory";
      blueQuestionString = "Lose your short-term memory";
    }
    else if (number == 239) {
      redQuestionString = "Have a mullet";
      blueQuestionString = "Have a perm";
    }
    else if (number == 240) {
      redQuestionString = "Be stranded in the jungle";
      blueQuestionString = "Be stranded in the desert";
    }
    else if (number == 241) {
      redQuestionString = "Everyone you love forget your birthday";
      blueQuestionString = "Everyone you love sing “happy birthday” to you for 24 hours straight";
    }
    else if (number == 242) {
      redQuestionString = "Be invisible";
      blueQuestionString = "Be able to fly";
    }
    else if (number == 243) {
      redQuestionString = "Spend every weekend indoors";
      blueQuestionString = "Spend every weekend outdoors";
    }
    else if (number == 244) {
      redQuestionString = "Party with Jennifer Lopez and Alex Rodriguez";
      blueQuestionString = "Party with Kim Kardashian and Kanye West";
    }
    else if (number == 245) {
      redQuestionString = "Give up wine for a year";
      blueQuestionString = "Drink nothing but wine for a year";
    }
    else if (number == 246) {
      redQuestionString = "Start a colony on another planet";
      blueQuestionString = "Be the leader of a country on earth";
    }
    else if (number == 247) {
      redQuestionString = "Live in a house haunted by friendly ghosts";
      blueQuestionString = "Be a ghost reliving your average day after you die";
    }
    else if (number == 248) {
      redQuestionString = "Have one wish granted today";
      blueQuestionString = "10 wishes granted 20 years from now";
    }
    else if (number == 249) {
      redQuestionString = "Get hit on by someone 20 years older than you";
      blueQuestionString = "Get hit on by someone 20 years younger than you";
    }
    else if (number == 250) {
      redQuestionString = "Fall down in public";
      blueQuestionString = "Pass gas in public";
    }
    else if (number == 251) {
      redQuestionString = "Only eat raw food";
      blueQuestionString = "Only eat tv dinners";
    }
    else if (number == 252) {
      redQuestionString = "Run as fast as the Flash";
      blueQuestionString = "Be as strong as Superman";
    }
    else if (number == 253) {
      redQuestionString = "Never have a wedgie";
      blueQuestionString = "Never have anything stuck in your teeth ever again";
    }
    else if (number == 254) {
      redQuestionString = "Marry the most attractive person you’ve ever met";
      blueQuestionString = "Marry the best cook you’ve ever met";
    }
    else if (number == 255) {
      redQuestionString = "Sing karaoke with Gwen Stefani";
      blueQuestionString = "Sing karaoke with Kelly Clarkson";
    }
    else if (number == 256) {
      redQuestionString = "Go back to kindergarten with everything you know now";
      blueQuestionString = "Know now everything your future self will learn";
    }
    else if (number == 257) {
      redQuestionString = "Be able to read minds";
      blueQuestionString = "Be able to predict the future";
    }
    else if (number == 258) {
      redQuestionString = "Take a pill a day for nutrients and to feel full, but never eat anything again";
      blueQuestionString = "Eat whatever you want but never really feel full";
    }
    else if (number == 259) {
      redQuestionString = "Be an unknown superhero";
      blueQuestionString = "Be an infamous villain";
    }
    else if (number == 260) {
      redQuestionString = "Always have an annoying song stuck in your head";
      blueQuestionString = "Always have an itch that you can’t reach";
    }
    else if (number == 261) {
      redQuestionString = "Never be able to keep anyone else’s secrets";
      blueQuestionString = "Have someone tell all of your secrets";
    }
    else if (number == 262) {
      redQuestionString = "Be Batman";
      blueQuestionString = "Be Iron Man";
    }
    else if (number == 263) {
      redQuestionString = "Be married to someone stunning who doesn’t think you’re attractive";
      blueQuestionString = "Be married to someone ugly who thinks you’re gorgeous";
    }
    else if (number == 264) {
      redQuestionString = "Have a third ear";
      blueQuestionString = "Have a third eye";
    }
    else if (number == 265) {
      redQuestionString = "Have $1 million now";
      blueQuestionString = "Have $5,000 a week for the rest of your life";
    }
    else if (number == 266) {
      redQuestionString = "Binge-watch Sex and the City";
      blueQuestionString = "Binge-watch Girls";
    }
    else if (number == 267) {
      redQuestionString = "Be rich working a job you hate";
      blueQuestionString = "Be poor working a job you love";
    }
    else if (number == 268) {
      redQuestionString = "Wear real fur";
      blueQuestionString = "Wear fake jewels";
    }
    else if (number == 269) {
      redQuestionString = "Work a high-paying job that you hate";
      blueQuestionString = "Work your dream job with only just enough money for rent, food and utilities";
    }
    else if (number == 270) {
      redQuestionString = "Wake up naked in a forest five miles from home";
      blueQuestionString = "Wake up in your underwear at work";
    }
    else if (number == 271) {
      redQuestionString = "Go backstage with your favorite band";
      blueQuestionString = "Be an extra on your favorite tv show";
    }
    else if (number == 272) {
      redQuestionString = "Never eat your favorite food for the rest of your life";
      blueQuestionString = "Only eat your favorite food";
    }
    else if (number == 273) {
      redQuestionString = "Be able to erase your own memories";
      blueQuestionString = "Be able to erase someone else’s memories";
    }
    else if (number == 274) {
      redQuestionString = "Be so afraid of heights that you can’t go to the second floor of a building";
      blueQuestionString = "Be so afraid of the sun that you can only leave the house on rainy days";
    }
    else if (number == 275) {
      redQuestionString = "Have a rap battle against Nicki Minaj";
      blueQuestionString = "Have a rap battle against Lizzo";
    }
    else if (number == 276) {
      redQuestionString = "Save your best friend’s life if it meant five strangers would die";
      blueQuestionString = "Save five strangers if it meant sacrificing your best friend";
    }
    else if (number == 277) {
      redQuestionString = "Give up coffee";
      blueQuestionString = "Give up soda forever";
    }
    else if (number == 278) {
      redQuestionString = "Find a $100 bill floating in a public toilet";
      blueQuestionString = "Find a $20 bill in your own pocket";
    }
    else if (number == 279) {
      redQuestionString = "Wear nothing but neon orange for an entire year";
      blueQuestionString = "Wear nothing but neon green for an entire year";
    }
    else if (number == 280) {
      redQuestionString = "Eat the same thing for every meal for a year";
      blueQuestionString = "Be able to eat whatever you wanted, but only once every three days";
    }
    else if (number == 281) {
      redQuestionString = "Get drunk off of one sip of alcohol";
      blueQuestionString = "Never get drunk no matter how much booze you imbibe";
    }
    else if (number == 282) {
      redQuestionString = "Sell all of your possessions";
      blueQuestionString = "Sell one of your organs";
    }
    else if (number == 283) {
      redQuestionString = "Clean a toilet with your toothbrush";
      blueQuestionString = "Clean a floor with your tongue";
    }
    else if (number == 284) {
      redQuestionString = "Be asked the same question over and over again";
      blueQuestionString = "Never be spoken to ever again";
    }
    else if (number == 285) {
      redQuestionString = "Be reincarnated as a fly";
      blueQuestionString = "Just stop existing when you die";
    }
    else if (number == 286) {
      redQuestionString = "Be serenaded by Justin Bieber";
      blueQuestionString = "Be serenaded by Justin Timberlake";
    }
    else if (number == 287) {
      redQuestionString = "Be unable to close any door once it’s open";
      blueQuestionString = "Be unable to open any door once it’s closed";
    }
    else if (number == 288) {
      redQuestionString = "Throw the best parties but have to clean up the mess by yourself";
      blueQuestionString = "Never go to a party again";
    }
    else if (number == 289) {
      redQuestionString = "Have a tattoo of the title of the last book you read";
      blueQuestionString = "Have a tattoo of the last tv show you watched";
    }
    else if (number == 290) {
      redQuestionString = "Wear clothes that were always way too big";
      blueQuestionString = "Wear clothes a couple sizes too small";
    }
    else if (number == 291) {
      redQuestionString = "Give your parents access to your browser history";
      blueQuestionString = "Give your boss access to your browser history";
    }
    else if (number == 292) {
      redQuestionString = "Only be able to wash your hair twice a year";
      blueQuestionString = "Only be able to check your phone once a day";
    }
    else if (number == 293) {
      redQuestionString = "Have a tennis lesson from Serena Williams";
      blueQuestionString = "Have a soccer lesson from Meghan Rapinoe";
    }
    else if (number == 294) {
      redQuestionString = "Have a permanent unibrow";
      blueQuestionString = "Have no eyebrows at all";
    }
    else if (number == 295) {
      redQuestionString = "Have aliens be real and covered up by the government";
      blueQuestionString = "Have no extraterrestrial life at all in the universe";
    }
    else if (number == 296) {
      redQuestionString = "Be caught liking your ex’s Instagram pics";
      blueQuestionString = "Be caught liking your partner’s ex’s Instagram pics";
    }
    else if (number == 297) {
      redQuestionString = "Never eat cookies ever again";
      blueQuestionString = "Only ever drink water";
    }
    else if (number == 298) {
      redQuestionString = "Donate your organs to those who need them";
      blueQuestionString = "Donate your entire body to science";
    }
    else if (number == 299) {
      redQuestionString = "Be criticized";
      blueQuestionString = "Be ignored";
    }
    else if (number == 300) {
      redQuestionString = "Work alongside Dwight Schrute";
      blueQuestionString = "Work alongside Homer Simpson";
    }
    else if (number == 301) {
      redQuestionString = "Be punished for a crime you didn’t commit";
      blueQuestionString = "Have someone else take credit for one of your major accomplishments";
    }
    else if (number == 302) {
      redQuestionString = "Eat an undercooked meal";
      blueQuestionString = "Eat a burnt meal";
    }
    else if (number == 303) {
      redQuestionString = "Get a cooking lesson from Gordon Ramsay";
      blueQuestionString = "Get a cooking lesson from Ina Garten";
    }
    else if (number == 304) {
      redQuestionString = "Have your boss look through your text messages";
      blueQuestionString = "Have your parents look through your text messages";
    }
    else if (number == 305) {
      redQuestionString = "Have your first child when you’re 18";
      blueQuestionString = "Have your first child When you’re 50";
    }
    else if (number == 306) {
      redQuestionString = "Star in a Star Wars film";
      blueQuestionString = "Star in a Marvel Film";
    }
    else if (number == 307) {
      redQuestionString = "Wear heels to the gym";
      blueQuestionString = "Wear sneakers to a wedding";
    }
    else if (number == 308) {
      redQuestionString = "Give up brushing your hair";
      blueQuestionString = "Give up brushing your teeth";
    }
    else if (number == 309) {
      redQuestionString = "Master every musical instrument";
      blueQuestionString = "Master every type of sport";
    }
    else if (number == 310) {
      redQuestionString = "Always have wet socks";
      blueQuestionString = "Always have a small rock in your shoe";
    }
    else if (number == 311) {
      redQuestionString = "Have Celine Dion perform the soundtrack to your life";
      blueQuestionString = "Have Eminem perform the soundtrack to your life";
    }
    else if (number == 312) {
      redQuestionString = "Be the class clown";
      blueQuestionString = "Be the teacher’s pet";
    }
    else if (number == 313) {
      redQuestionString = "Bathe in the dishwater";
      blueQuestionString = "Wash dishes in your bathwater";
    }
    else if (number == 314) {
      redQuestionString = "Show up to a job interview with stained pants";
      blueQuestionString = "Show up to a job interview with pit stains";
    }
    else if (number == 315) {
      redQuestionString = "Never age physically";
      blueQuestionString = "Never age mentally";
    }
    else if (number == 316) {
      redQuestionString = "Date someone with bad breath";
      blueQuestionString = "Date someone with bad manners";
    }
    else if (number == 317) {
      redQuestionString = "Never wear makeup ever again";
      blueQuestionString = "Wear a full face of the wrong shades every day";
    }
    else if (number == 318) {
      redQuestionString = "Read the book";
      blueQuestionString = "Watch the movie";
    }
    else if (number == 319) {
      redQuestionString = "Have a slumber party with Anna Kendrick";
      blueQuestionString = "Go to a comedy show with Rebel Wilson";
    }
    else if (number == 320) {
      redQuestionString = "Eat chocolate on pizza";
      blueQuestionString = "Never eat chocolate ever again";
    }
    else if (number == 321) {
      redQuestionString = "Have x-ray vision of people you find unattractive";
      blueQuestionString = "Everyone else have x-ray vision of you";
    }
    else if (number == 322) {
      redQuestionString = "Have your own theme park";
      blueQuestionString = "Have your own zoo";
    }
    else if (number == 323) {
      redQuestionString = "Be the star player on a losing team";
      blueQuestionString = "Warm the bench on a championship roster";
    }
    else if (number == 324) {
      redQuestionString = "Know when you’re going to die";
      blueQuestionString = "Know how you’re going to die";
    }
    else if (number == 325) {
      redQuestionString = "Lose all of your teeth";
      blueQuestionString = "Lose all of your hair";
    }
    else if (number == 326) {
      redQuestionString = "Watch nothing but The Office";
      blueQuestionString = "Watch nothing but Friends";
    }
    else if (number == 327) {
      redQuestionString = "Lose your keys";
      blueQuestionString = "Lose your phone";
    }
    else if (number == 328) {
      redQuestionString = "Live in a home with no electricity";
      blueQuestionString = "Live in a home with no running water";
    }
    else if (number == 329) {
      redQuestionString = "Be rich with no friends";
      blueQuestionString = "Be poor and popular";
    }
    else if (number == 330) {
      redQuestionString = "Look strong and be weak";
      blueQuestionString = "Look weak and be strong";
    }
    else if (number == 331) {
      redQuestionString = "Have your style critiqued by Anna Wintour";
      blueQuestionString = "Have your style critiqued by Miranda Priestly";
    }
    else if (number == 332) {
      redQuestionString = "Wear one color everyday";
      blueQuestionString = "Wear seven colors everyday";
    }
    else if (number == 333) {
      redQuestionString = "Sneeze nonstop for 15 minutes once every day";
      blueQuestionString = "Sneeze once every three minutes of the day while you’re awake";
    }
    else if (number == 334) {
      redQuestionString = "Walk barefoot in a public bathroom";
      blueQuestionString = "Walk through poison ivy";
    }
    else if (number == 335) {
      redQuestionString = "Have the ability to see 10 years into your own future";
      blueQuestionString = "Have the ability to see six months into the future of the world";
    }
    else if (number == 336) {
      redQuestionString = "Nobody remember who you are at your 20-year class reunion";
      blueQuestionString = "Have everybody comment on how old you look";
    }
    else if (number == 337) {
      redQuestionString = "Shoot hoops with Lebron James";
      blueQuestionString = "Toss a football with Tom Brady";
    }
    else if (number == 338) {
      redQuestionString = "Live through an episode of Orange is the New Black";
      blueQuestionString = "Live through an episode of Black mirror";
    }
    else if (number == 339) {
      redQuestionString = "Only be able to listen to Christmas songs all year round";
      blueQuestionString = "Only be able to watch nothing but horror movies";
    }
    else if (number == 340) {
      redQuestionString = "Be a genius everyone thinks is an idiot";
      blueQuestionString = "Be an idiot everyone thinks is a genius";
    }
    else if (number == 341) {
      redQuestionString = "Win on Survivor";
      blueQuestionString = "Win on the Bachelor or Bachelorette";
    }
    else if (number == 342) {
      redQuestionString = "Be beloved by the general public but your family and friends hate you,";
      blueQuestionString = "Be hated by the general public but your family and friends love you";
    }
    else if (number == 343) {
      redQuestionString = "Be color blind";
      blueQuestionString = "Lose your sense of taste";
    }
    else if (number == 344) {
      redQuestionString = "Live on a desert island with your celebrity crush";
      blueQuestionString = "Live in a mansion with your ex";
    }
    else if (number == 345) {
      redQuestionString = "Pass gas every time you meet someone new";
      blueQuestionString = "Burp every time you kiss someone";
    }
    else if (number == 346) {
      redQuestionString = "Have tea with Queen Elizabeth";
      blueQuestionString = "Have a beer with Prince Harry";
    }
    else if (number == 347) {
      redQuestionString = "Give up the internet";
      blueQuestionString = "Give up showering for a month";
    }
    else if (number == 348) {
      redQuestionString = "Get away with a terrible crime but live in fear of someone discovering it";
      blueQuestionString = "Go to prison for three years for a crime you didn’t commit";
    }
    else if (number == 349) {
      redQuestionString = "Be forced to live the same day over and over again for a full year";
      blueQuestionString = "Take three years off the end of your life";
    }

  redQuestionTextA.text = redQuestionString;
  blueQuestionTextA.text = blueQuestionString;
  redQuestionTextB.text = redQuestionString;
  blueQuestionTextB.text = blueQuestionString;

}

function BlueBoxFlash()
{
  var tD = Animation.timeDriver({durationMilliseconds: 1200, loopCount: 1, mirror: false});
  var transition = Animation.animate(tD, Animation.samplers.linear(0.8, 0));
  flashBlueMAT.opacity = transition;

  tD.start();
  ScaleUpBox(blueBoxB);
}

function RedBoxFlash()
{
  var tD = Animation.timeDriver({durationMilliseconds: 1200, loopCount: 1, mirror: false});
  var transition = Animation.animate(tD, Animation.samplers.linear(0.8, 0));
  flashRedMAT.opacity = transition;

  tD.start();
  ScaleUpBox(redBoxB);
}

function ScaleUpBox(box) {
  if(!inRound) {
    return;
  }
  scaleUptD = Animation.timeDriver({durationMilliseconds: 1400, loopCount: 1, mirror: false});
  var scaling = Animation.animate(scaleUptD, Animation.samplers.easeOutCirc(box.transform.scaleX.pinLastValue(), 1.3));
  box.transform.scaleX = scaling;
  box.transform.scaleY = scaling;
  scaleUptD.start();
}

function ScaleDownBox(box) {
  if(!inRound) {
    return;
  }
  scaleDowntD = Animation.timeDriver({durationMilliseconds: 1400, loopCount: 1, mirror: false});
  var scaling = Animation.animate(scaleDowntD, Animation.samplers.easeOutCirc(box.transform.scaleX.pinLastValue(), 0.5));
  box.transform.scaleX = scaling;
  box.transform.scaleY = scaling;
  scaleDowntD.start();
}

function ResetBoxSizes() {
  var moveRedATD = Animation.timeDriver({durationMilliseconds: 300, loopCount: 1, mirror: false});
  var movingRedABX = Animation.animate(moveRedATD, Animation.samplers.easeInOutQuint(redBoxA.transform.x.pinLastValue(), -58));
  var movingRedABY = Animation.animate(moveRedATD, Animation.samplers.easeInOutQuint(redBoxA.transform.y.pinLastValue(), -91));
  redBoxA.transform.x = movingRedABX;
  redBoxA.transform.y = movingRedABY;
  redBoxB.transform.x = movingRedABX;
  redBoxB.transform.y = movingRedABY;
  moveRedATD.start();

  var moveBlueATD = Animation.timeDriver({durationMilliseconds: 300, loopCount: 1, mirror: false});
  var movingBlueABX = Animation.animate(moveBlueATD, Animation.samplers.easeInOutQuint(blueBoxA.transform.x.pinLastValue(), 181));
  var movingBlueABY = Animation.animate(moveBlueATD, Animation.samplers.easeInOutQuint(blueBoxA.transform.y.pinLastValue(), -91));
  blueBoxA.transform.x = movingBlueABX;
  blueBoxA.transform.y = movingBlueABY;
  blueBoxB.transform.x = movingBlueABX;
  blueBoxB.transform.y = movingBlueABY;
  moveBlueATD.start();

  var redBoxScaletD = Animation.timeDriver({durationMilliseconds: 1000, loopCount: 1, mirror: false});
  var redBoxScaling = Animation.animate(redBoxScaletD, Animation.samplers.easeInOutQuint(redBoxA.transform.scaleX.pinLastValue(), 1));
  redBoxA.transform.scaleX = redBoxScaling;
  redBoxA.transform.scaleY = redBoxScaling;
  redBoxScaletD.start();
  var blueBoxScaletD = Animation.timeDriver({durationMilliseconds: 1000, loopCount: 1, mirror: false});
  var blueBoxScaling = Animation.animate(blueBoxScaletD, Animation.samplers.easeInOutQuint(blueBoxA.transform.scaleX.pinLastValue(), 1));
  blueBoxA.transform.scaleX = blueBoxScaling;
  blueBoxA.transform.scaleY = blueBoxScaling;
  blueBoxScaletD.start();
}

function ScaleClouds(isShow) {
  if (isShow) {
    var tD = Animation.timeDriver({durationMilliseconds: 1000, loopCount: 1, mirror: false});
    var scaling = Animation.animate(tD, Animation.samplers.linear(0, 1));
    smallerThinkingBubble.transform.scaleX = scaling;
    smallerThinkingBubble.transform.scaleY = scaling;
    tD.start();
    tD.onCompleted().subscribe(function (){
      var tD02 = Animation.timeDriver({durationMilliseconds: 1500, loopCount: 1, mirror: false});
      var scaling02 = Animation.animate(tD02, Animation.samplers.easeOutExpo(0, 2));
      thinkingBubble.transform.scaleX = scaling02;
      thinkingBubble.transform.scaleY = scaling02;
      tD02.start();
    });
  }
  else {
    var tD03 = Animation.timeDriver({durationMilliseconds: 1000, loopCount: 1, mirror: false});
    var scaling = Animation.animate(tD03, Animation.samplers.linear(1, 0));
    smallerThinkingBubble.transform.scaleX = scaling;
    smallerThinkingBubble.transform.scaleY = scaling;
    tD03.start();
    var tD04 = Animation.timeDriver({durationMilliseconds: 1500, loopCount: 1, mirror: false});
    var scaling02 = Animation.animate(tD04, Animation.samplers.easeOutExpo(2, 0));
    thinkingBubble.transform.scaleX = scaling02;
    thinkingBubble.transform.scaleY = scaling02;
    tD04.start();
  }
}

function MoveBoxesToCenter(){
  if (headTilt == 0) {
    MoveBigBoxToCenter(redBoxA);
    RemoveSmallBoxToCenter(blueBoxA);
  } 
  else{
    MoveBigBoxToCenter(blueBoxA);
    RemoveSmallBoxToCenter(redBoxA);
  }

  if (headTilt == 0) {
    MoveBigBoxToCenter(redBoxB);
    RemoveSmallBoxToCenter(blueBoxB);
  } 
  else{
    MoveBigBoxToCenter(blueBoxB);
    RemoveSmallBoxToCenter(redBoxB);
  }
}

function MoveBigBoxToCenter(box) {
  var moveTD = Animation.timeDriver({durationMilliseconds: 1400, loopCount: 1, mirror: false});
  var movingX = Animation.animate(moveTD, Animation.samplers.easeInOutQuint(box.transform.x.pinLastValue(), 75));
  var movingY = Animation.animate(moveTD, Animation.samplers.easeInOutQuint(box.transform.y.pinLastValue(), -60));
  box.transform.x = movingX;
  box.transform.y = movingY;
  moveTD.start();
}

function RemoveSmallBoxToCenter(box) {
  scaleDowntD = Animation.timeDriver({durationMilliseconds: 1400, loopCount: 1, mirror: false});
  var scaling = Animation.animate(scaleDowntD, Animation.samplers.easeOutCirc(box.transform.scaleX.pinLastValue(), 0));
  box.transform.scaleX = scaling;
  box.transform.scaleY = scaling;
  scaleDowntD.start();
}


(async function () {
  //receiving a message
  gameTopicChannel.onMessage.subscribe((msg) => {
    // random number selected
    if (msg.selectedInteger != selectedInteger) {
      selectedInteger = msg.selectedInteger;
    }
    // game start
    if (msg.startGame == 1) {
      StartNewRound();
    }
    if (!userIDs.includes(msg.userID) && msg.userID != null) {
      userIDs.push(msg.userID);
      sendUserId();
    }
    if (msg.headTilt != null) {
      userHeadsTilt[msg.userID] = msg.headTilt;
    }

    currentText = "numOfPlayers: " + userIDs.length;
  });
  
  //sending
  TouchGestures.onTap().subscribe(function(e) {
    selectedInteger = SelectRandomNumber();
    StartNewRound();
    currentText = "numOfPlayers: " + userIDs.length;
    //what to do when sending a message
    gameTopicChannel.sendMessage({
      "startGame": 1,
      "selectedInteger": selectedInteger
    }).catch(err => {
      Diagnostics.log(err);
    });
  });


})();

Promise.all([
  Scene.root.findFirst('red_question_text_A'),
  Scene.root.findFirst('blue_question_text_A'),
  Scene.root.findFirst('red_question_text_B'),
  Scene.root.findFirst('blue_question_text_B'),
  Scene.root.findFirst('fountain_left'),
  Scene.root.findFirst('fountain_right'),
  Scene.root.findFirst('fountain_left_emoji'),
  Scene.root.findFirst('fountain_right_emoji'),
  Scene.root.findFirst('red_box_A'),
  Scene.root.findFirst('blue_box_A'),
  Scene.root.findFirst('red_box_B'),
  Scene.root.findFirst('blue_box_B'),
  Scene.root.findFirst('instructionsA'),
  Scene.root.findFirst('instructionsB'),
  Scene.root.findFirst('smaller_thinking_bubble'),
  Scene.root.findFirst('thinking_bubble'),
  Materials.findFirst('flash_blue_MAT'),
  Materials.findFirst('flash_red_MAT'),
]).then(function (objects) {
  redQuestionTextA = objects[0];
  blueQuestionTextA = objects[1];
  redQuestionTextB = objects[2];
  blueQuestionTextB = objects[3];  
  fountainLeft = objects[4];
  fountainRight = objects[5]; 
  fountainLeftEmoji = objects[6];
  fountainRightEmoji = objects[7];  
  redBoxA = objects[8];
  blueBoxA = objects[9];
  redBoxB = objects[10];
  blueBoxB = objects[11];
  instructionsTextA = objects[12];
  instructionsTextB = objects[13];
  smallerThinkingBubble = objects[14];
  thinkingBubble = objects[15];
  flashBlueMAT = objects[16];
  flashRedMAT = objects[17];

  if (!isInit) {
    Init();
  }
})
.catch((error) =>
  {
      Diagnostics.log("Error found");
      Diagnostics.log(error.message);
  }
);

function sendUserId() {
  Time.setTimeout(
    function (elapsedTime) {
      gameTopicChannel.sendMessage({"userID": userID}).catch(err => {
        Diagnostics.log(err);
      });
    }, 500);
}

FaceGestures.isLeanedLeft(face).monitor().subscribe(()=>{
  headTilt = 0;
  if (!canClick) {
    if (inRound) {
      // Diagnostics.log("left check");
      SendUserHeadTilt();
      userHeadsTilt[userID] = headTilt;
    }
    ScaleUpBox(redBoxA);
    ScaleDownBox(blueBoxA);
  }
});

FaceGestures.isLeanedRight(face).monitor().subscribe(()=>{
  headTilt = 1;  
  if (!canClick) {
    if (inRound) {
      // Diagnostics.log("right check");
      SendUserHeadTilt();
      userHeadsTilt[userID] = headTilt;
    }
    ScaleUpBox(blueBoxA);
    ScaleDownBox(redBoxA);
  }
});
