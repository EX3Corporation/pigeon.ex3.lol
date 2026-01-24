async function load() {
    document.getElementById("guild").textContent = "Loading...";
    const transcript = new URLSearchParams(window.location.search).get("chat");
    if (!transcript) return document.getElementById("transcript").innerHTML = '<p class="errmsg">no chat ID provided</p>';

    const url = `https://p.exerinity.com/${transcript}.json`;
    document.getElementById("raw").href = url;

    const response = await fetch(url);
    if (!response.ok) return document.getElementById("transcript").innerHTML = '<p class="errmsg">That ID was invalid. Chats expire after 3 days.</p>';

    const data = await response.json();

    document.getElementById("guild").textContent = `Guild: ${data.metadata.guild} (ID: ${data.metadata.guildId})`;
    document.getElementById("user").textContent = `User: ${data.metadata.user}`;
    document.getElementById("messages").textContent = `Message count: ${data.messages.length}`;
    document.title = `${data.metadata.user}'s chat in ${data.metadata.guild} / pigeon`;

    const created = data.metadata.created * 1000;
    const expat = created + 3 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    let note = `Created on ${new Date(created).toLocaleString()} (`;
    if (expat > now) {
        const msLeft = expat - now;
        const days = Math.floor(msLeft / (24 * 60 * 60 * 1000));
        const hours = Math.floor((msLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        note += `Expires in: ${days} day${days !== 1 ? "s" : ""} / ${hours} hour${hours !== 1 ? "s" : ""})`;
    } else {
        note += "Expired";
    }
    document.getElementById("expires").innerHTML = note;

    const container = document.getElementById("transcript");
    container.innerHTML = "";

    data.messages.forEach((message) => {
        const bubble = document.createElement("div");
        const iu = "user" in message;
        const sender = iu ? data.metadata.user : "pigeon";
        const content = iu ? message.user : message.ai;

        bubble.className = "bubble " + (iu ? "user" : "pigeon");
        bubble.innerHTML = `
                        <div class="sender">${sender}</div>
                        <div class="content">${content}</div>
                    `;
        container.appendChild(bubble);
    });

}

load();