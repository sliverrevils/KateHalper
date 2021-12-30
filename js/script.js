const $MainWin = document.querySelector(".MainWin");


const $AddLinkInput = document.querySelector("#AddLinkInput");
const $AddDescriptionInput = document.querySelector("#AddDescriptionInput");
const $ListItems = document.querySelector(".ListItems");
const $AddItemBtn = document.querySelector("#AddItemBtn");

const $AIM_BTN = document.querySelector('#spin_aim_btn');
const $BALL = document.querySelector('.ball');
const $SHOTTIME=document.querySelector('.shotTime');


//01 час 26 мин 23 сек
//https://youtu.be/Qq4j1LtCdww?list=RDQq4j1LtCdww&t=100






//------------------------AIM


//-----------------------------------------------      SELECT SPIN FUNC
function showBall(id) {

    $BALL.style.display = "block";// SHOW BALL DIV
    const $AIM_BLOCKS = document.querySelectorAll('.aim_block'); // SELECT ALL BLOCKS 

    function aimSelect() {
        addAim(id, this.id); // ADD SELECTED SPIN ON ARRAY & LS        
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
const textSpin=spin=>{  
    spinsObj={
        'top_left':'верхний левый',
        'top':"верхний",
        'top_right':"верхний правый",
        'left':'влево',
        'center':'центр',
        'right':'вправо',
        'bottom_left':'нижний левый',
        'bottom':'нижний',
        'bottom_right':'нижний правый',
    }
    return spinsObj[spin];
}





//GET RANDOM ID
const rndID = (name = "item") => `id_${name}_${Math.random()}`;

//CLICKS CHECKER
document.addEventListener('click', e => {
    e.target.name == "del" && delItem(e.target.id); // del buttons
    e.target.name == "aim" && showBall(e.target.id);// AIM buttons
    e.target.name == "shot" && addShotTime(e);// AIM buttons
})






// ------------------                                        ADD SHOTs
function addShotTime(e){
    let $addBtn=document.querySelector('.AddTimeShot');

   $SHOTTIME.style.display='block';
   $SHOTTIME.style.top=e.clientY+'px';
   $SHOTTIME.style.left=e.clientX+'px';
   console.log(e);

   function addShot(){    
    let $text=document.querySelector('.shotTimeInput');   
    addShotArr(e.target.id,$text.value);


    $addBtn.removeEventListener('click',addShot);
    $text.value='';
    $SHOTTIME.style.display='none';
   }



   $addBtn.addEventListener('click',addShot);
   

}

document.querySelector('.close_shotTime').addEventListener('click',()=>$SHOTTIME.style.display='none');









// RIGHT CLICK MENU RESET
document.addEventListener('contextmenu', e => e.preventDefault()); 


//LOCAL STORAGE FUNCS
const setST = () => localStorage.setItem("list", JSON.stringify(listArr));
const getST = () => JSON.parse(localStorage.getItem("list"));

//INIT ARR
const listArr = getST() || [];
listRender();
console.log(listArr);


//ADD TO ARR FUNC
function addItem(link, description) {
    listArr.push({ ID: rndID(), link, description });
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
function addAim(ID, btnId) {
    console.log(ID, btnId);
    const obj = listArr.find(item => item.ID == ID);// find obj in arr
    const itemIndex = listArr.indexOf(obj);// get index of item in array
    listArr[itemIndex].aim = btnId;

    listRender(); //update list  
    setST();      // save to ls
}






// ADD SHOT FUNC

function addShotArr(ID, textTime) {
    
    const obj = listArr.find(item => item.ID == ID);// find obj in arr
    const itemIndex = listArr.indexOf(obj);// get index of item in array
    listArr[itemIndex].shots??(listArr[itemIndex].shots=[]);
    listArr[itemIndex].shots.push(textTime);
    console.log(listArr[itemIndex].shots);
    console.log(listArr);
    listRender(); //update list  
    setST();      // save to ls
}







//shots    -----------------ОТОБРАЗИТЬ УДАРЫ И ВЫЧЕСЛИТЬ ССЫЛКУ ПО ТАЙМКОДУ
function showShots(arr){
   let a= arr.reduce((acc,item)=>{item})
   console.log(a);
return a;
}



//00 час 26 мин 23 сек
//https://youtu.be/v_slHo6buXk?t=647 -site
//https://www.youtube.com/watch?v=v_slHo6buXk?t=1583s  - my


// -------------------------  CALC VIDEO TIMECODE
function calcTimeCode(videoLink,textCode){
let arr=textCode.split(' ');
console.log(arr[0],arr[2],arr[4]);
let secs=(+arr[0]*60*60)+(+arr[2]*60)+(+arr[4]);
return `${videoLink}?t=${secs}s`
}

https://www.youtube.com/watch?v=bVEjOd6_y4Y
https://youtu.be/bVEjOd6_y4Y?t=950


// ----------------------SHOTS LIST 
function addShotsList(link,id,arr){
  //  console.log(link,id,arr);
    let $items=document.querySelector('#'+id);
    console.log($items);
    arr&&arr.map(e=>$items.innerHTML+=`
    <h5>
    <a href="${calcTimeCode(link,e)}" target="_blank">${e}</a>
    </h5>
    `)
}


//-------------------------------------------LIST RENDER  FUNC (from array)
function listRender() {
    $ListItems.innerHTML = '';
    listArr.map((item,index) => {
        $ListItems.innerHTML += // ITEM HTML
            `
    <p class="itemOfList">
    <h4>
    <a href="${item.link}" target="_blank">${item.link}</a>
       "${item.description}"
       ${item.aim ?textSpin(item.aim ): ' '}
       <button id="${item.ID}" name="shot">ADD SHOT</button>
     <button id="${item.ID}" name="aim">AIM</button>
     <button id="${item.ID}" name="del" >X</button> 
     <br>
     <div class="shots" id="Shots${index}"> </div>
     </h4> 
     </p>
     <hr> 
    `;
    addShotsList(item.link,`Shots${index}`,item.shots);
    })
}
//ADD BTN
$AddItemBtn.addEventListener('click', () => addItem($AddLinkInput.value, $AddDescriptionInput.value));


