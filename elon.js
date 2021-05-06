const Twit = require('twit');
const dotenv = require('dotenv');
var CryptoJS = require('crypto-js');
const fetch = require('node-fetch');

dotenv.config({ path: './.env' });
var T = new Twit({
	consumer_key: process.env.API_KEY,
	consumer_secret: process.env.API_SECRET_KEY,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

var interval = 10000;
var jumlah = 1000000;

var tweetTerakhir = '';
const elonTweet = () => {
	T.get(
		'statuses/user_timeline',
		{
			screen_name: 'elonmusk',
			count: 1,
		},
		function (error, tweet, response) {
			if (!error) {
				tweet.map((val) => {
					if (tweetTerakhir !== val.text) {
						tweetTerakhir = val.text;
						if (val.text.toLowerCase().includes('doge')) {
							var nonce = Math.floor(Date.now() / 1000);
							var post = `method=trade&pair=doge_idr&type=buy&price=99999999&idr=${jumlah}&nonce=${nonce}`;
							var sha512screet = CryptoJS.HmacSHA512(post, process.env.IX_SECRET_KEY);
							const uri = 'https://indodax.com/tapi/';
							let h = new fetch.Headers();
							h.append('Content-Type', 'application/x-www-form-urlencoded');
							h.append('Sign', sha512screet);
							h.append('Key', process.env.IX_API_KEY);
							let req = new fetch.Request(uri, {
								method: 'POST',
								headers: h,
								body: post,
							});
							fetch(req)
								.then((response) => {
									if (response.ok) {
										return response.json();
									} else {
										throw new Error('gagal');
									}
								})
								.then((jsonData) => {
									console.log(jsonData);
								})
								.catch((err) => {
									console.log('error:', err.message);
								});
						} else {
							console.log('ga ada doge');
						}
					} else {
						console.log('tweet masih sama');
					}
				});
			}
			if (error) {
				console.log(error);
			}
		}
	);
};
setInterval(elonTweet, interval);
