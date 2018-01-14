class FetchService {
    static postMessageToDiscord(message: string) {
        const discordUrl =
            'https://discordapp.com/api/webhooks/401954827279794176/3bgGP8IhF77frDRBLr47LK54H7zoYjgPowauLx6ACw0xsDZBCmpFbiYf7S6FbCEE1LoX';
        const payload = JSON.stringify({ content: message });
        const params = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: payload
        };
        // console.log(message);
        fetch(discordUrl, params);
    }
}

export default FetchService;
