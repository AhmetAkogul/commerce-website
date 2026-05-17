//ai ile tamamlama burdan backende request gönderiyoruz

(() => {
    const input = document.getElementById("aramaKutusuInputu");
    const ghost = document.getElementById("ghostInput");

    let timeout;
    let latestRequestTime = 0;

    if(!input || !ghost) return;

    input.addEventListener("input", ()=>{

        clearTimeout(timeout);
        
        const value = input.value;
        const lowerValue = value.toLowerCase();

        if(value.length < 2){
            ghost.value = "";
            return;
        }

        // Input değiştiğinde mevcut ghost önerisini tut, ama input ile uyuşmazsa sil
        if (ghost.value && !ghost.value.toLowerCase().startsWith(lowerValue)) {
            ghost.value = "";
        }

        timeout = setTimeout(async ()=>{
            const requestTime = Date.now();
            latestRequestTime = requestTime;

            try {
                const res = await fetch("http://localhost:3000/ai-autocomplete",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({text: value})
                });

                const data = await res.json();
                
                // Sadece en son isteğin sonucunu kabul et
                if (latestRequestTime !== requestTime) return;

                if(data.öneri && data.öneri.toLowerCase().startsWith(lowerValue)){
                    // Kullanıcının yazdığı kısmı kendi yazdığı gibi tut, devamını AI önerisiyle tamamla
                    ghost.value = value + data.öneri.slice(value.length);
                }else{
                    ghost.value = "";
                }
            } catch(hata) {
                console.error("hata:", hata);
                // Hata durumunda da eski, geçersiz önerileri temizleyelim
                if (ghost.value && !ghost.value.toLowerCase().startsWith(lowerValue)) {
                    ghost.value = "";
                }
            }

        },300);

    });

    input.addEventListener("keydown",(e)=>{
        if(e.key === "Tab"){
            if (ghost.value && ghost.value.toLowerCase().startsWith(input.value.toLowerCase())) {
                e.preventDefault();
                input.value = ghost.value;
                input.setSelectionRange(input.value.length, input.value.length);
            }
        }
    });

})();
