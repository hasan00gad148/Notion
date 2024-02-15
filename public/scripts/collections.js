const searchForm = document.querySelector('.search form');
const collectionsUl = document.querySelector(".collections-ul")
const inputSearch = document.querySelector('.search input[type="search"]');
console.log(searchForm,collectionsUl,inputSearch.value);

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
        console.log(data);
        if (data.statusOk == true){
            let ul = ""

            data.collections.forEach(collection=>{
                collection.date = new Date(collection.date);
                ul += `
                <li class="collection" data-id = ${collection._id}>
                <h1 title= ${collection.title}> ${collection.title} </h1>
                <time datetime=${collection.date.toISOString() }>${collection.date.toLocaleDateString('en-UK', {
                weekday: "short",
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour12:true,
                
                })}
                </time>
                <p title=${collection.description}>${collection.description}</p>
                <div>
                <a name="view-btn" href="/collections/${collection._id}" class="btn">view</a>
                <a name="edit-btn" href="/collections/${collection._id}/edit" class="btn">edit</a>
                <a name="del-btn" href="/collections/${collection._id}/del" class="btn del-btn">del</a>
                </div>
            </li>
                `
            })
            collectionsUl.innerHTML = ul;
            const delBtns = document.querySelectorAll('a[name="del-btn"]');
            delBtns.forEach(btn=>{
                btn.addEventListener("click",function(e){
                    e.preventDefault();
                    aside.style.display = "block";
                    yesBtn.href = btn.href;
                })
                }); 
        }
    })
    .catch(error => {
        alert("something went wrong, please try again later");
        console.error(error);
    });
});


////////////////////////////////////////////////////////////////////////////////////////////////



const delBtns = document.querySelectorAll('a[name="del-btn"]');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const aside = document.querySelector('aside');

var toggleAside = true;


delBtns.forEach(btn=>{
btn.addEventListener("click",function(e){
    e.preventDefault();
    aside.style.display = "block";
    yesBtn.href = btn.href;
})
});





yesBtn.addEventListener("click",function(e){
    e.preventDefault();
    aside.style.display = "none";
    fetch(yesBtn.href)
    .then(response=>{
        if(response.ok)
            return response.json();
        else
            throw new Error("something went wrong");
    })
    .then(data=>{
        console.log(data);
        if(data.statusOk){
            // Force reload the current window from the server
            window.location.reload(true);
        }else{
            alert("something went wrong, please try again later");
        }
    })
    .catch(error=>{
        console.error(error)
        alert("something went wrong, please try again later");
    });    
});



noBtn.addEventListener("click",function(e){
    e.preventDefault();
    aside.style.display = "none";
})