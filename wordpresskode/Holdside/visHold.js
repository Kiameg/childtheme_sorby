// URL til Supabase og API-nøgle
const supaBase = "https://ahkjpxfhycgmixtgmfzt.supabase.co/rest/v1/";
const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoa2pweGZoeWNnbWl4dGdtZnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyMTUxODksImV4cCI6MjAzMTc5MTE4OX0.L2DPlw-jWXkOa3pThitSB9Ne0KvqNNa2Hu2e_Bzmx80";

// Vælg containeren og knappen fra DOM'en, hvor hold vises og knappen for at vise hold
const holdContainer = document.querySelector(".hold_oversigt");
const button = document.querySelector(".hold_button");

// Tilføj en Eventlistener til knappen, der kalder funktionen 'visHold', når knappen klikkes
button.addEventListener("click", visHold);

// Funktion til at vise hold
async function visHold() {
  let hold;
  // Vælg aktivt slide baseret på skærmstørrelse
  if (window.screen.width < 500) {
    // Hvis skærmbredden er mindre end 500px, vælg aktivt slide
    hold = document.querySelector(".swiper-slide-active .elementor-carousel-image").ariaLabel;
  } else {
    // Hvis skærmbredden er større, vælg næste slide
    hold = document.querySelector(".swiper-slide-next .elementor-carousel-image").ariaLabel;
  }

  // Hent data for det valgte hold fra Supabase
  const holdData = await getData(hold);

  // Sorter holddata i rækkefølge efter id
  holdData.sort((a, b) => a.id - b.id);

  // Ryd grid container for tidligere data
  const gridParent = document.querySelector("#grid_container .e-con-inner");
  gridParent.innerHTML = "";
  // Opret et template element til at generere HTML-indhold for hvert hold
  const template = document.createElement("template");
  holdData.forEach((hold, index) => {
    // HTML-template for hver hold
    const cardTemplate = `
							<section data-index=${index}>
							  <div>
							     <img fetchpriority="high" style="border-radius:10px;border-style:solid;border-width:thin;border-color:#CFFCFF;" fetchpriority="high" decoding="async" width="1200" height="800" src="${hold.billede}" class="attachment-full size-full wp-image-138" alt="">
							  </div>
							  <div>
								 <h3 style="font-size:2.8rem;font-weight:800;font-family:'Smooch Sans',Sans-serif;margin-bottom:0;text-transform:uppercase;" >${hold.titel}</h3>
							  </div>
							  <div>
								 <p style="margin-bottom:0;font-size:1rem">Niveau: ${hold.niveau}</p>
								 <p style="margin-bottom:0;font-size:1rem">Tid: ${hold.tid}</p>
								 <p style="margin-bottom:0;font-size:1rem">Dag: ${hold.dag}</p>
								 <p style="margin-bottom:0;font-size:1rem;text-wrap:nowrap">Lokation: ${hold.lokation}</p>
							  </div>
							  <div>
								 <button class="dialog_show_btn" data-button-index=${index} style="font-weight:800;margin-top:1rem;font-family:poppins,Sans-serif;background-color:transparent;border:none;color:white;box-shadow:none;padding:0;">LÆS MERE &gt;</button>
							  </div>
							</section>
						 `;
    template.innerHTML = cardTemplate.trim();
    // Tilføj template HTML til DOM'en
    const clone = template.content.cloneNode(true);
    gridParent.append(clone);
    // Tilføj klik-event til "LÆS MERE" knappen for at vise detaljer i en dialog
    document.querySelector(`[data-button-index="${index}"]`).addEventListener("click", () => dialogHandler(hold.slug, index));
  });
}
// Funktion til at vise dialog med detaljeret information om et hold
async function dialogHandler(tableName, index) {
  const dialogClose = document.querySelector(".dialog_hold_close");
  const dialog = document.querySelector("#dialog_hold");

  // Tilføj klik-event for at lukke dialogen
  dialogClose.addEventListener("click", () => (dialog.style.display = "none"));

  // Hent detaljeret data for det valgte hold fra Supabase
  const data = await getSingleData(index, tableName);
  // Opdater dialog med hold data
  dialog.querySelector("#dialog_hold_billede img").src = data.billede;
  dialog.querySelector("#dialog_hold_titel h3").textContent = data.titel;
  dialog.querySelector("#dialog_hold_niveau p").textContent = `Niveau: ${data.niveau}`;
  dialog.querySelector("#dialog_hold_tid p").textContent = `Tid: ${data.tid}`;
  dialog.querySelector("#dialog_hold_dag p").textContent = `Dag: ${data.dag}`;
  dialog.querySelector("#dialog_hold_lokation p").textContent = `Lokation: ${data.lokation}`;
  dialog.querySelector("#dialog_hold_beskrivelse p").textContent = data.beskrivelse;
  dialog.querySelector("#dialog_hold_tilmeld a").href = data.link;
  dialog.style.display = "flex";
}
// Funktion til at hente enkelt data fra Supabase
async function getSingleData(index, tableName) {
  console.log(index + 1, tableName);
  try {
    // Lav en GET-forespørgsel til Supabase for at hente data for et enkelt hold
    const response = await fetch(`${supaBase}${tableName}?id=eq.${index + 1}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apikey}`,
        apikey: apikey,
      },
    });
    // Parse JSON responsen
    const data = await response.json();
    return data[0]; // Returner første resultat
  } catch (error) {
    // Log en fejl, hvis forespørgslen fejler
    console.log("Error: " + error);
  }
}
// Funktion til at hente data fra Supabase
async function getData(tableName) {
  try {
    // Lav en GET-forespørgsel til Supabase for at hente data for alle hold
    const response = await fetch(`${supaBase}${tableName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apikey}`,
        apikey: apikey,
      },
    });
    // Parse JSON responsen
    const data = await response.json();
    return data; // Returner data
  } catch (error) {
    // Log en fejl, hvis forespørgslen fejler
    console.log("Error: " + error);
  }
}
