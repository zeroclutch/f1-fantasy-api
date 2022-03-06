module.exports = function() {
    return { 
        'authority': 'api.formula1.com', 
        'pragma': 'no-cache', 
        'cache-control': 'no-cache', 
        // TODO: May need to randomly select from a number of options to spoof user ID
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"', 
        'dnt': '1', 
        'sec-ch-ua-mobile': '?0', 
        'user-agent': 'RaceControl', 
        'Content-Type': 'application/json', 
        'accept': 'application/json, text/javascript, */*; q=0.01', 
        'apikey': 'fCUCjWrKPu9ylJwRAv8BpGLEgiAuThx7', 
        'sec-ch-ua-platform': '"macOS"', 
        'origin': 'https://account.formula1.com', 
        'sec-fetch-site': 'same-site', 
        'sec-fetch-mode': 'cors', 
        'sec-fetch-dest': 'empty', 
        'referer': 'https://account.formula1.com/', 
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
    }
}