const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const partikuller = []; // bu diziye partikülleri eklicez

for (let i = 0; i < 100; i++) {
    // 100 tane partikül oluşturmak için
  partikuller.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 5 + 2,
    dx: Math.random() * 2 - 1,
    dy: Math.random() * 2 - 1
  });
}

document.addEventListener('mousemove', e => {
  partikuller.forEach(p => {
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if(dist < 100){
      p.x -= dx/20;
      p.y -= dy/20;
    }
  });
});

function canvass(){
  ctx.clearRect(0,0,canvas.width, canvas.height);
  partikuller.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;

    // bu kısımda border belirtiyoruz ki partiküller oraya çarpıp dursun
    if(p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if(p.y < 0 || p.y > canvas.height) p.dy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fill();
  });
  requestAnimationFrame(canvass);
}

canvass();