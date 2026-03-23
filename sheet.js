const scriptURL = 'https://script.google.com/macros/s/AKfycbyzIPAB1cTBRhqqeTnQry23iOPjuPYyBbNfF-r7sEZrNbCUQw_bAlh07BQefbY-MCoz/exec'

const form = document.forms['contact-form']

form.addEventListener('submit', e => {

  e.preventDefault()

  fetch(scriptURL, { method: 'POST', body: new FormData(form) })
    .then(response => alert("Thank you! Form is submitted"))
    .then(() => { window.location.reload(); })
    .catch(error => console.error('Error!', error.message))
})

// let url = "https://script.google.com/macros/s/AKfycbxc19D9r7CvQLIIE_NPzwxrJEoen-NRSIxjP-M-FfSaTuFHlNxkX5yd6Ka5eUROjZzH/exec";
// let file = document.querySelector("input");
// let img = document.querySelector("img");
// file.addEventListener('change', () => {
//   let fr = new FileReader();
//   fr.addEventListener('loadend', () => {
//     let res = fr.result;
//     img.src = res;
//     let spt = res.split("base64,")[1];
//     // console.log(spt);
//     let obj = {
//       base64: spt,
//       type: file.files[0].type,
//       name: file.files[0].name
//     }
//     fetch(url, {
//       method: "POST",
//       body: JSON.stringify(obj)
//     })
//       .then(r => r.text())
//       .then(data => console.log(data))
//   })
//   fr.readAsDataURL(file.files[0])
// })