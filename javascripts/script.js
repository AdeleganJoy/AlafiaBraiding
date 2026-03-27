let file;
const form = document.querySelector('form');
let inputFile = document.getElementById("img-input");
let internationalPhNo;
const pageLoader = document.getElementsByClassName("page-loader")[0];
const phNo = document.querySelector("#tel");
const phNoDisplay = document.createElement("p");
const phNoDisplayDiv = document.querySelector("#tel-display");
document.addEventListener("DOMContentLoaded", function(){
  pageLoader.classList.add('didLoad');

});
const phNoObject = window.intlTelInput(phNo, {
  utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
});

phNo.addEventListener("input", function () {
  const countryCode = phNoObject.getSelectedCountryData().dialCode;
  internationalPhNo = `+${countryCode} ${this.value}`;
  phNoDisplay.textContent = internationalPhNo;
  phNoDisplayDiv.appendChild(phNoDisplay);
});

function ImgSizeValidator(file){
  return (file.size < 3 * 1024 * 1024);
}
function ImgTypeValidator(file) {
    var allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    return allowedTypes.includes(file.type);
}
form.addEventListener('submit', async(e) =>{
    e.preventDefault();
    pageLoader.classList.remove('didLoad');
    pageLoader.classList.add('loading');

    if (!phNoObject.isValidNumber()){
      alert("Incorrect phone number: Invalid phone number");
      return;
    }
    
    const imgFormData = new FormData();
    imgFormData.append("file", file);
    imgFormData.append("upload_preset", "hairstyle");

    const res = await fetch("https://api.cloudinary.com/v1_1/deeuemovu/upload", {
        method: "POST",
        body: imgFormData
    })

    if (!res.ok) { 
      alert("Unable to upload image. Please, check that image is .jpeg, .jpg, .webp or .png.");
      return;
    }

    const img_data = await res.json();
    const fd = new FormData(form);
    const booking_obj = Object.fromEntries(fd);
    const isAttachment = (booking_obj.attach != undefined);
    const isBlowdry = (booking_obj.blow != undefined);
    const isBead = (booking_obj.bead != undefined);
    const isCowrie = (booking_obj.cowrie != undefined);
    const isCuff = (booking_obj.cuff != undefined);
    const isWash = (booking_obj.wash != undefined);
    fetch(`https://kspkoznzo5.execute-api.us-west-2.amazonaws.com/dev/bookings`, 
      {
        method: "POST",
        body: JSON.stringify({
        fname: booking_obj.fname,
        tel: internationalPhNo,
        email: booking_obj.mail,
        date: booking_obj.date,
        style: booking_obj.style,
        sty_len: booking_obj.slen,
        natural_len: booking_obj.nlen,
        attachment: isAttachment,
        washing: isWash,
        blowdrying: isBlowdry,
        cowries: isCowrie,
        beads: isBead,
        cuffs: isCuff,
        allergy: booking_obj.allergy,
        notes: booking_obj.note,
        img_url: img_data.secure_url,
        img_pub_id: img_data.public_id
          })
          
        }
      )
      .then(res => res.json())
      
      .then(data=>{
        alert(JSON.stringify(data.message))
        console.log(data);
        console.log(JSON.stringify(data));
        console.log(JSON.stringify(data).message);
      })
      
      .catch(error =>
        alert(error.error)
      );
    pageLoader.classList.remove('loading');
    pageLoader.classList.add('didLoad');

});

inputFile.addEventListener("change", async () => {
  file = inputFile.files[0]; 
  const is_valid_size = ImgSizeValidator(file);
  const is_valid_type = ImgTypeValidator(file);
  if (!is_valid_size || !is_valid_type){
    alert("Unable to upload image. Please, check that image is .jpeg, .jpg, .webp or .png less than 3 MB");
    inputFile.value = '';
  }
});


