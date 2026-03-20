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
form.addEventListener('submit', async(e) =>{
    e.preventDefault();
    pageLoader.classList.remove('didLoad');
    pageLoader.classList.add('loading');

    if (!phNoObject.isValidNumber()){
      alert("Incorrect phone number: Invalid phone number");
    }
    else{
      const fd = new FormData(form);
      const booking_obj = Object.fromEntries(fd);
      const isAttachment = (booking_obj.attach != undefined);
      const isBlowdry = (booking_obj.blow != undefined);
      const isBead = (booking_obj.bead != undefined);
      const isCowrie = (booking_obj.cowrie != undefined);
      const isCuff = (booking_obj.cuff != undefined);
      const isWash = (booking_obj.wash != undefined);

      const imgFormData = new FormData();

      imgFormData.append("file", file);
      imgFormData.append("upload_preset", "hairstyle");

      const res = await fetch("https://api.cloudinary.com/v1_1/deeuemovu/upload", {
        method: "POST",
        body: imgFormData
      })
      if (!res.ok) { 
      throw new Error(`An error has occurred: ${res.status}`);
    }

      const data = await res.json();
      
      const booking_info = {
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
        img_url: data.secure_url,
        img_pub_id: data.public_id
      }
      
      fetch(`https://dyjo4fteuhzzm65lg3w7ri3oim0ncjij.lambda-url.us-west-2.on.aws/`, 
        {
          method: "POST",
          body: JSON.stringify(booking_info)
          
        }
      )
      .then(res => res.json())
      
      .then(data=>{
        console.log(data);
      })
      
      .catch(error =>
        alert(error)
      );
    }
    pageLoader.classList.remove('loading');
    pageLoader.classList.add('didLoad');

});

inputFile.addEventListener("change", async () => {
  file = inputFile.files[0]; 
  const is_valid_size = ImgSizeValidator(file);
  if (!is_valid_size){
    alert("Incorrect file size: File must be less than 3Mb");
    inputFile.value = '';
  }
});


