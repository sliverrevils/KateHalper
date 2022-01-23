const $MainWin = document.querySelector(".MainWin");
//$MainWin.scrollHeight

const $AddLinkInput = document.querySelector("#AddLinkInput");
const $AddDescriptionInput = document.querySelector("#AddDescriptionInput");
const $ListItems = document.querySelector(".ListItems");
const $AddItemBtn = document.querySelector("#AddItemBtn");

const $AIM_BTN = document.querySelector('#spin_aim_btn');
const $BALL = document.querySelector('.ball');
const $SHOTTIME = document.querySelector('.shotTime');

const $BLACK = document.querySelector('.BlackScreen');

//               // BLACK SCREEEN
const blackScreeToggle = (e) => {
    !e ? $BLACK.classList.add("BlackOff") : $BLACK.classList.remove("BlackOff");
    $BLACK.style.height = $MainWin.scrollHeight + "px";
};



//              ADD INPUT RIGHT-CLICK PASTE CLIPBOARD

const pasteClipboard = e => navigator.clipboard.readText().then(text => e.target.value = (text == '' || text == ' ' || text == null || text == NaN) ? "Скопируй текст" : text);

$AddLinkInput.addEventListener('contextmenu', e => pasteClipboard(e));

$AddDescriptionInput.addEventListener('contextmenu', e => pasteClipboard(e));
//e.target.value="click";
$SHOTTIME.addEventListener('contextmenu', e => pasteClipboard(e))




//-----------------------------------------------      RENDER SPIN WIN 
function showBall(id, elOfArr, event) {
    blackScreeToggle(true);
    console.log(event.pageX, event.pageY);

    $BALL.style.display = "block";// SHOW BALL WINDOW

    $BALL.style.left = event.pageX - 70 + "px";
    $BALL.style.top = event.pageY - 85 + "px";

    $BALL.style.zIndex = '10';
    const $AIM_BLOCKS = document.querySelectorAll('.aim_block'); // SELECT ALL BLOCKS 

    function aimSelect() {
        addAim(id, this.id, elOfArr); // ADD SELECTED SPIN ON ARRAY & LS        
        $BALL.style.display = "none"; // HIDE BALL DIV
        Array.from($AIM_BLOCKS).map(item => { // CLEAR LISTENERS ON BALL BLOCKS
            item.removeEventListener('click', aimSelect);
        })
    }
    Array.from($AIM_BLOCKS).map(item => {
        item.addEventListener('mouseenter', () => item.classList.add("aim_select"));   // SHOW CROSSHAIR ON MOUSEENTER
        item.addEventListener('mouseleave', () => item.classList.remove("aim_select"));// CLEAR CROSSHAIR        
        item.addEventListener('click', aimSelect);                                   // ADD FUNC SELECT ON CLICK
    });

}





// TEXT OF SPIN
const textSpin = spin => {
    spinsObj = {
        'top_left': 'верхний левый',
        'top': "верхний",
        'top_right': "верхний правый",
        'left': 'влево',
        'center': 'центр',
        'right': 'вправо',
        'bottom_left': 'нижний левый',
        'bottom': 'нижний',
        'bottom_right': 'нижний правый',
    }
    return spinsObj[spin];
}





//GET RANDOM ID
const rndID = (name = "item") => `id_${name}_${Math.random()}`;

//---------------------------------LEFT-CLICKS CHECKER
document.addEventListener('click', e => {
    e.target.name == "del" && delItem(e.target.id); // del buttons
    //так находим элемент alt в котором передаем идекс в массиве...
    e.target.name == "aim" && showBall(e.target.id, e.target.attributes.alt.nodeValue, e);// AIM buttons
    e.target.name == "shot" && addShotTime(e);// AIM buttons
    e.target.name == "del_shot" && delShot(e.target.id, e.target.attributes.alt.nodeValue);// DEL SHOT
    e.target.matches('.shot_item') &&  addShotStyle(e,true); //marker
})




//-------------------------------- RIGHT-CLICKS CHECKER
document.addEventListener('contextmenu', e => {

    e.target.name == "shot" && (async () => {
        let clip = 'none';
        await navigator.clipboard.readText().then(text => clip = text);
        addShotArr(e.target.id, clip);

    })();

    e.target.matches('.shot_item') && addShotStyle(e); // SHOT MARKER
})



// ------------------                                        ADD SHOTs
function addShotTime(e) {
    let $addBtn = document.querySelector('.AddTimeShot');
    blackScreeToggle(true);
    $SHOTTIME.style.zIndex = '10';
    $SHOTTIME.style.display = 'block';
    $SHOTTIME.style.top = e.pageY + 'px';
    $SHOTTIME.style.left = e.clientX + 'px';


    function addShot() {
        let $text = document.querySelector('.shotTimeInput');
        addShotArr(e.target.id, $text.value);


        $addBtn.removeEventListener('click', addShot);
        $text.value = '';
        $SHOTTIME.style.display = 'none';
    }
    $addBtn.addEventListener('click', addShot);

}
// CLOSING ADD SHOT MENU 
document.querySelector('.close_shotTime').addEventListener('click', () => {
    $SHOTTIME.style.display = 'none';
    blackScreeToggle(false);
});

// RIGHT CLICK MENU RESET
document.addEventListener('contextmenu', e => e.preventDefault());


//-------------------------------------------LOCAL STORAGE FUNCS
const setST = () => localStorage.setItem("list", JSON.stringify(listArr));
const getST = () => JSON.parse(localStorage.getItem("list"));

//-------------------------------------------INIT ARR
const listArr = getST() || [];
listRender();



//ADD TO ARR FUNC
function addItem(link, description) {
    listArr.push({ ID: rndID(), link, description });

    $AddLinkInput.value = '';
    $AddDescriptionInput.value = '';
    listRender();
    setST();
}

//DEL FROM ARR FUNC
function delItem(ID) {
    const obj = listArr.find(item => item.ID == ID);// find obj in arr
    const itemIndex = listArr.indexOf(obj);// get index of item in array
    listArr.splice(itemIndex, 1);//renove obj from array

    listRender(); //update list  
    setST();      // save to ls
}




//ADD SPIN FUNC
function addAim(ID, spin, elOfArr) {
    //console.log("AIM",ID, spin,elOfArr);
    const obj = listArr.find(item => item.ID == ID);// find obj in arr
    const itemIndex = listArr.indexOf(obj);// get index of item in array
    listArr[itemIndex].shots[elOfArr].aim = spin;

    blackScreeToggle(false);
    listRender(); //update list  
    setST();      // save to ls
}

// ---------   DEL SHOT
function delShot(idVideo, elOfArr) {
    const obj = listArr.find(item => item.ID == idVideo);// find obj in arr
    const itemIndex = listArr.indexOf(obj);// get index of item in array

    listArr[itemIndex].shots.splice(elOfArr, 1);

    listRender(); //update list  
    setST();      // save to ls


}







// ADD SHOT FUNC

function addShotArr(ID, textTime) {

    const obj = listArr.find(item => item.ID == ID);// find obj in arr
    const itemIndex = listArr.indexOf(obj);// get index of item in array
    listArr[itemIndex].shots ?? (listArr[itemIndex].shots = []);
    listArr[itemIndex].shots.push({ time: textTime, aim: null, color: "white" });

    blackScreeToggle(false);
    listRender(); //update list  
    setST();      // save to ls
}



// ADD SHOTS STYLE
// [
//     {ID,description,link,
//     shots:[
//         {time,aim}
//     ]
//     }
// ]

function addShotStyle({ target }, clear = false) {
    const colorArr = ["white", "springgreen","lightblue", "tomato", "gold","fuchsia"];
    
        let videoIdx = target.closest('.itemOfList').dataset.video;
        let shotIdx = target.dataset.shot;

        
        
        let nowCol = listArr[videoIdx].shots[shotIdx].color;
        let nowColIdx = colorArr.indexOf(nowCol);

        if (!clear) {
        listArr[videoIdx].shots[shotIdx].color = (nowColIdx<colorArr.length-1)?colorArr[nowColIdx+1]:colorArr[1];
        target.style.background = listArr[videoIdx].shots[shotIdx].color;
    }else{
        listArr[videoIdx].shots[shotIdx].color =colorArr[0];
        target.style.background = colorArr[0];
    }

    listRender(); //update list  
    setST();      // save to ls
}


// 00 час : 06 мин : 48 сек
//original link https://www.youtube.com/watch?v=sWd1qoZ-DNg
//time link     https://youtu.be/sWd1qoZ-DNg?t=14

// -------------------------  CALC VIDEO TIMECODE
function calcTimeCode(videoLink, textCode) {
    let arr = textCode.split(' ');
    let secs = (+arr[0] * 60 * 60) + (+arr[3] * 60) + (+arr[6]);
    let videoName = videoLink.split('=');
    return `https://youtu.be/${videoName[1]}?t=${secs}s`;
}


// -------------------------------------------SHOTS LIST 
function addShotsList(link, id, arr, item) {

    let $items = document.querySelector('#' + id);
    arr && arr.map((el, index) => {  //------ DATA _ SHOT - INDEX  
        $items.innerHTML += `
    <div class="shot_item" id="${item.ID}" name="shot_item" data-shot=${index} style="background:${item.shots[index].color}">   
    <button id="${item.ID}" alt="${index}" name="del_shot">X</button>  
    <a href="${calcTimeCode(link, el.time)}" target="_blank">${el.time}</a>    
    <button id="${item.ID}" alt="${index}" name="aim" ${textSpin(item.shots[index].aim) || "style=background:red"}> 🎯</button>   
     ${textSpin(item.shots[index].aim) || "..."}   
    </div>
    `}
    )
}


//-------------------------------------------LIST RENDER  FUNC (from array)
function listRender() {
    $ListItems.innerHTML = '';
    listArr.map((item, index) => {
        $ListItems.innerHTML += // ITEM HTML   //------------------------- DATA - VIDEO _INDEX
            `
    <div class="itemOfList" data-video=${index}>               
    
    <div class="videoLink" >
    <button id="${item.ID}" name="del" >X </button> 
    <a href="${item.link}" target="_blank">${item.link}</a>
       "${item.description}"
       ${item.aim ? textSpin(item.aim) : ' '}
       </div>
       <button id="${item.ID}" name="shot" class="add_shot">➕🏆</button>    
     <br>
     <div class="shots" id="Shots${index}"> </div>     
     </div>
     `;
        addShotsList(item.link, `Shots${index}`, item.shots, item); // VIDEO , ID DIV , ARR, item
    })
}
//ADD BTN
$AddItemBtn.addEventListener('click', () => addItem($AddLinkInput.value, $AddDescriptionInput.value));


