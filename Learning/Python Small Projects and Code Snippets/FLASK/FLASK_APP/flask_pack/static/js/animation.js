/*
const hero = document.getElementsByClassName('hero');
const slider = document.querySelector('.slider');
const student = document.getElementsByClassName('student')[0];
const headline = document.querySelector('.headline');


const t1 = new TimelineMax();

t1.fromTo(hero, 1, {height:"0%"}, {height:"80%", ease: Power2.easeInOut})
.fromTo(hero, 1,{width:"100%"}, {width:"80%", ease: Power2.easeInOut})
.fromTo(slider, 1, {x: "-100%"}, {x: "0%", ease: Power2.easeInOut}, "-=1")

*/

function scrollIntoView(){
    var text = document.getElementById('project-text');
    var image = document.getElementById('project-img');
    const div = document.getElementById('projects');
    var introPosition = div.getBoundingClientRect().top;
    var screenHeigth = window.innerHeight / 1.3;
    if (introPosition < screenHeigth && text.classList.contains('animated') === false){
        console.log("hello");
        text.classList.add('animated');
        image.classList.add('animated');
        const anim1 = new TimelineMax();
        anim1.fromTo(text, 1.5, {height:"-10%", opacity:"0"}, {height:"80%", opacity:"1" ,ease: Power2.easeInOut})
        .fromTo(image, 1.5, {height:"80%", opacity:"0"}, {height:"110%", opacity:"1" ,ease: Power2.easeInOut}, "-=1.3")
    }
    
}

addEventListener('scroll', scrollIntoView);