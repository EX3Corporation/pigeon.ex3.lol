document.addEventListener('DOMContentLoaded', async () => {
    const servercount = document.getElementById('servercount'); servercount.innerHTML = "<div class='spinner'></div> Loading server count...";
    await new Promise(resolve => setTimeout(resolve, 1400)); // lol
    fetch('https://japi.rest/discord/v1/application/1095523301192904844')
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed");
            }
            return res.json();
        })
        .then(data => {
            const count = data.data.bot.approximate_guild_count;
            servercount.innerHTML = `Currently in <strong><a href="/invite">${count}</a></strong> servers with 42,700+ messages`;
        })
        .catch(err => {
            console.error(err);
            servercount.innerHTML = "<div class='spinner'>/div> Could not fetch guilds";
        });
});