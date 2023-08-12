let image = document.createElement("img");
image.id = "dog";
document.getElementById("button-show-breed").addEventListener("click", showADogInBaseOffSearch);
document.getElementById("button-show-sub-breed").addEventListener("click", showAListOfSubBreed);
document.getElementById("button-show-all").addEventListener("click", showAllBreeds);
let container = document.getElementById("content");
const clearContent = () => {
    if(container.childElementCount > 0){
        let child = container.firstElementChild;
        while (child){
            container.removeChild(child);
            child = container.firstElementChild;
        }
    }
}

async function showRandomDog() {
    try{
        // fetch(dogAPI)
        //     .then(response => response.json())
        //     .then(data => {
        //         content.innerHTML = `<img src="${data.message}" alt="Random Photo of a Dog" />`;
        //     })
        //
        const response = await fetch("https://dog.ceo/api/breeds/image/random");
        const data = await response.json();

        image.src = data.message;
        let imageContainer = document.createElement("div");
        imageContainer.classList.add("dog-container");
        imageContainer.appendChild(image);
        clearContent();
        container.appendChild(imageContainer);
    } catch(error){
        console.log(error);
    }
}


async function showADogInBaseOffSearch(){
    try{

        let text = document.querySelector("#input-breed").value;
        let breed = text.toLowerCase();
        const response = await fetch("https://dog.ceo/api/breed/"+breed+"/images");
        const data = await response.json();
        let status = data.status;
        if (status === "success"){
            clearContent();
            for (const statusKey in data.message) {
                let image = document.createElement("img");
                image.classList.add("dog");
                image.src = data.message[statusKey];
                let imageContainer = document.createElement("div");
                imageContainer.classList.add("dog-container");
                imageContainer.appendChild(image);
                container.appendChild(imageContainer);
            }
        }else{
            //innerHTML remplaza el contenido
            clearContent();
            container.innerHTML = `<p>Breed not found!</p>`;
        }
    }catch (error){
        console.log(error);
    }
}
async function showAListOfSubBreed(){
    try{
        clearContent();
        let text = document.querySelector("#input-breed").value;
        let breed = text.toLowerCase();
        const response = await fetch("https://dog.ceo/api/breed/"+breed+"/list");
        const data = await response.json();
        let status = data.status;
        let container = document.getElementById("content");
        if (status === "success" && data.message.length !== 0){
            container.innerHTML = createAListElementsOfSubBreeds(data);
        }else if (data.message.length === 0){
            container.innerHTML = `<p>No sub-breeds found!</p>`;
        }else{
            container.innerHTML = `<p>Breed not found!</p>`;
        }
    }catch (error){
        console.log(error);
    }
}
function createAListElementsOfSubBreeds(data){
    let array = data.message;
    let list = "<ol>";
    let elementsOfList = "";
    array.forEach((item) => {
        elementsOfList = elementsOfList + "<li>" + item+ "</li>";
    });
    list = list + elementsOfList;
    list = list + "</ol>";
    return list;
}

function createAListWithAllBreeds(data){
    let breedsObject = data.message;
    let list = "<ol>";
    let elementsOfList = "";
    for (const key in breedsObject) {
        elementsOfList = elementsOfList + "<li>" +key;
        if (breedsObject[key].length !== 0){
            elementsOfList = elementsOfList + "<ul><li>";
            let quantityOfSubBreeds = breedsObject[key].length;
            for (const indexKey in breedsObject[key]) {
                if (Number(indexKey) !== quantityOfSubBreeds-1){
                    elementsOfList = elementsOfList + breedsObject[key][indexKey]+",";
                }else{
                    elementsOfList = elementsOfList + breedsObject[key][indexKey];

                }
            }
            elementsOfList = elementsOfList + "</li></ul>"
        }
        elementsOfList = elementsOfList + "</li>"
    }
    elementsOfList = elementsOfList + "</ol>"

    list = list + elementsOfList;
    return list;
}
//Change this

async function showAllBreeds(){
    try{
        clearContent();
        const response = await fetch("https://dog.ceo/api/breeds/list/all");
        const data = await response.json();
        container.innerHTML = createAListWithAllBreeds(data);
    }catch (e){
        console.log(e);
    }
}