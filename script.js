//here divided sorting into pieces to fit visualization code in between
class ContentScreen{

  constructor(contentAreaID){

    this.contentAreaElem = document.getElementById(contentAreaID);

    this.currentEventIndex = 0; //maintains the current event to be visualized on screen

  }

  async drawEvent(event,delay){

    switch (event.type) {

      case "compare":

        this.barsArray[event.i].style.backgroundColor = 'blue';
      
        this.barsArray[event.j].style.backgroundColor = 'blue';

        break;

      case "swap":
        
        this.barsArray[event.i].style.backgroundColor = 'red';

        this.barsArray[event.j].style.backgroundColor = 'red';

        await this.delay(delay);

        [this.barsArray[event.i].style.height,this.barsArray[event.j].style.height] = [this.barsArray[event.j].style.height,this.barsArray[event.i].style.height];

        this.rePaintBars([event.i,event.j]);
        
        break;

      case "noswap":

        this.barsArray[event.i].style.backgroundColor = 'green';

        this.barsArray[event.j].style.backgroundColor = 'green';

        await this.delay(delay);

        this.rePaintBars([event.i,event.j]);
        
        break;

      case "merge":

        let copyBars = [];

        let barsToRedraw = [];

        this.barsArray.forEach(bar => copyBars.push(bar.style.height));

        for (let i = 0; i < event.events.length; i++) {

          const mergeEvent = event.events[i];

          this.barsArray[mergeEvent.i].style.height = copyBars[mergeEvent.j];

          barsToRedraw.push(mergeEvent.i);

          await this.delay(delay);
          
        }

        await this.delay(delay);

        //after merging all in the single event, the highlighted bars should be redrawn
        for (let i = 0; i < barsToRedraw.length; i++) {
          
          this.rePaintBars([barsToRedraw[i]]);
          
          await this.delay(delay);

        }


        break;

      case "highlight":

        for (let index = event.i; index <= event.j; index++) {

          this.barsArray[index].style.backgroundColor = 'blue';  
          
        }

        break;
    
      default:

        break;

    }

  }

  //repaint bars at given indices 
  rePaintBars(barsToRepaint){

    for (let index = 0; index < barsToRepaint.length; index++) {
    
      this.barsArray[barsToRepaint[index]].style.backgroundColor = 'black';

    }
    
  }

  drawRandomBars(nofBars,sortingAlgo) {

    this.contentAreaElem.innerHTML = "";

    this.barsArray = [];

    let barHeights = [];//used to send for sorting purpose
  
    for (let index = 0; index < nofBars; index++) {
  
      const bar = document.createElement('div');
  
      barHeights[index] = Math.round(Math.random()*100)

      bar.style.height = `${barHeights[index]}%`;
  
      //TODO: set width dynamically
      bar.style.width = '1em';
  
      bar.style.border = `${parseInt(bar.style.width,10)/10}em solid black`;

      bar.style.backgroundColor = 'black';
  
      bar.className = 'bar';
  
      this.contentAreaElem.appendChild(bar);

      this.barsArray[index] = bar;
  
    }

    //on reset generates new event array to visualize
    switch (sortingAlgo) {
      
      case "Bubble Sort":
        
        this.sortingEvents = SortingAlgorithms.bubbleSort([...barHeights]);

        break;

      case "Insertion Sort":

        this.sortingEvents = SortingAlgorithms.insertionSort([...barHeights]);
        
      break;

      case "Merge Sort":
        
        this.sortingEvents = SortingAlgorithms.mergeSort([...barHeights]);

      break;

      default:

        break;

    }

    
  }

  //regenerate bars in case of change in number of bars
  changeNumberOfBarsOrSortingAlgorithm(nofBars,sortingAlgo){

    this.reset();

    this.drawRandomBars(nofBars,sortingAlgo);

  }


  playVisulisation(delay){

    this.play = true;

    this.visualize(delay);

  }

  pauseVisulisation(){

    this.play = false;

  }

  async visualize(delay){

    // let temp = this.barsArray.map(bar=>bar.style.height);

    for (;this.currentEventIndex < this.sortingEvents.length; this.currentEventIndex++) {

      if(this.play){

        await this.drawEvent(this.sortingEvents[this.currentEventIndex],delay);

        await this.delay(delay);

      }else{

        break;

      }
      
    }
    
    // temp.sort((a,b)=>parseInt(a)-parseInt(b));

    // console.log(temp)

    // console.log(this.barsArray.map(bar=>bar.style.height))

    // console.log(JSON.stringify(this.barsArray.map(bar=>bar.style.height))==JSON.stringify(temp));


  }

  async delay(delay){

    return new Promise(resolve => setTimeout(resolve,delay));

  }

  reset(){

    this.currentEventIndex = 0;

    this.sortingEvents = [];

  }

}

class SortingAlgorithms{


  static bubbleSort(barsArray){

    let sortingEvents = [];

    for(let i = 0;i < barsArray.length;i++){

      for(let j = 0;j < barsArray.length-1-i;j++){

        sortingEvents.push({"type":"compare","i":j,"j":j+1});

        if(barsArray[j] > barsArray[j+1]){

          sortingEvents.push({"type":"swap","i":j,"j":j+1});

          [barsArray[j],barsArray[j+1]] = [barsArray[j+1],barsArray[j]];

        }
        else{

          sortingEvents.push({"type":"noswap","i":j,"j":j+1});

        }

      }

    }

    return sortingEvents;

  }

  static insertionSort(barsArray){

    let sortingEvents = [];

    for(let i = 1;i < barsArray.length;i++){

      for(let j = i;j > 0;j--){

        sortingEvents.push({"type":"compare","i":j-1,"j":j});

        if(barsArray[j-1] > barsArray[j]){

          sortingEvents.push({"type":"swap","i":j-1,"j":j});

          [barsArray[j-1],barsArray[j]] = [barsArray[j],barsArray[j-1]];

        }
        else{

          sortingEvents.push({"type":"noswap","i":j-1,"j":j});

          break;

        }

      }


    }

    return sortingEvents;

  }

  static mergeSort(barsArray){

    let sortingEvents = [];
    
    this.merge_Sort(barsArray,0,barsArray.length-1,sortingEvents);

    return sortingEvents;

  }

  static merge_Sort(barsArray,i,j,sortingEvents){

    if(i >= j)
      return;

    this.merge_Sort(barsArray,i,parseInt((i+j)/2),sortingEvents);

    this.merge_Sort(barsArray,parseInt((i+j)/2)+1,j,sortingEvents);

    sortingEvents.push({"type":"highlight","i":i,"j":j});

    //merging both sorted halves
    let k = i,l = parseInt((i+j)/2)+1;

    let temp = [];

    let batchEvents = [];

    while(k <= parseInt((i+j)/2) && l <= j){

      if(barsArray[k] < barsArray[l]){

        batchEvents.push({"i":temp.length+i,"j":k});

        temp.push(barsArray[k]);

        k++;

      }
      else{

        batchEvents.push({"i":temp.length+i,"j":l});

        temp.push(barsArray[l]);

        l++;

      }

    }

    while(k <= parseInt((i+j)/2)){

      batchEvents.push({"i":temp.length+i,"j":k});

      temp.push(barsArray[k]);

      k++;

    }

    while(l <= j){

      batchEvents.push({"i":temp.length+i,"j":l});

      temp.push(barsArray[l]);

      l++;

    }

    temp.forEach(ele => {
      
      barsArray[i] = ele;

      i++;

    });

    sortingEvents.push({"type":"merge","events":batchEvents});

  }

}

class SortingScreen{

  //takes id of input elem it will control
  constructor(contentScreen,animationSpeedID,nofBarsID,sortingAlgoID,playPauseID){

    this.contentScreen = contentScreen;//responsible for contentArea where bars will be drawn

    this.animationControlButton = document.getElementById(playPauseID);

    this.animationSpeedElem = document.getElementById(animationSpeedID);

    this.nofBarsElem = document.getElementById(nofBarsID);

    this.sortingAlgoElem = document.getElementById(sortingAlgoID);

    this.contentScreen.changeNumberOfBarsOrSortingAlgorithm(this.nofBarsElem.value,this.sortingAlgoElem.value);//draws bar with initial value

    this.initTriggers();
    
  }

  initTriggers(){

    //trigger for play/pause
    this.animationControlButton.onclick = e => {
      
      this.animationSpeedElem.disabled = !this.animationSpeedElem.disabled;

      this.nofBarsElem.disabled = !this.nofBarsElem.disabled;

      this.sortingAlgoElem.disabled = !this.sortingAlgoElem.disabled;

      if(e.target.innerHTML == 'Play'){

        this.contentScreen.playVisulisation(this.animationSpeedElem.max-this.animationSpeedElem.value);
      
      }else{

        this.contentScreen.pauseVisulisation();

      }

      e.target.innerHTML = e.target.innerHTML == 'Play'?'Pause':'Play';

    };

    //if bars are changed or sorting algorithm changed then reset the algorithm visualization
    this.nofBarsElem.oninput = e => {

      this.contentScreen.changeNumberOfBarsOrSortingAlgorithm(e.target.value,this.sortingAlgoElem.value);
      
    };

    //if bars are changed or sorting algorithm changed then reset the algorithm visualization
    this.sortingAlgoElem.onchange = e => {

      this.contentScreen.changeNumberOfBarsOrSortingAlgorithm(this.nofBarsElem.value,e.target.value);
      
    };

  }

}


window.onload = () => {

  // init();

  let contentScreen = new ContentScreen('content');

  new SortingScreen(contentScreen,'speed','array-length','sorting-algo','playPause');

}