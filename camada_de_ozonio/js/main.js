//Swiper slider
var swiper = new Swiper(".bg-slider-thumbs", {
  loop: true,
  spaceBetween: 0,
  slidesPerView: 0,
});
var swiper2 = new Swiper(".bg-slider", {
  loop: true,
  spaceBetween: 0,
  thumbs: {
    swiper: swiper,
  },
});

document.getElementById("myButton1").onclick = function () {
  location.href = "https://www.wwf.org.br/natureza_brasileira/questoes_ambientais/camada_ozonio/";
};

document.getElementById("myButton2").onclick = function () {
  location.href = "https://ozone.unep.org/ozone-and-you#:~:text=When%20an%20ozone%20molecule%20absorbs,radiation%20from%20reaching%20Earth%27s%20surface.";
};

document.getElementById("myButton3").onclick = function () {
  location.href = "https://brasilescola.uol.com.br/geografia/camada-de-ozonio.htm#Destruição+da+camada+de+ozônio";
};

document.getElementById("myButton4").onclick = function () {
  location.href = "https://www.bbc.com/portuguese/geral-59053884#:~:text=Os%20pesquisadores%20estimam%20que%20até,estar%20totalmente%20recomposta%20em%202060.";
};
