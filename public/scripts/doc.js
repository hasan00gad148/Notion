const delBtn = document.querySelector('.del-btn');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const aside = document.querySelector('aside');

var toggleAside = true;
console.log(`/collections/${aside.dataset.collection_id}`);

delBtn.addEventListener("click",function(e){
    e.preventDefault();
    aside.style.display = "block";
    yesBtn.href = delBtn.href;
})

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
            window.location.href = `/collections/${aside.dataset.collection_id}`;
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