import {
  signUpFirebase,
  signInFirebase,
  postAdToDb,
  uploadImage,
  getRealtimeAds
} from "./app.js";


window.signUp = function () {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let age = document.getElementById("age").value;

  try {
    signUpFirebase({ email, password, name, age });
    {
      alert("The user is registered successfully.");
    }
  } catch (e) {
    const error_msg = document.getElementById("error");
    error_msg.innerHTML = e.message;
  }
  name.value="";
  email.value="";
  password.value = "";
  age.value = "";
}

window.logIn = async function()
{
  let email = document.getElementById("login_email");
  let password = document.getElementById("login_password");
  try{
    let userCredential = await signInFirebase(email.value, password.value)

    {
      alert("Successfully signed in with the Id --> "+ userCredential.user.uid);
    }
  }
  catch(e)
  {
    const error_msg = document.getElementById("error");
    error_msg.innerHTML = e.message;
  }
  email.value="";
  password.value="";
}




window.show_Ad = async function () {
  var title_input = document.getElementById("title");
  var price_input = document.getElementById("price");
  var des_input = document.getElementById("description");
  var loc_input = document.getElementById('location');
  var contact_number = document.getElementById('contact');

  debugger;
  var image = document.getElementById("image").files[0];

  try {
    const imageURL = await uploadImage(image);
    postAdToDb(title_input.value, price_input.value, des_input.value, imageURL,loc_input.value,contact_number.value);
    {
      alert("Post is live now and also stored in database.");
    }
  } catch (e) {
    alert("An error occurred in posting an Ad -->\n " + e.message);
  }
  title_input.value = "";
  price_input.value = "";
  des_input.value = "";
  image.value = "";
  loc_input.value="";
  contact_number.value="";
};


getAds()
function getAds() {
  //1
  getRealtimeAds((ads) => {
      //4
      const adsElem = document.getElementById('ads_2')

      adsElem.innerHTML = ''
      for (let item of ads) {
          adsElem.innerHTML +=`
          <div onclick="goToDetail('${item.id}')" class="ads_styling">
            <label id="ads_styling_label">Image: </label> 
             <img src=${item.imageURL} width='350px' height='180px'>
             <label id="ads_styling_label">Product Title: </label> 
             <h2>${item.title} </h2>
             <label id="ads_styling_label">Product Description: </label> 
             <h2> Description: ${item.description} </h2>
             <label id="ads_styling_label">Product Price: </label> 
             <h2> Price: ${item.price} </h2>
             <label id="ads_styling_label">Product Seller Id: </label> 
             <h2> Price: ${item.userId} </h2>
      </div>`
      }
  })
}

window.goToDetail = async function (id) {
  location.href = `home.html?id=${id}`;
}

// window.goToDetail2 = async function (title) {
//   location.href = `olx details.html?title=${title}`;
// }




// Open login form function --> self-made f(n).
window.open_login = function () {
  let login_container = document.getElementById("login_form");
  login_container.style.display = "block";
};

window.open_login_2 = function()
{
  let login_container = document.getElementById("login_2_div");
  login_container.style.display = "block";
}

// Open ad details form.
window.openForm = function () {
  var form_div = document.getElementById("Ad_details");
  form_div.style.display = "block";
};

// Open ad details form.
window.hide_form = function () {
  var form_div = document.getElementById("Ad_details");
  form_div.style.display = "none";
};

// close login form function --> self-made f(n).
window.remove_login = function () {
  let login_container = document.getElementById("login_form");
  let login_container2 = document.getElementById("login_2_div");
  login_container2.style.display = "none";
  login_container.style.display = "none";
};



