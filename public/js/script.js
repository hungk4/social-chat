var socket = io();

// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
 const uploadInput = uploadImage.querySelector("[upload-image-input]");
 const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

 uploadInput.addEventListener("change", () => {
  const file = uploadInput.files[0];
  if(file) {
    uploadImagePreview.src = URL.createObjectURL(file);
  }
 });
}
// End Upload Image

// show-alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
  let time = showAlert.getAttribute("show-alert") || 3000;
  time = parseInt(time);

  setTimeout(() => {
    showAlert.classList.add("hidden");
  }, time);
}
// End show-alert