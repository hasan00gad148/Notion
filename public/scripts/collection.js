const searchForm = document.querySelector('.search form');
const docList = document.querySelector(".doc-list")
const inputSearch = document.querySelector('.search input[type="search"]');
console.log(searchForm,docList,docList.dataset.collection_id,inputSearch);

searchForm.addEventListener('submit', function(e){
    e.preventDefault();

    fetch(searchForm.action+`?title=${inputSearch.value}`)
    .then(response => {

        if (response.ok)      
            return response.json();
        else     
            throw new Error(`HTTP error: ${response.status}`);

    })
    .then(data => {
        // Do something with the data
        
        if (data.statusOk == true){
            let ul = ""

           if (data.docs && data.docs.length>0) { 
                console.log(data);
                data.docs.forEach(doc => { 
                let date = new Date(doc.date); 
                ul+=
                `<li>
                    <div>
                   <h2>${doc.title} </h2>
                   <time datetime= ${date.toISOString()} > ${date.toLocaleString('en-UK',{dateStyle:"medium",timeStyle:"short",hour12:false})}  </time>
                   </div>
                   <a href="/collections/${docList.dataset.collection_id}/docs/${doc._id}" class="btn"> view </a>
                </li>`

                 }) 
             } else { 
                ul+=`<p> no docs found</p>`
             } 
            docList.innerHTML = ul;
        }
    })
    .catch(error => {
        alert("something went wrong, please try again later");
        console.error(error);
    });
});
