const xhr = new XMLHttpRequest();

xhr.addEventListener('load', () => {
  console.log(xhr.response);
  
});

xhr.open('GET', 'URL');
xhr.send();