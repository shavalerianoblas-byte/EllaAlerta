function navegarA(idDestino) {
    let pantallas = document.querySelectorAll('main > section');
    
    for (let i = 0; i < pantallas.length; i++) {
        pantallas[i].classList.add('pantalla-oculta');
    }
    
    document.getElementById(idDestino).classList.remove('pantalla-oculta');
    
    window.scrollTo(0, 0);
}