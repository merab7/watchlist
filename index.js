document.addEventListener('DOMContentLoaded', () => {
  renderAddedFilms();
  
});
const searchBtn = document.getElementById('searchbtn');
const inputValue= document.getElementById('input')
const addedFilms=[]
const apiKey= `914f3e8d`



searchBtn.addEventListener('click', async () => {
  
  console.log(inputValue.value)
  const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${inputValue.value}`);
  const data = await res.json();
  const givenData = data.Search;
  if (!givenData){
    document.getElementById('startingpoint').innerHTML=` <div class="opps" id="startingpoint" >
    <img class="exploricon" src="images/starticon.png" alt="">
    <p class="opsinfo">OOPS!!! Unable to find what you're looking for. Please try again </p>
    </div>`
  }
  const moviePromises = givenData.map(film => {
    return fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=${film.Title}`)
      .then(res => res.json());
  });
  const movies = await Promise.all(moviePromises);
  const movieListHTML = movies.map(eachFilm => {
    console.log(eachFilm)
    document.getElementById('startingpoint').style.display='none'
    return `<div class="eachfilm">
              <div class="filmposterdiv">
              <img class="filmimg" src="${eachFilm.Poster}" />
              </div>
              <div class="filminfo">
              <div class="titlediv" >
                <h1 class="filmtitle">${eachFilm.Title}</h1>
                
                </div>
                <div class="imdbdiv">
                <h1>IMDB</h1>
                <h1 class="imdb">${eachFilm.imdbRating}</h1>
                </div>
                <div class="miniinfo">
                  <p class="time">${eachFilm.Runtime}</p>
                  <p class="ganre">${eachFilm.Genre}</p>
                  
                </div>
                <p class="description">${eachFilm.Plot}</p>
               
            </div>
            <div class="add-div" >
            
            <i class="fa-solid fa-circle-plus" id=${eachFilm.imdbID}> Add </i>
          
            </div>
            </div>
            `;
  }).join('');
  
  
  document.getElementById('movielist').innerHTML = movieListHTML;



  // add event listener after the elements have been added to the DOM
  movies.forEach(eachFilm => {
    const addBtn = document.getElementById(eachFilm.imdbID)
   
    if (addBtn) {
      
      if (addedFilms.some(film => film.imdbID === eachFilm.imdbID)) {
       document.getElementById(eachFilm.imdbID).style.display='none' 
       
      }
          addBtn.addEventListener('click', () => {
          addedFilms.unshift(eachFilm);
          document.getElementById(eachFilm.imdbID).style.display = 'none';
          
          localStorage.setItem('addedfilm', JSON.stringify(addedFilms))
          renderAddedFilms()
          
        });
           
      
    }
   
  });
  

})


function renderAddedFilms() {

  
  const filmesinlocalstorage = JSON.parse(localStorage.getItem('addedfilm')) || []; 
  let addedmovieListHTML = '';

  if (filmesinlocalstorage) {
    addedmovieListHTML = filmesinlocalstorage.map(eachFilm => {
     
      return `<div class="eachfilm">
                <div class="filmposterdiv">
                  <img class="filmimg" src="${eachFilm.Poster}" />
                </div>
                <div class="filminfo">
                  <div class="titlediv" >
                    <h1 class="filmtitle">${eachFilm.Title}</h1>
                  </div>
                  <div class="imdbdiv">
                    <h1>IMDB</h1>
                    <h1 class="imdb">${eachFilm.imdbRating}</h1>
                  </div>
                  <div class="miniinfo">
                    <p class="time">${eachFilm.Runtime}</p>
                    <p class="ganre">${eachFilm.Genre}</p>
                  </div>
                  <p class="description">${eachFilm.Plot}</p>
                  <div class="minus-div" >
                    <i class="fa-solid fa-circle-minus" id="${eachFilm.imdbID}">Remove</i>
                  </div>
                </div>
              </div>`;
              
    }).join('');
    
    // clear the contents of the addedFilmdiv element
    document.getElementById('addedFilmdiv').innerHTML = '';

    // append the new HTML string to the addedFilmdiv element
    document.getElementById('addedFilmdiv').innerHTML += addedmovieListHTML;

    // add event listener to remove button for each film
    filmesinlocalstorage.forEach(eachFilm => {
      addRemoveBtnEventListener(eachFilm, filmesinlocalstorage);
    });
  }
  
}



function addRemoveBtnEventListener(eachFilm, filmesinlocalstorage) {
  const removeBtn = document.getElementById(eachFilm.imdbID);
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      const index = filmesinlocalstorage.findIndex(film => film.imdbID === eachFilm.imdbID);
      if (index > -1) {
        filmesinlocalstorage.splice(index, 1);
        localStorage.setItem('addedfilm', JSON.stringify(filmesinlocalstorage));
        renderAddedFilms();
      }
    });
  }
}






